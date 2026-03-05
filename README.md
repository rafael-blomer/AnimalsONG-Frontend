# 🐾 AnimalsONG — Frontend

Interface web desenvolvida para apoiar ONGs de proteção animal, facilitando a gestão e adoção de animais resgatados.

> 💡 Este repositório contém apenas o **Frontend** da aplicação. Para o servidor e API REST, acesse o repositório do **[Backend →](https://github.com/rafael-blomer/AnimalsONG-Backend)**

---

## 🌐 Demonstração

A aplicação completa está disponível em produção:

**[https://animalsong-frontend.onrender.com](https://animalsong-frontend.onrender.com)**

---

## 📋 Sobre o Projeto

O **AnimalsONG Frontend** é a interface do sistema AnimalsONG, construída com Angular e Tailwind CSS. A aplicação conecta animais que precisam de um lar com pessoas dispostas a adotá-los, além de apoiar as ONGs na organização dos seus processos.

O frontend se comunica com a API REST disponibilizada pelo [AnimalsONG-Backend](https://github.com/rafael-blomer/AnimalsONG-Backend), que deve estar em execução para o pleno funcionamento da aplicação.

---

## 🔗 Repositórios do Projeto

| Repositório | Tecnologia | Link |
|---|---|---|
| **Frontend** (este) | Angular 21 + Tailwind CSS | [AnimalsONG-Frontend](https://github.com/rafael-blomer/AnimalsONG-Frontend) |
| **Backend** | Java + Spring Boot + Docker | [AnimalsONG-Backend](https://github.com/rafael-blomer/AnimalsONG-Backend) |

---

## 🚀 Tecnologias

- **[Angular 21](https://angular.dev/)** — framework principal
- **[TypeScript](https://www.typescriptlang.org/)** — linguagem de desenvolvimento
- **[Tailwind CSS](https://tailwindcss.com/)** — estilização utilitária
- **[SCSS](https://sass-lang.com/)** — estilos customizados

---

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) (versão recomendada: 18+)
- [Angular CLI](https://angular.dev/tools/cli) v21+

```bash
npm install -g @angular/cli
```

---

## 🛠️ Instalação

```bash
git clone https://github.com/rafael-blomer/AnimalsONG-Frontend.git
cd AnimalsONG-Frontend
npm install
```

---

## ▶️ Executando o Projeto

### 1. Inicie o Backend primeiro

Certifique-se de que o [AnimalsONG-Backend](https://github.com/rafael-blomer/AnimalsONG-Backend) está rodando. Consulte o README do backend para instruções de execução.

### 2. Inicie o servidor de desenvolvimento

```bash
ng serve
```

Acesse [http://localhost:4200](http://localhost:4200) no navegador. A aplicação recarrega automaticamente ao detectar alterações nos arquivos.

### Build de produção

```bash
ng build
```

Os arquivos compilados serão gerados na pasta `dist/`.

---

## 📁 Estrutura do Projeto

```
AnimalsONG-Frontend/
├── public/
│   ├── _redirects            # Configuração de redirecionamentos
│   └── favicon.ico
├── src/
│   └── app/
│       ├── core/
│       │   ├── guards/       # Guards de rotas (autenticação/autorização)
│       │   ├── models/       # Interfaces e tipos da aplicação
│       │   └── services/     # Serviços de comunicação com a API
│       ├── environments/
│       │   ├── environment.ts
│       │   └── environment.prod.ts
│       ├── features/
│       │   ├── animais/      # Módulo de listagem e cadastro de animais
│       │   ├── auth/         # Módulo de autenticação (login/registro)
│       │   ├── dashboard/    # Painel administrativo
│       │   ├── financeiro/   # Módulo financeiro da ONG
│       │   ├── landing-page/ # Página inicial pública
│       │   └── ong/          # Módulo de gestão das ONGs
│       ├── layouts/
│       │   ├── home-layout/    # Layout para área autenticada
│       │   └── landing-layout/ # Layout para área pública
│       ├── app-module.ts
│       ├── app-routing-module.ts
│       ├── app.html
│       ├── app.scss
│       └── app.ts
└── index.html
```

---

## 🔌 Integração com o Backend

Este frontend consome a API do [AnimalsONG-Backend](https://github.com/rafael-blomer/AnimalsONG-Backend). Para rodar o projeto completo localmente:

1. Inicie o [backend](https://github.com/rafael-blomer/AnimalsONG-Backend) (`./mvnw spring-boot:run`)
2. Inicie este frontend (`ng serve`)
3. Acesse [http://localhost:4200](http://localhost:4200)

Ou acesse diretamente a versão em produção: **[https://animalsong-frontend.onrender.com](https://animalsong-frontend.onrender.com)**

---

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/minha-feature`)
3. Commit suas alterações (`git commit -m 'feat: adiciona minha feature'`)
4. Push para a branch (`git push origin feature/minha-feature`)
5. Abra um Pull Request

---

<p align="center">Feito com ❤️ para os animais 🐶🐱</p>
