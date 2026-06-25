const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

// CONTATOS OFICIAIS DA GÖHL SOLUTIONS
// O Gmail abaixo abre direto no Gmail Web, sem chamar o app de e-mail do Windows.
const GOHL_EMAIL = 'solutionsgohl@gmail.com';

// IMPORTANTE: troque pelo WhatsApp oficial da empresa, só números com DDI e DDD.
// Exemplo Cuiabá: 5565999999999
const GOHL_WHATSAPP = '5565999999999';

const menuBtn = $('.menu-btn');
const links = $('.links');
if (menuBtn && links) {
  menuBtn.addEventListener('click', () => links.classList.toggle('open'));
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: .12 });
$$('.reveal').forEach(el => observer.observe(el));

function moneyBR(value){ return Number(value || 0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); }

const serviceSelect = $('#service');
const budgetHint = $('#budgetHint');
const budgets = {
  'Landing Page': 'A partir de R$ 250. O orçamento final depende do escopo.',
  'Site Profissional': 'A partir de R$ 350. O orçamento final depende do escopo.',
  'Aplicativo / Sistema': 'A partir de R$ 1.500. O orçamento final depende do escopo.',
  'Göhl Email Bot Pro': 'Mensal: R$ 49,90/mês por PC. Vitalício lançamento: R$ 297/PC. Vitalício oficial: R$ 497/PC. Pacote empresa: R$ 797 a R$ 997.',
  'Organizador de Arquivos Pro': 'R$ 79,90/mês por PC ou R$ 397 vitalício por PC. Pacote empresa sob consulta.',
  'Manutenção de PC': 'A partir de R$ 120. Valor final depende do serviço.',
  'Presença Online / Google Maps': 'A partir de R$ 180. Valor final depende do serviço.',
  'Outro': 'Descreva a necessidade para montarmos o orçamento.'
};
if (serviceSelect && budgetHint) {
  function updateBudget(){
    const v = serviceSelect.value;
    budgetHint.textContent = budgets[v] || 'Descreva a necessidade para montarmos o orçamento.';
  }
  serviceSelect.addEventListener('change', updateBudget); updateBudget();
}

function getLeadData(){
  const form = $('#leadForm');
  if (!form) return {};
  return Object.fromEntries(new FormData(form).entries());
}

function buildProposalText(data){
  const name = data.name || 'Cliente';
  const service = data.service || 'Serviço não informado';
  const phone = data.phone || 'Não informado';
  const email = data.email || 'Não informado';
  const message = data.message || 'Sem detalhes adicionais.';

  return `Olá, sou ${name}.\n\nQuero solicitar uma proposta/orçamento com a Göhl Solutions.\n\nServiço desejado: ${service}\nWhatsApp do cliente: ${phone}\nE-mail do cliente: ${email}\n\nDetalhes do projeto:\n${message}`;
}

function gmailComposeUrl(data){
  const subject = `Orçamento Göhl Solutions - ${data.service || 'Solicitação'}`;
  const body = buildProposalText(data);
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(GOHL_EMAIL)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function whatsappUrl(data){
  const body = buildProposalText(data);
  return `https://wa.me/${GOHL_WHATSAPP}?text=${encodeURIComponent(body)}`;
}

function updateQuickContactLinks(){
  $$('[data-gmail-link]').forEach(link => {
    link.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(GOHL_EMAIL)}&su=${encodeURIComponent('Contato pelo site Göhl Solutions')}`;
    link.target = '_blank';
    link.rel = 'noopener';
  });
  $$('[data-whatsapp-link]').forEach(link => {
    link.href = `https://wa.me/${GOHL_WHATSAPP}?text=${encodeURIComponent('Olá, tenho interesse em uma proposta da Göhl Solutions.')}`;
    link.target = '_blank';
    link.rel = 'noopener';
  });
}
updateQuickContactLinks();

const leadForm = $('#leadForm');
if (leadForm) {
  const status = $('#formStatus');
  const whatsappButton = $('#sendWhatsapp');
  const gmailButton = $('#sendGmail');

  async function saveLeadIfServerIsAvailable(data){
    try {
      await fetch('/api/contact', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({...data, createdAt: new Date().toISOString()})
      });
    } catch (err) {
      // Site estático no GitHub/Vercel não tem backend local. Ignora e segue com Gmail/WhatsApp.
    }
  }

  async function sendByGmail(){
    if (!leadForm.reportValidity()) return;
    const data = getLeadData();
    await saveLeadIfServerIsAvailable(data);
    if (status) status.textContent = 'Abrindo Gmail na web com a proposta preenchida.';
    window.open(gmailComposeUrl(data), '_blank', 'noopener');
  }

  async function sendByWhatsApp(){
    if (!leadForm.reportValidity()) return;
    const data = getLeadData();
    await saveLeadIfServerIsAvailable(data);
    if (status) status.textContent = 'Abrindo WhatsApp com a proposta preenchida.';
    window.open(whatsappUrl(data), '_blank', 'noopener');
  }

  leadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendByGmail();
  });
  if (gmailButton) gmailButton.addEventListener('click', sendByGmail);
  if (whatsappButton) whatsappButton.addEventListener('click', sendByWhatsApp);
}

const year = $('#year'); if (year) year.textContent = new Date().getFullYear();
