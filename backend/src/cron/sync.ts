import cron from 'node-cron';
import { pool } from '../config/database.js';
import { AgendorService } from '../services/agendor.service.js';

export const syncAgendorData = async () => {
  console.log('[SYNC] Iniciando sincronização manual do Agendor...');
  try {
    // 1. Sincronizar Usuários (Vendedores)
    const users = await AgendorService.getUsers();
    for (const user of users) {
      await pool.query(
        `INSERT INTO vendedores (id, nome, criado_em)
         VALUES ($1, $2, NOW())
         ON CONFLICT (id) DO UPDATE SET nome = $2`,
        [user.id, user.name]
      );
    }

    // 2. Sincronizar Funis
    const funnels = await AgendorService.getFunnels();
    for (const funnel of funnels) {
      await pool.query(
        `INSERT INTO funis (id, nome, criado_em)
         VALUES ($1, $2, NOW())
         ON CONFLICT (id) DO UPDATE SET nome = $2`,
        [funnel.id, funnel.name]
      );

      // 3. Sincronizar Etapas por Funil
      const stages = await AgendorService.getStages(funnel.id);
      for (const stage of stages) {
        await pool.query(
          `INSERT INTO etapas (id, funil_id, nome, ordem)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (id) DO UPDATE SET nome = $3, ordem = $4`,
          [stage.id, funnel.id, stage.name, stage.sequence]
        );
      }
    }

    // 4. Sincronizar Deals (Negócios)
    const statuses = ['aberto', 'ganho', 'perdido'];
    let totalSynced = 0;

    for (const status of statuses) {
      const deals = await AgendorService.getDeals({ per_page: 100, status });
      console.log(`[SYNC] Sincronizando ${deals.length} deals com status '${status}'...`);
      
      for (const deal of deals) {
        await pool.query(
          `INSERT INTO deals (id, funil_id, etapa_id, vendedor_id, valor, status, criado_em, atualizado_em)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (id) DO UPDATE SET 
            etapa_id = $3, 
            valor = $5, 
            status = $6, 
            atualizado_em = $8`,
          [
            deal.id, 
            deal.dealStage?.funnel?.id || deal.funnel?.id, 
            deal.dealStage?.id, 
            deal.owner?.id || deal.user?.id, 
            deal.value || 0, 
            deal.dealStatus?.name === 'Ganho' ? 'ganho' : deal.dealStatus?.name === 'Perdido' ? 'perdido' : 'aberto',
            deal.createdAt,
            deal.updatedAt
          ]
        );
        totalSynced++;
      }
    }
    console.log(`[SYNC] Total de deals sincronizados: ${totalSynced}`);

    // 5. Atualizar Metricas Cache (Geral)
    const summaryRes = await pool.query(`
      SELECT 
        SUM(CASE WHEN status = 'ganho' THEN valor ELSE 0 END) as total_vendas,
        COUNT(CASE WHEN status = 'ganho' THEN 1 END) as leads_convertidos,
        COUNT(id) as total_leads
      FROM deals
    `);
    
    const summary = summaryRes.rows[0];
    const payload = {
      totalVendas: parseFloat(summary.total_vendas || 0),
      leadsConvertidos: parseInt(summary.leads_convertidos || 0),
      novosLeads: parseInt(summary.total_leads || 0)
    };

    await pool.query(
      `INSERT INTO metricas_cache (tipo, dados, atualizado_em) 
       VALUES ('geral', $1, NOW())`,
      [payload]
    );
    
    console.log('[SYNC] Sincronização do Agendor concluída com sucesso.');
    return { success: true };
  } catch (error) {
    console.error('[SYNC] Erro durante a sincronização do Agendor:', error);
    throw error;
  }
};

export const startCronJobs = () => {
  // Roda a cada 15 minutos
  cron.schedule('*/15 * * * *', async () => {
    await syncAgendorData();
  });

  console.log('Cronjobs iniciados (Sincronização Agendor agendada).');
};
