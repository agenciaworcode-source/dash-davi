import { pool } from './config/database.js';

async function run() {
  try {
    const deals = await pool.query('SELECT * FROM deals');
    console.log(`Deals total: ${deals.rows.length}`);
    for (const d of deals.rows) {
      console.log(`Deal ID: ${d.id}, Stage ID: ${d.etapa_id}, Funnel ID: ${d.funil_id}, Status: ${d.status}`);
      const stage = await pool.query('SELECT * FROM etapas WHERE id = $1', [d.etapa_id]);
      console.log(`  Stage found: ${stage.rows.length > 0 ? stage.rows[0].nome : 'NOT FOUND'}`);
      const funnel = await pool.query('SELECT * FROM funis WHERE id = $1', [d.funil_id]);
      console.log(`  Funnel found: ${funnel.rows.length > 0 ? funnel.rows[0].nome : 'NOT FOUND'}`);
    }
    
    console.log('\n--- Exemplo de Etapas ---');
    const stages = await pool.query('SELECT id, nome, funil_id FROM etapas LIMIT 5');
    stages.rows.forEach(s => console.log(`Stage ID: ${s.id}, Name: ${s.nome}, Funnel: ${s.funil_id}`));
    
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
