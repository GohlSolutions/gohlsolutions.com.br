const contactTargets = {
  email: "contato@gohlsolutions.com.br",
  whatsapp: "5565992517246",
};

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const year = document.querySelector("#year");
const contactForm = document.querySelector("#contact-form");
const preview = document.querySelector("#message-preview");

year.textContent = new Date().getFullYear();

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
});

document.querySelectorAll("[data-service-choice]").forEach((link) => {
  link.addEventListener("click", () => {
    const service = link.dataset.serviceChoice;
    const option = document.querySelector(`input[name="service"][value="${service === "app" ? "App" : service}"]`);

    if (option) {
      option.checked = true;
    }
  });
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const service = formData.get("service");
  const name = String(formData.get("name")).trim();
  const contact = String(formData.get("contact")).trim();
  const message = String(formData.get("message")).trim();

  const formatted = [
    "Olá, Göhl Solutions!",
    `Meu nome é ${name}.`,
    `Quero falar sobre: ${service}.`,
    `Meu contato é: ${contact}.`,
    "",
    "Mensagem:",
    message,
  ].join("\n");

  const mailto = `mailto:${contactTargets.email}?subject=${encodeURIComponent(
    `Orçamento Göhl Solutions - ${service}`
  )}&body=${encodeURIComponent(formatted)}`;

  const whatsapp = `https://wa.me/${contactTargets.whatsapp}?text=${encodeURIComponent(formatted)}`;

  preview.innerHTML = `
    <span>Mensagem pronta</span>
    <p>${escapeHtml(formatted)}</p>
    <a href="${whatsapp}" target="_blank" rel="noreferrer">Enviar pelo WhatsApp</a>
    <a href="${mailto}">Enviar por e-mail</a>
  `;
});

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
