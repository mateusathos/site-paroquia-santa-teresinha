const state = {
  avisos: [],
  editingId: null
};

const elements = {
  loadingView: document.getElementById("loading-view"),
  loginView: document.getElementById("login-view"),
  adminView: document.getElementById("admin-view"),
  loginForm: document.getElementById("login-form"),
  loginButton: document.getElementById("login-button"),
  loginError: document.getElementById("login-error"),
  password: document.getElementById("admin-password"),
  togglePasswordButton: document.getElementById("toggle-password-button"),
  passwordEyeIcon: document.getElementById("password-eye-icon"),
  passwordEyeOffIcon: document.getElementById("password-eye-off-icon"),
  newAvisoButton: document.getElementById("new-aviso-button"),
  logoutButton: document.getElementById("logout-button"),
  adminCount: document.getElementById("admin-count"),
  adminMessage: document.getElementById("admin-message"),
  emptyState: document.getElementById("empty-state"),
  avisosList: document.getElementById("avisos-list"),
  avisoForm: document.getElementById("aviso-form"),
  avisoId: document.getElementById("aviso-id"),
  avisoTitulo: document.getElementById("aviso-titulo"),
  avisoDescricao: document.getElementById("aviso-descricao"),
  formTitle: document.getElementById("form-title"),
  formSubtitle: document.getElementById("form-subtitle"),
  cancelEditButton: document.getElementById("cancel-edit-button"),
  saveAvisoButton: document.getElementById("save-aviso-button")
};

function showView(view) {
  elements.loadingView.classList.toggle("hidden", view !== "loading");
  elements.loginView.classList.toggle("hidden", view !== "login");
  elements.adminView.classList.toggle("hidden", view !== "admin");
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || "Nao foi possivel concluir a acao.");
    error.status = response.status;
    throw error;
  }

  return data;
}

function setLoginError(message) {
  elements.loginError.textContent = message;
  elements.loginError.classList.toggle("hidden", !message);
}

function setAdminMessage(message, type = "success") {
  elements.adminMessage.textContent = message;
  elements.adminMessage.className = "mb-4 rounded-md px-4 py-3 text-sm font-semibold";
  elements.adminMessage.classList.add(
    type === "error" ? "bg-red-50" : "bg-emerald-50",
    type === "error" ? "text-red-900" : "text-emerald-900"
  );
  elements.adminMessage.classList.toggle("hidden", !message);

  if (message && type !== "error") {
    window.setTimeout(() => {
      elements.adminMessage.classList.add("hidden");
    }, 3000);
  }
}

function formatDate(value) {
  if (!value) return "";

  const date = new Date(value.replace(" ", "T") + "Z");

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function buildAvisoCard(aviso) {
  const article = document.createElement("article");
  article.className = "rounded-lg border border-red-950/10 bg-white p-4 shadow-sm";

  const header = document.createElement("div");
  header.className = "flex items-start justify-between gap-3";

  const content = document.createElement("div");
  content.className = "min-w-0";

  const title = document.createElement("h2");
  title.className = "break-words text-lg font-bold text-red-950";
  title.textContent = aviso.titulo;

  const date = document.createElement("p");
  date.className = "mt-1 text-xs font-semibold text-stone-500";
  date.textContent = aviso.atualizado_em ? `Atualizado em ${formatDate(aviso.atualizado_em)}` : "";

  content.append(title, date);

  const actions = document.createElement("div");
  actions.className = "flex shrink-0 gap-2";

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "rounded-md border border-stone-300 px-3 py-2 text-xs font-bold text-stone-800 transition hover:bg-stone-100";
  editButton.textContent = "Editar";
  editButton.addEventListener("click", () => startEditing(aviso));

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "rounded-md border border-red-900 px-3 py-2 text-xs font-bold text-red-900 transition hover:bg-red-900 hover:text-white";
  deleteButton.textContent = "Excluir";
  deleteButton.addEventListener("click", () => deleteAviso(aviso.id));

  actions.append(editButton, deleteButton);
  header.append(content, actions);

  const description = document.createElement("p");
  description.className = "mt-4 whitespace-pre-line break-words text-sm leading-relaxed text-stone-700";
  description.textContent = aviso.descricao;

  article.append(header, description);
  return article;
}

function renderAvisos() {
  elements.avisosList.replaceChildren();

  const count = state.avisos.length;
  elements.adminCount.textContent = `${count} ${count === 1 ? "aviso" : "avisos"}`;
  elements.emptyState.classList.toggle("hidden", count > 0);

  state.avisos.forEach((aviso) => {
    elements.avisosList.appendChild(buildAvisoCard(aviso));
  });
}

function resetForm() {
  state.editingId = null;
  elements.avisoId.value = "";
  elements.avisoTitulo.value = "";
  elements.avisoDescricao.value = "";
  elements.formTitle.textContent = "Novo aviso";
  elements.formSubtitle.textContent = "Título e descrição aparecem no site.";
  elements.cancelEditButton.classList.add("hidden");
  elements.saveAvisoButton.textContent = "Salvar aviso";
}

function startEditing(aviso) {
  state.editingId = aviso.id;
  elements.avisoId.value = aviso.id;
  elements.avisoTitulo.value = aviso.titulo;
  elements.avisoDescricao.value = aviso.descricao;
  elements.formTitle.textContent = "Editar aviso";
  elements.formSubtitle.textContent = "Atualize o conteúdo exibido no site.";
  elements.cancelEditButton.classList.remove("hidden");
  elements.saveAvisoButton.textContent = "Atualizar aviso";
  elements.avisoTitulo.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function loadAvisos() {
  const data = await requestJson("/api/admin/avisos");
  state.avisos = data.avisos || [];
  renderAvisos();
}

async function checkSession() {
  showView("loading");

  try {
    const data = await requestJson("/api/admin/session");

    if (!data.authenticated) {
      showView("login");
      elements.password.focus();
      return;
    }

    await loadAvisos();
    showView("admin");
  } catch (error) {
    showView("login");
    setLoginError(error.message);
  }
}

elements.loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setLoginError("");
  elements.loginButton.disabled = true;
  elements.loginButton.textContent = "Entrando...";

  try {
    await requestJson("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ password: elements.password.value })
    });

    elements.password.value = "";
    await loadAvisos();
    showView("admin");
  } catch (error) {
    setLoginError(error.message);
  } finally {
    elements.loginButton.disabled = false;
    elements.loginButton.textContent = "Entrar";
  }
});

