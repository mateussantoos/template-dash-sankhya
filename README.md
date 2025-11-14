<div align="center">

  <img src="./src/assets/logo.svg" alt="Template Dashboard Sankhya" height="120" />

  <h1>Template de Dashboard Personalizável — Sankhya HTML5 (React + Vite)</h1>

  <p>
    Base oficial para construir dashboards dinâmicos no ecossistema Sankhya,
    com grade drag-and-drop, componentes reutilizáveis e integração pronta com o boilerplate HTML5.
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" />
    <img src="https://img.shields.io/badge/Typescript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://badges.aleen42.com/src/vitejs.svg" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind-3.x-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  </p>

  <p>
    <a href="#inicio-rápido"><img src="https://img.shields.io/badge/Início%20Rápido-Start-blue" alt="Início Rápido" /></a>
    <a href="#dashboard-de-exemplo"><img src="https://img.shields.io/badge/Exemplo-Preview-success" alt="Preview do Exemplo" /></a>
    <a href="#licença"><img src="https://img.shields.io/badge/Licen%C3%A7a-MIT-black" alt="License: MIT" /></a>
  </p>
</div>

---

## Visão Geral

Este repositório une o boilerplate HTML5 da Sankhya com uma camada extra de UI para dashboards personalizáveis.  
Você encontra aqui:

- Contexto de personalização (`DashboardCustomizationProvider`) com persistência em `localStorage`;
- Componente `CustomizableGrid` baseado em `react-grid-layout`, com itens que podem ser movidos e redimensionados;
- Biblioteca de componentes (`Select`, `DataTable`, `KpiCard`, `InfoTooltip`, etc.) estilizada com Tailwind;
- Layout completo (`DashboardLayout`) com `Header` e `SideBar` colapsável;
- Projeto de exemplo em `example/` que consome um JSON e demonstra o grid dinâmico em funcionamento.

---

## Início Rápido

```bash
pnpm install
pnpm dev
```

Abra `http://localhost:5173` para visualizar o dashboard no boilerplate padrão.

Para explorar a montagem completa com dados estáticos e interação de grade:

```bash
pnpm example
```

O script sobe um Vite dev server dentro da pasta `example/` apontando para `http://localhost:5174` (porta exibida no terminal).

---

## Estrutura do Projeto

```
.
├─ src/
│  ├─ app/app.tsx                # Composição padrão do dashboard
│  ├─ components/                # Biblioteca de UI e layouts
│  │  ├─ layout/
│  │  │  ├─ dashboard-layout/    # SideBar + Header + área principal
│  │  │  └─ customizable-grid/   # Grade responsiva e personalizável
│  │  └─ ui/                     # Botões, select, cards, data-table...
│  ├─ contexts/                  # DashboardCustomizationProvider
│  ├─ hooks/                     # Hooks reutilizáveis (ex.: useFilter)
│  └─ types/                     # Declarações auxiliares (ex.: react-grid-layout)
├─ example/                      # Projeto Vite isolado para demonstração
│  ├─ src/App.tsx                # Usa os componentes do template
│  └─ src/data.json              # Fonte de dados fictícia
├─ public/index.jsp              # Scaffold JSP para Sankhya
├─ package.json                  # Scripts e dependências compartilhadas
└─ vite.config.ts                # Build com nomes estáveis + zip automático
```

---

## Principais Recursos

- **Personalização ao vivo**  
  `Header` traz um botão “Personalizar” que alterna o modo de edição. A grade passa a aceitar drag-and-drop e resize em tempo real.

- **Persistência por grid**  
  Cada grade registra um `storageKey`. Ao salvar, as posições e tamanhos são persistidos por breakpoint.

- **Altura automática dos cards**  
  `ResizeObserver` calcula a altura real do conteúdo e reflete no layout do grid (sem precisar abrir o modo de edição).

- **Componentes responsivos**  
  `Select` com tamanhos configuráveis e truncamento inteligente, `DataTable` com paginação flexível e `SideBar` colapsável.

- **Setup para Sankhya**  
  Build gera `dist/index.jsp`, arquivos com nomes estáveis (`assets/app.js`, `assets/index.css`) e bundle `sankhya-component.zip`.

---

## Scripts Disponíveis

- `pnpm dev` — inicia o dashboard principal no boilerplate Sankhya.
- `pnpm build` — typecheck + build de produção + geração do ZIP (`dist/sankhya-component.zip`).
- `pnpm preview` — pré-visualiza o build de produção.
- `pnpm example` — sobe o projeto de exemplo para testar o grid customizável com JSON.

---

## Dashboard de Exemplo

O diretório `example/` compartilha os componentes da biblioteca (`@` aponta para `../src`).  
Ele demonstra:

- Combinação de cards de KPI, gráficos e tabelas no grid;
- Filtros usando `useFilter`;
- Persistência da grade entre recarregamentos;
- Estilização com Tailwind (o projeto importa `@tailwindcss/vite` e reutiliza o design system principal).

> Dica: utilize o modo de personalização no exemplo para experimentar layouts diferentes; as mudanças ficam salvas em `localStorage`.

---

## Estilos e Design System

- Tailwind habilitado por `@tailwindcss/vite` e utilitário `tailwind-merge` para composição de classes;
- Função `cn` centraliza o merge condicional;
- Componentes com `className` exposta para customização local;
- Tokens e espaçamentos consistentes favorecem a responsividade.

---

## FAQ

**As alterações de layout somem após recarregar?**  
Certifique-se de que cada grid possui um `storageKey` único ou deixe que o `gridId` padronizado seja persistido. O `localStorage` deve estar habilitado no navegador.

**Tailwind não aplica estilos no projeto de exemplo. O que fazer?**  
Confirme que o comando foi iniciado com `pnpm example` e que `example/src/index.css` importa `@import "tailwindcss";`. Reinicie o dev server após alterar o `tailwind.config.ts`.

**Preciso publicar no Sankhya. Como faço o build?**  
Execute `pnpm build`. Copie `dist/` (ou apenas `dist/sankhya-component.zip`) para o diretório do componente HTML5 no servidor Sankhya.

---

## Contribuição

Contribuições são bem-vindas! Abra issues ou PRs mantendo o padrão de código, rodando linters e cobrindo novos cenários com exemplos quando possível.

---

## Licença

MIT © 2025 — Você pode usar este template em projetos internos ou distribuídos, respeitando a licença.

---

<div align="center">

Feito com ☕ pela equipe Sankhya.

</div>
