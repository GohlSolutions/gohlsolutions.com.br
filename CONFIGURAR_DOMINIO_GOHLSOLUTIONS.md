# Configurar o domínio oficial da Göhl Solutions

Domínio oficial: **gohlsolutions.com.br**

## Opção 1 — Hospedar em Vercel, Netlify ou similar

1. Suba a pasta `site` como projeto estático.
2. No painel da hospedagem, adicione o domínio `gohlsolutions.com.br`.
3. A hospedagem vai mostrar os DNS necessários.
4. No painel onde o domínio foi comprado, crie os registros DNS indicados.

Registros comuns usados em hospedagem estática:

```txt
A     @      IP_FORNECIDO_PELA_HOSPEDAGEM
CNAME www    ENDERECO_FORNECIDO_PELA_HOSPEDAGEM
```

Use exatamente os valores que a hospedagem mostrar, porque cada plataforma pode mudar os registros.

## Opção 2 — Hospedar no seu PC

Para o público acessar o site no seu computador, você precisaria de:

- IP público fixo ou DDNS;
- redirecionamento de portas no roteador;
- HTTPS/SSL;
- firewall bem configurado;
- computador ligado 24 horas;
- backup e proteção do painel admin.

Para empresa real, a opção mais segura e profissional é hospedar o site público em uma plataforma como Vercel/Netlify/Hostinger e deixar backend/admin em um servidor separado.

## Teste local

Para testar no seu PC, continue usando:

```txt
http://localhost:8080
```

ou domínio interno fictício no arquivo hosts, como:

```txt
127.0.0.1 gohl-solutions-demo.local
```

Esse `.local` é só para teste dentro do seu computador. O domínio oficial público é `gohlsolutions.com.br`.
