# Atualização visual aplicada

Foram aplicadas as imagens oficiais enviadas:

- `site/assets/logo-gohl-horizontal.png` — logo otimizada para menu, rodapé e identidade visual.
- `site/assets/logo-gohl-transparent.png` — versão com fundo removido para usos maiores.
- `site/assets/hero-gohl.webp` — foto/arte de fundo otimizada para a home.
- `site/assets/hero-gohl-small.webp` — versão menor para celular.
- `site/assets/og-image-gohl.webp` — imagem de compartilhamento para WhatsApp, Facebook e redes sociais.
- `site/assets/favicon-gohl.png` — ícone do navegador.

Também foram ajustados:

- cabeçalho com logo oficial;
- hero da página inicial;
- SEO/Open Graph com imagem oficial;
- servidor `server.js` para entregar PNG/WebP corretamente.

Para testar:

```bat
cd /d "C:\Users\tiago\Downloads\gohl-solutions-site"
node server.js
```

Depois acesse:

```txt
http://localhost:8080
```
