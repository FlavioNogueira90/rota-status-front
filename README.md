# 🚛 Rota Status — Frontend

Frontend web do **Rota Status**, desenvolvido em Angular pela **FANTech**.

A aplicação oferece a interface operacional e administrativa do sistema, integrada ao backend Spring Boot.

---

## 🛠 Tecnologias

- Angular 17+
- TypeScript
- Standalone Components
- Angular Router
- Signals / Computed Signals
- HttpClient
- Guards de autenticação e perfil

---

## ▶️ Executando localmente

Instale as dependências:

```bash
npm install
```

Inicie o projeto:

```bash
npm start
```

ou:

```bash
npx ng serve
```

Acesse:

```text
http://localhost:4200
```

---

## 🏗 Build

```bash
npx ng build
```

Os artefatos são gerados em:

```text
dist/rota-status-front
```

> Existem atualmente warnings de budget em alguns arquivos SCSS. Eles não impedem o build e serão tratados em uma etapa futura de otimização visual.

---

## 📁 Estrutura Principal

```text
src/app
├── core
│   ├── api
│   └── auth
├── features
│   ├── entregas
│   ├── manifestos
│   ├── usuarios
│   └── veiculos
├── layout
└── shared
    └── models
```

---

## 🔐 Autenticação e Perfis

A aplicação possui:

- Login por CPF e senha
- Interceptor JWT
- `authGuard`
- `roleGuard`
- Menu e rotas condicionadas por perfil
- Perfis ADMIN, OPERADOR e MOTORISTA

---

## ✅ Funcionalidades Implementadas

### Administração de Usuários

- Listagem de usuários
- Busca por nome, CPF, e-mail ou telefone
- Filtro por perfil
- Filtro por status
- Ordenação
- Cadastro
- Edição
- Ativação/inativação
- Reset administrativo de senha
- Tratamento de mensagens retornadas pela API

### Gestão de Veículos

- Listagem de veículos
- Cadastro
- Edição
- Ativação/inativação
- Busca por placa
- Busca por placa parcial
- Busca por marca, modelo ou tipo
- Filtro por status
- Filtro por veículo refrigerado
- Ordenação por colunas
- Exibição de capacidade
- Exibição de tipo de veículo
- Tratamento visual de erros da API
- Tratamento de placa duplicada
- Integração ponta a ponta com o backend

### Manifestos

- Busca de manifesto
- Novo manifesto
- Integração com endpoints existentes

### Entregas

- Consulta e detalhe de entrega
- Integração com fluxo operacional existente

---

## 🚚 Gestão de Veículos — Status

Feature validada em 04/09/2026.

Cenários testados:

- Cadastro com sucesso
- Listagem automática após cadastro
- Busca por placa completa
- Busca por placa parcial
- Filtro por status
- Filtro por refrigerado
- Ordenação
- Edição de todos os dados
- Manutenção da própria placa sem falso conflito
- Bloqueio de alteração para placa já existente
- Exibição da mensagem `Placa já cadastrada`
- Ativação
- Inativação

---

## 🌐 Integração com API

A URL do backend é definida em:

```text
src/environments/environment.ts
src/environments/environment.prod.ts
```

Os services utilizam:

```typescript
environment.apiUrl
```

Principais services:

```text
core/api/manifesto.service.ts
features/usuarios/usuarios.service.ts
features/veiculos/veiculos.service.ts
```

---

## 🧭 Roadmap

### ✅ Concluído

- Login e segurança de rotas
- Layout principal
- Administração de usuários
- Busca de manifestos
- Fluxos iniciais de entregas
- Gestão completa de veículos

### 🚧 Próximo Marco — Novo Manifesto

- Buscar motorista por CPF ou nome
- Buscar veículo por placa
- Exibir os dados encontrados
- Vincular motorista e veículo ao manifesto
- Preparar a tela para receber dados importados futuramente

### 📄 Importação Inteligente — Futuro

Fluxo planejado:

```text
Importar documento
        ↓
Extração automática
        ↓
Motorista identificado
Veículo identificado
Entregas identificadas
        ↓
Conferência do operador
        ↓
Efetivar manifesto
```

A importação será realizada por um serviço desacoplado do frontend e do backend principal.

### Evoluções Futuras

- Minha Rota
- Checklist
- Jornada do motorista
- Comprovante de entrega
- Ocorrências
- Rastreamento em tempo real
- Dashboard operacional
- Portal do cliente
- Experiência mobile
- Melhorias de responsividade
- Otimização de budgets SCSS

---

## 📌 Status Atual — 04/09/2026

A gestão de veículos está concluída e validada ponta a ponta.

O próximo desenvolvimento será a integração de **motorista + veículo no Novo Manifesto**.

---

## 📄 Licença

Projeto proprietário da **FAN Tech**.

Todos os direitos reservados.
