-- Criação da extensão para geração de UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criando ENUMs
CREATE TYPE status_deal AS ENUM ('aberto', 'ganho', 'perdido');

-- Tabela: usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT now()
);

-- Tabela: funis
CREATE TABLE IF NOT EXISTS funis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(100) NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT now()
);

-- Tabela: vendedores
CREATE TABLE IF NOT EXISTS vendedores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(100) NOT NULL,
    funil_id UUID NOT NULL REFERENCES funis(id) ON DELETE RESTRICT,
    criado_em TIMESTAMP NOT NULL DEFAULT now()
);

-- Tabela: etapas
CREATE TABLE IF NOT EXISTS etapas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    funil_id UUID NOT NULL REFERENCES funis(id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    ordem INTEGER NOT NULL
);

-- Tabela: deals
CREATE TABLE IF NOT EXISTS deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    funil_id UUID NOT NULL REFERENCES funis(id) ON DELETE RESTRICT,
    etapa_id UUID NOT NULL REFERENCES etapas(id) ON DELETE RESTRICT,
    vendedor_id UUID NOT NULL REFERENCES vendedores(id) ON DELETE RESTRICT,
    valor DECIMAL(10,2),
    status status_deal NOT NULL,
    criado_em TIMESTAMP NOT NULL,
    atualizado_em TIMESTAMP NOT NULL
);

-- Tabela: leads
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(150),
    email VARCHAR(150),
    telefone VARCHAR(50),
    criado_em TIMESTAMP NOT NULL
);

-- Tabela: metricas_cache
CREATE TABLE IF NOT EXISTS metricas_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo VARCHAR(50) NOT NULL,
    dados JSONB NOT NULL,
    atualizado_em TIMESTAMP NOT NULL
);

-- Tabela: alertas
CREATE TABLE IF NOT EXISTS alertas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo VARCHAR(50) NOT NULL,
    mensagem VARCHAR(255) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT true,
    criado_em TIMESTAMP NOT NULL DEFAULT now()
);

-- Índices Recomendados (Arquitetura para Performance)
CREATE INDEX IF NOT EXISTS idx_deals_funil_id ON deals(funil_id);
CREATE INDEX IF NOT EXISTS idx_deals_vendedor_id ON deals(vendedor_id);
CREATE INDEX IF NOT EXISTS idx_deals_etapa_id ON deals(etapa_id);
CREATE INDEX IF NOT EXISTS idx_deals_criado_em ON deals(criado_em);
CREATE INDEX IF NOT EXISTS idx_metricas_tipo ON metricas_cache(tipo);
