![Screenshot](/public/capadura-homepage.jpg)

# Projeto Capadura - Repo Front-end

O projeto foi dividido em dois repositórios, sendo esse aqui para o **front-end**. Para acessar o repositório do **back-end**, [clique aqui](https://github.com/eidynho/capadura-api).

## Introdução

[Capadura](http://capadura.io) é uma ferramenta onde os leitores podem compartilhar avaliações de livros, fazer comentários durante a leitura e descobrir novos livros.

## 🤖 Tech stack

- Typescript
- React.js
- Next.js 14 (App router)
- React Query (TanStack Query)
- Radix UI
- TailwindCSS

## 💻 Principais funcionalidades

- Tema claro/escuro
- Autenticação com e-mail/senha ou OAuth com Google
- Página com informações do livro
- Progressos e avaliações de um livro
- Curtir um livro
- Listas de livros
- Perfil do usuário
- Livros favoritos no perfil
- Progressos e avaliações recentes do usuário
- Configuração do perfil do usuário

## 🌏 Contribuições

Para quem deseja contribuir: recomendo abrir uma discussão com a alteração que deseja fazer por meio de uma issue, ou uma discussão ou fale comigo diretamente. Estarei aberto para novas implementações ou sugestões :)

## ⚙️ Variaveis de ambiente

Para rodar esse projeto, você precisará adicionar as seguintes variáveis de ambiente ao no arquivo .env

```
    NEXT_PUBLIC_NODE_ENV="dev"
    NEXT_PUBLIC_API_BASE_URL="http://127.0.0.1:3333"
    NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URL="http://127.0.0.1:3333/sessions/oauth/google"
    NEXT_PUBLIC_GOOGLE_CLIENT_ID=""
```

Caso precise fazer login através do OAuth com Google, a variável `NEXT_PUBLIC_GOOGLE_CLIENT_ID` deverá ser adicionada manualmente através do [serviço de OAuth do Google](https://console.cloud.google.com), onde será necessário criar uma nova credencial manualmente.

## 🗒️ Licença

MIT © [Vinicius Eidy Okuda](https://github.com/eidynho)
