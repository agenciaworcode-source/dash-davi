import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 3000,
});

export const initDb = async () => {
  try {
    // Tabela de Vendedores
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vendedores (
        id VARCHAR(100) PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        criado_em TIMESTAMP DEFAULT NOW()
      )
    `);

    // Tabela de Funis
    await pool.query(`
      CREATE TABLE IF NOT EXISTS funis (
        id BIGINT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        criado_em TIMESTAMP DEFAULT NOW()
      )
    `);

    // Tabela de Etapas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS etapas (
        id BIGINT PRIMARY KEY,
        funil_id BIGINT REFERENCES funis(id),
        nome VARCHAR(255) NOT NULL,
        ordem INTEGER
      )
    `);

    // Tabela de Deals
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

    // Tabela de Cache
    await pool.query(`
      CREATE TABLE IF NOT EXISTS metricas_cache (
        id SERIAL PRIMARY KEY,
        tipo VARCHAR(50),
        dados JSONB,
        atualizado_em TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('Banco de dados inicializado com sucesso!');
  } catch (err) {
    console.error('Erro ao inicializar o banco de dados:', err);
  }
};

export const testConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Banco de dados conectado com sucesso! Hora do BD:', res.rows[0].now);
    await initDb();
  } catch (err) {
    console.error('Erro na conexão com o banco de dados:', err);
  }
};
