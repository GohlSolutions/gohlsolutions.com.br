
async function api(path, options={}){
  const res = await fetch(path, {credentials:'include', ...options});
  if(res.status === 401) location.href = '/admin/login.html';
  return res;
}
const loginForm = document.getElementById('loginForm');
if(loginForm){
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const msg = document.getElementById('msg');
    msg.textContent = 'Verificando...';
    const password = document.getElementById('password').value;
    try{
      const res = await fetch('/api/login', {method:'POST', headers:{'Content-Type':'application/json'}, credentials:'include', body: JSON.stringify({password})});
      if(res.ok){ location.href = '/admin/painel.html'; return; }
      const data = await res.json().catch(()=>({error:'Senha incorreta ou servidor não iniciado.'}));
      msg.textContent = data.error || 'Não foi possível entrar.';
    }catch(err){ msg.textContent = 'Abra pelo servidor: node server.js. Abrir o HTML direto não protege o admin.'; }
  });
}
async function loadLeads(){
  const body = document.getElementById('leadsBody'); if(!body) return;
  try{
    const res = await api('/api/leads');
    const data = await res.json();
    const leads = data.leads || [];
    document.getElementById('statLeads').textContent = leads.length;
    if(!leads.length){ body.innerHTML = '<tr><td colspan="5" class="muted">Nenhum pedido recebido ainda.</td></tr>'; return; }
    body.innerHTML = leads.map(l => `<tr><td>${new Date(l.createdAt || Date.now()).toLocaleString('pt-BR')}</td><td>${escapeHtml(l.name||'')}</td><td><span class="tag">${escapeHtml(l.service||'')}</span></td><td>${escapeHtml(l.phone||l.email||'')}</td><td>${escapeHtml(l.message||'')}</td></tr>`).join('');
  }catch(err){ body.innerHTML = '<tr><td colspan="5" class="muted">Servidor não disponível ou sessão expirada.</td></tr>'; }
}
function escapeHtml(str){ return String(str).replace(/[&<>"]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s])); }
const logout = document.getElementById('logout'); if(logout){ logout.addEventListener('click', async()=>{ await fetch('/api/logout',{method:'POST',credentials:'include'}).catch(()=>{}); location.href='/admin/login.html'; }); }
const refresh = document.getElementById('refresh'); if(refresh){ refresh.addEventListener('click', loadLeads); }
loadLeads();
