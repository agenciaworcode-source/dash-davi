# PRD - Dashboard Beautyderm

---

## 1. Introdução

Este projeto visa criar um dashboard analítico integrado ao CRM Agendor, direcionado para donos de empresas que precisam de visibilidade clara e estratégica sobre seu processo comercial.

O objetivo principal é fornecer uma visualização consolidada e individualizada da performance de vendas por funil e por vendedor, permitindo tomada de decisão baseada em dados e identificação rápida de gargalos no processo comercial.

---

## 2. Declaração do Problema

Donos de empresas que utilizam CRM enfrentam dificuldade em visualizar e interpretar dados comerciais de forma clara, especialmente quando há múltiplos funis e vendedores.

Este MVP resolve isso através de um dashboard centralizado que organiza dados de deals, etapas e leads, apresentando métricas, comparações e alertas de performance de forma visual e intuitiva.

---

## 3. Visão Geral da Solução

O produto funciona como uma camada analítica sobre o CRM, consumindo dados via API, processando-os com sincronização periódica (cronjobs) e armazenando-os em banco próprio PostgreSQL hospedado em VPS para consultas rápidas e controle total da infraestrutura.

Principais funcionalidades:

1. Visualização de métricas consolidadas por funil
2. Comparação de performance entre vendedores
3. Visualização detalhada de cada funil e suas etapas
4. Alertas automáticos de baixa performance
5. Filtros por período e vendedor
6. Dashboard individual por vendedor
7. Persistência e cache de dados para performance e confiabilidade

---

## 4. Histórias de Usuário

- US1: Como dono da empresa, quero visualizar métricas gerais de todos os funis para entender o desempenho global.
- US2: Como dono da empresa, quero comparar vendedores para identificar quem performa melhor.
- US3: Como dono da empresa, quero visualizar detalhes de um funil específico para analisar gargalos.
- US4: Como dono da empresa, quero ver dados filtrados por período para analisar evolução.
- US5: Como dono da empresa, quero receber alertas de baixa performance para agir rapidamente.
- US6: Como dono da empresa, quero visualizar performance individual por vendedor.
- US7: Como dono da empresa, quero garantir que os dados estejam sempre atualizados automaticamente.

---

## 5. Esquema do Banco de Dados (PostgreSQL - VPS)

**Banco:** PostgreSQL 14+ rodando em VPS dedicada

---

**Tabela: usuarios**
- id: UUID, obrigatório, chave primária
- email: string(255), obrigatório, único
- senha_hash: string(255), obrigatório
- criado_em: timestamp, obrigatório DEFAULT now()

---

**Tabela: vendedores**
- id: UUID, obrigatório, chave primária
- nome: string(100), obrigatório
- funil_id: UUID, obrigatório
- criado_em: timestamp, obrigatório DEFAULT now()

---

**Tabela: funis**
- id: UUID, obrigatório, chave primária
- nome: string(100), obrigatório
- criado_em: timestamp, obrigatório DEFAULT now()

---

**Tabela: etapas**
- id: UUID, obrigatório, chave primária
- funil_id: UUID, obrigatório, FK → funis.id ON DELETE CASCADE
- nome: string(100), obrigatório
- ordem: integer, obrigatório

---

**Tabela: deals**
- id: UUID, obrigatório, chave primária
- funil_id: UUID, obrigatório, FK → funis.id
- etapa_id: UUID, obrigatório, FK → etapas.id
- vendedor_id: UUID, obrigatório, FK → vendedores.id
- valor: decimal(10,2), opcional
- status: enum(aberto, ganho, perdido), obrigatório
- criado_em: timestamp, obrigatório
- atualizado_em: timestamp, obrigatório

---

**Tabela: leads**
- id: UUID, obrigatório, chave primária
- nome: string(150), opcional
- email: string(150), opcional
- telefone: string(50), opcional
- criado_em: timestamp, obrigatório

---

**Tabela: metricas_cache**
- id: UUID, obrigatório, chave primária
- tipo: string(50), obrigatório
- dados: JSONB, obrigatório
- atualizado_em: timestamp, obrigatório

---

**Tabela: alertas**
- id: UUID, obrigatório, chave primária
- tipo: string(50), obrigatório
- mensagem: string(255), obrigatório
- ativo: boolean, obrigatório
- criado_em: timestamp, obrigatório

---

**Índices obrigatórios:**
- idx_deals_funil_id
- idx_deals_vendedor_id
- idx_deals_etapa_id
- idx_deals_criado_em
- idx_metricas_tipo

---

**Relacionamentos:**
- funis → etapas (1:N)
- funis → deals (1:N)
- vendedores → deals (1:N)
- etapas → deals (1:N)

---

## 6. Estética e Identidade Visual

**Estética Geral:**
Layout clean e moderno com predominância de azul e branco. Interface leve com gráficos interativos estilo Chart.js, priorizando clareza, rapidez e leitura imediata dos dados.

---

## 7. Esquema de Telas e Ações

### Tela: Login  
Rota: /login

**Elementos:**
- Campo Email (obrigatório)
- Campo Senha (obrigatório)
- Botão "Entrar"

**Ações:**
- Validar campos
- Autenticar usuário
- Redirecionar para /dashboard
- Exibir erro se inválido

---

### Tela: Dashboard Geral  
Rota: /dashboard

**Elementos:**
- Filtro por período
- Cards de métricas
- Gráfico de deals por funil (bar)
- Gráfico de conversão (line)
- Ranking de vendedores

**Ações:**
- Atualização em tempo real ao mudar filtros
- Navegação para vendedor/funil

---

### Tela: Dashboard por Vendedor  
Rota: /vendedor/:id

**Elementos:**
- KPIs do vendedor
- Gráfico temporal
- Distribuição por etapas

---

### Tela: Detalhe do Funil  
Rota: /funil/:id

**Elementos:**
- Etapas do funil
- Deals por etapa
- Conversão entre etapas
- Funnel chart

---

### Tela: Configurações  
Rota: /configuracoes

**Elementos:**
- API Key do CRM
- Frequência de sincronização
- Botão sync manual
- Toggle alertas

---

## 8. Infraestrutura e Sincronização

- Banco: PostgreSQL em VPS própria
- Integração via API do CRM
- Cronjob a cada 15 minutos
- Estratégia: sync incremental
- Cache em JSONB para métricas pesadas

---

## 9. Regras de Alertas

- Conversão < 10%
- Vendedor sem atividade por 3 dias
- Queda de 30% no volume de deals

---