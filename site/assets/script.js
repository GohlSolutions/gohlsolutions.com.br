
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

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
  'Landing Page': 250,
  'Site Profissional': 350,
  'Aplicativo / Sistema': 1500,
  'Göhl Email Bot Pro': 497,
  'Manutenção de PC': 120,
  'Presença Online / Google Maps': 180,
  'Outro': 0
};
if (serviceSelect && budgetHint) {
  function updateBudget(){
    const v = serviceSelect.value;
    const min = budgets[v] || 0;
    budgetHint.textContent = min ? `Valor inicial sugerido: ${moneyBR(min)}. O orçamento final depende do escopo.` : 'Descreva a necessidade para montarmos o orçamento.';
  }
  serviceSelect.addEventListener('change', updateBudget); updateBudget();
}

const leadForm = $('#leadForm');
if (leadForm) {
  leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(leadForm).entries());
    data.createdAt = new Date().toISOString();
    const msg = `Olá, sou ${data.name}.%0A%0AQuero orçamento para: ${data.service}.%0AContato: ${data.phone || data.email || 'não informado'}.%0A%0AMensagem: ${data.message}`;
    const status = $('#formStatus');
    try {
      const res = await fetch('/api/contact', {
        method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)
      });
      if (res.ok) {
        status.textContent = 'Pedido recebido no painel administrativo. Também abrimos uma opção de contato rápido.';
        leadForm.reset();
        setTimeout(() => window.open(`mailto:solutionsgohl@gmail.com?subject=Orçamento Göhl Solutions&body=${msg.replaceAll('%0A','%0D%0A')}`, '_blank'), 500);
        return;
      }
      throw new Error('Servidor indisponível');
    } catch (err) {
      status.textContent = 'Site aberto sem servidor: use o e-mail ou WhatsApp para enviar o orçamento.';
      window.open(`mailto:solutionsgohl@gmail.com?subject=Orçamento Göhl Solutions&body=${msg.replaceAll('%0A','%0D%0A')}`, '_blank');
    }
  });
}

const year = $('#year'); if (year) year.textContent = new Date().getFullYear();
