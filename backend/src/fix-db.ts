import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function fixSchema() {
  console.log('--- Iniciando Correção de Schema ---');
  try {
    // Drop tables if they exist with wrong types
    console.log('Removendo tabelas antigas para ajuste de tipos...');
    await pool.query('DROP TABLE IF EXISTS metricas_cache CASCADE');
    await pool.query('DROP TABLE IF EXISTS deals CASCADE');
    await pool.query('DROP TABLE IF EXISTS etapas CASCADE');
    await pool.query('DROP TABLE IF EXISTS funis CASCADE');
    await pool.query('DROP TABLE IF EXISTS vendedores CASCADE');

    console.log('Recriando tabelas com tipos corretos (Agendor IDs)...');
    
    // Vendedores
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vendedores (
        id VARCHAR(100) PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        criado_em TIMESTAMP DEFAULT NOW()
      )
    `);

    // Funis
    await pool.query(`
      CREATE TABLE IF NOT EXISTS funis (
        id BIGINT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        criado_em TIMESTAMP DEFAULT NOW()
      )
    `);

    // Etapas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS etapas (
        id BIGINT PRIMARY KEY,
        funil_id BIGINT REFERENCES funis(id),
        nome VARCHAR(255) NOT NULL,
        ordem INTEGER
      )
    `);

    // Deals
    await pool.query(`
      CREATE TABLE IF NOT EXISTS deals (
        id BIGINT PRIMARY KEY,
        funil_id BIGINT REFERENCES funis(id),
        etapa_id BIGINT REFERENCES etapas(id),
        vendedor_id VARCHAR(100) REFERENCES vendedores(id),
        valor DECIMAL(15,2),
        status VARCHAR(50),
        criado_em TIMESTAMP,
        atualizado_em TIMESTAMP
      )
    `);

    // Cache
    await pool.query(`
      CREATE TABLE IF NOT EXISTS metricas_cache (
        id SERIAL PRIMARY KEY,
        tipo VARCHAR(50),
        dados JSONB,
        atualizado_em TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('--- Schema Corrigido com Sucesso! ---');
  } catch (err) {
    console.error('Erro ao corrigir schema:', err);
  } finally {
    await pool.end();
  }
}

fixSchema();