elements.logoutButton.addEventListener("click", async () => {
  await requestJson("/api/admin/logout", { method: "POST", body: "{}" }).catch(() => null);
  resetForm();
  state.avisos = [];
  showView("login");
  elements.password.focus();
});

elements.togglePasswordButton.addEventListener("click", () => {
  const shouldShowPassword = elements.password.type === "password";

  elements.password.type = shouldShowPassword ? "text" : "password";
  elements.passwordEyeIcon.classList.toggle("hidden", shouldShowPassword);
  elements.passwordEyeOffIcon.classList.toggle("hidden", !shouldShowPassword);
  elements.togglePasswordButton.setAttribute("aria-label", shouldShowPassword ? "Ocultar senha" : "Mostrar senha");
  elements.togglePasswordButton.setAttribute("aria-pressed", String(shouldShowPassword));
  elements.password.focus();
});

elements.newAvisoButton.addEventListener("click", () => {
  resetForm();
  elements.avisoTitulo.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

elements.cancelEditButton.addEventListener("click", resetForm);

elements.avisoForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setAdminMessage("");
  elements.saveAvisoButton.disabled = true;
  elements.saveAvisoButton.textContent = state.editingId ? "Atualizando..." : "Salvando...";

  const payload = {
    titulo: elements.avisoTitulo.value,
    descricao: elements.avisoDescricao.value
  };

  if (state.editingId) {
    payload.id = state.editingId;
  }

  try {
    await requestJson("/api/admin/avisos", {
      method: state.editingId ? "PUT" : "POST",
      body: JSON.stringify(payload)
    });

    resetForm();
    await loadAvisos();
    setAdminMessage("Aviso salvo.");
  } catch (error) {
    if (error.status === 401) {
      showView("login");
      return;
    }

    setAdminMessage(error.message, "error");
  } finally {
    elements.saveAvisoButton.disabled = false;
    elements.saveAvisoButton.textContent = state.editingId ? "Atualizar aviso" : "Salvar aviso";
  }
});

async function deleteAviso(id) {
  const shouldDelete = window.confirm("Excluir este aviso?");

  if (!shouldDelete) return;

  try {
    await requestJson("/api/admin/avisos", {
      method: "DELETE",
      body: JSON.stringify({ id })
    });

    if (state.editingId === id) {
      resetForm();
    }

    await loadAvisos();
    setAdminMessage("Aviso excluido.");
  } catch (error) {
    if (error.status === 401) {
      showView("login");
      return;
    }

    setAdminMessage(error.message, "error");
  }
}

checkSession();
