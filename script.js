const contactTargets = {
  email: "solutionsgohl@gmail.com",
  whatsapp: "5565992517246",
};

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const year = document.querySelector("#year");
const contactForm = document.querySelector("#contact-form");
const preview = document.querySelector("#message-preview");
const logoLockup = document.querySelector(".logo-lockup");
const logoImage = document.querySelector(".logo-image");
const authModal = document.querySelector("#auth-modal");
const authNote = document.querySelector("#auth-note");
const serviceSelect = document.querySelector("#service");
const priceInput = document.querySelector("#price");
const logoutButton = document.querySelector(".logout-button");

year.textContent = new Date().getFullYear();

setupLogoFallback(logoImage, logoLockup);
setupLogoFallback(document.querySelector(".auth-logo"), document.querySelector(".auth-brand"));
restoreSession();
syncSelectedPrice();

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
});

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    document.querySelectorAll(".filter-button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    document.querySelectorAll(".service-card").forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

document.querySelectorAll(".service-action").forEach((action) => {
  action.addEventListener("click", (event) => {
    event.preventDefault();

    const card = action.closest("[data-service]");
    const service = action.dataset.service || card?.dataset.service || "Serviço personalizado";
    const price = action.dataset.price || card?.dataset.price || "Sob orçamento";
    const mode = action.dataset.mode || (action.textContent.includes("Contratar") ? "Contratar agora" : "Solicitar orçamento");

    setRequestType(mode);
    setService(service, price);
    document.querySelector("#contato")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

serviceSelect.addEventListener("change", syncSelectedPrice);

document.querySelectorAll(".login-open").forEach((button) => {
  button.addEventListener("click", () => {
    openAuth(button.dataset.authMode || "login");
  });
});

document.querySelectorAll("[data-auth-close]").forEach((target) => {
  target.addEventListener("click", closeAuth);
});

document.querySelectorAll("[data-auth-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    setAuthMode(button.dataset.authTab);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && authModal.classList.contains("open")) {
    closeAuth();
  }
});

document.querySelector("#login-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const email = String(formData.get("email")).trim();
  const fallbackName = email.split("@")[0] || "Cliente Göhl";

  saveSession({ name: titleCase(fallbackName.replace(/[._-]+/g, " ")), email });
  authNote.textContent = "Login realizado nesta demonstração. No backend real, esta etapa usará JWT, bcrypt e sessão segura.";
  closeAuthSoon();
});

document.querySelector("#register-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const name = String(formData.get("name")).trim();
  const email = String(formData.get("email")).trim();

  saveSession({ name, email });
  authNote.textContent = "Conta criada nesta demonstração. A confirmação por e-mail entra quando o backend for implementado.";
  closeAuthSoon();
});

document.querySelector("#recover-form").addEventListener("submit", (event) => {
  event.preventDefault();
  authNote.textContent = "Solicitação de recuperação preparada. No backend real, o link será enviado por e-mail.";
  setTimeout(() => setAuthMode("login"), 900);
});

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("gohlClientSession");
  updateSession(null);
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const requestType = formData.get("requestType");
  const service = formData.get("service");
  const price = formData.get("price");
  const name = String(formData.get("name")).trim();
  const contact = String(formData.get("contact")).trim();
  const message = String(formData.get("message")).trim();

  const formatted = [
    "Olá, Göhl Solutions!",
    `Meu nome é ${name}.`,
    `Tipo de solicitação: ${requestType}.`,
    `Serviço desejado: ${service}.`,
    `Referência de preço: ${price}.`,
    `Meu contato é: ${contact}.`,
    "",
    "Descrição do projeto:",
    message,
  ].join("\n");

  const mailto = `mailto:${contactTargets.email}?subject=${encodeURIComponent(
    `${requestType} Göhl Solutions - ${service}`
  )}&body=${encodeURIComponent(formatted)}`;

  const whatsapp = `https://wa.me/${contactTargets.whatsapp}?text=${encodeURIComponent(formatted)}`;

  preview.innerHTML = `
    <span>Mensagem pronta</span>
    <p>${escapeHtml(formatted)}</p>
    <a href="${whatsapp}" target="_blank" rel="noreferrer">Enviar pelo WhatsApp</a>
    <a href="${mailto}">Enviar por e-mail</a>
  `;
});

function setupLogoFallback(image, container) {
  if (!image || !container) return;

  if (image.complete && image.naturalWidth > 0) {
    container.classList.add("logo-loaded");
  } else if (image.complete && image.naturalWidth === 0) {
    container.classList.remove("logo-loaded");
  } else {
    container.classList.add("logo-loading");
  }

  image.addEventListener("load", () => {
    container.classList.remove("logo-loading");
    container.classList.add("logo-loaded");
  });

  image.addEventListener("error", () => {
    container.classList.remove("logo-loading");
    container.classList.remove("logo-loaded");
  });
}

function openAuth(mode) {
  setAuthMode(mode);
  authModal.classList.add("open");
  authModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  const firstInput = authModal.querySelector(".auth-form.active input");
  firstInput?.focus();
}

function closeAuth() {
  authModal.classList.remove("open");
  authModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function closeAuthSoon() {
  setTimeout(closeAuth, 700);
}

function setAuthMode(mode) {
  document.querySelectorAll(".auth-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.authTab === mode);
  });

  document.querySelectorAll(".auth-form").forEach((form) => {
    form.classList.toggle("active", form.dataset.authForm === mode);
  });
}

function saveSession(session) {
  localStorage.setItem("gohlClientSession", JSON.stringify(session));
  updateSession(session);
}

function restoreSession() {
  const rawSession = localStorage.getItem("gohlClientSession");

  if (!rawSession) {
    updateSession(null);
    return;
  }

  try {
    updateSession(JSON.parse(rawSession));
  } catch {
    localStorage.removeItem("gohlClientSession");
    updateSession(null);
  }
}

function updateSession(session) {
  const isLoggedIn = Boolean(session);
  const displayName = session?.name || "Visitante";

  document.querySelectorAll(".login-open").forEach((button) => {
    if (button.closest(".client-login-panel")) return;
    button.hidden = isLoggedIn;
  });

  logoutButton.hidden = !isLoggedIn;

  document.querySelector(".session-label").textContent = isLoggedIn ? "Cliente logado" : "Aguardando login";
  document.querySelector(".client-name").textContent = displayName;
  document.querySelector(".portal-name").textContent = isLoggedIn ? displayName : "Faça login para visualizar";
  document.querySelector(".auth-status").textContent = isLoggedIn ? "Sessão ativa" : "Seguro";
  document.querySelector(".auth-pill").textContent = isLoggedIn ? "Conta conectada" : "Sessão protegida";
}

function syncSelectedPrice() {
  const option = serviceSelect.selectedOptions[0];
  priceInput.value = option?.dataset.price || "Sob orçamento";
}

function setService(service, price) {
  const matchingOption = Array.from(serviceSelect.options).find((option) => option.value === service);

  if (matchingOption) {
    serviceSelect.value = matchingOption.value;
  } else {
    serviceSelect.value = "Outro serviço";
  }

  priceInput.value = price;
}

function setRequestType(mode) {
  const normalized = mode.toLowerCase().includes("contrat") ? "Contratar agora" : "Solicitar orçamento";
  const option = document.querySelector(`input[name="requestType"][value="${normalized}"]`);

  if (option) {
    option.checked = true;
  }
}

function titleCase(value) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
