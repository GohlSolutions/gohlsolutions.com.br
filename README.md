# Site Göhl Solutions

Site profissional da Göhl Solutions com:

**Domínio oficial:** https://gohlsolutions.com.br


- Página inicial premium
- Serviços
- Sistemas/produtos
- Preços
- Contato/orçamento
- Política de Privacidade e Termos
- Espaços discretos para Google AdSense
- Painel admin separado
- Servidor local seguro sem dependências externas de NPM

## Domínio oficial

O site já está preparado para usar:

`https://gohlsolutions.com.br`

Foram incluídos canonical tags, sitemap, robots.txt e arquivo CNAME para facilitar hospedagem. Veja também `CONFIGURAR_DOMINIO_GOHLSOLUTIONS.md`.

## Como abrir só o site estático

Abra o arquivo:

`site/index.html`

Isso funciona sem servidor, mas o formulário não salva no painel admin. Ele abre e-mail para contato.

## Como rodar com painel admin seguro no PC

1. Instale o Node.js LTS se ainda não tiver.
2. Abra o Prompt de Comando dentro desta pasta do projeto, não dentro de `C:\Windows\System32`.
3. Rode:

```bash
node server.js
```

4. Acesse:

- Site: `http://localhost:8080`
- Admin: `http://localhost:8080/admin/login.html`

Na primeira execução, o terminal vai mostrar uma senha inicial do admin. Guarde essa senha.

Para resetar a senha, apague o arquivo:

`data/admin_config.json`

Depois rode `node server.js` novamente.

## Domínio de exemplo para teste no PC

Você pode usar um domínio interno fictício, por exemplo:

`gohl-solutions-demo.local`

No Windows, edite como administrador:

`C:\Windows\System32\drivers\etc\hosts`

Adicione:

```txt
127.0.0.1 gohl-solutions-demo.local
```

Depois acesse:

`http://gohl-solutions-demo.local:8080`

Esse domínio é apenas para teste local. Para clientes, use domínio real, como `gohlsolutions.com.br`.

## Publicar no Vercel

Para publicar só o site público no Vercel, envie a pasta `site` como projeto estático.

Atenção: painel admin seguro precisa de backend. Site estático no Vercel não protege admin real sozinho.

## Google AdSense

Os blocos de anúncios estão marcados com:

- `ADSENSE_SLOT_HOME`
- `ADSENSE_SLOT_CONTENT`
- `ADSENSE_SLOT_FOOTER`

Depois que o AdSense aprovar o site, substitua os blocos pelos códigos oficiais do Google.

## Regras importantes de segurança e empresa

- Não coloque senha real dentro do HTML ou JavaScript público.
- Não venda o Göhl Email Bot Pro como disparo em massa ou spam.
- Use automação de e-mail apenas com consentimento e base legal adequada.
- Para sistemas com pagamento real, use integração oficial e webhook seguro.
- Para arquivos de clientes, use login real, sessão protegida e armazenamento privado.


## Atualização visual oficial

O pacote inclui o logo e a imagem de fundo oficiais da Göhl Solutions, otimizados para menu, home, favicon e compartilhamento em redes sociais.
