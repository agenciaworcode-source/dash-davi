import { pool } from './config/database';

async function checkDb() {
  try {
    const funis = await pool.query('SELECT count(*) FROM funis');
    const etapas = await pool.query('SELECT count(*) FROM etapas');
    const deals = await pool.query('SELECT count(*) FROM deals');
    const vendedores = await pool.query('SELECT count(*) FROM vendedores');

    console.log('--- Resumo do Banco de Dados ---');
    console.log('Funis:', funis.rows[0].count);
    console.log('Etapas:', etapas.rows[0].count);
    console.log('Deals:', deals.rows[0].count);
    console.log('Vendedores:', vendedores.rows[0].count);

    if (parseInt(funis.rows[0].count) > 0) {
      const sample = await pool.query('SELECT * FROM funis LIMIT 3');
      console.log('Exemplo de Funis:', sample.rows);
    }
    
    console.log('--- Fim do Resumo ---');
  } catch (err) {
    console.error('Erro ao verificar banco:', err);
  } finally {
    await pool.end();
  }
}

checkDb();
