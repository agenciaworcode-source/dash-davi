import { Router } from 'express';
import { pool } from '../config/database.js';
import { syncAgendorData } from '../cron/sync.js';

const router = Router();

// Helper: adiciona filtro de data no ON clause do LEFT JOIN (não converte para INNER JOIN)
function addJoinDate(params: any[], mes?: string, ano?: string): string {
  let clause = '';
  if (ano) {
    params.push(parseInt(ano));
    clause += ` AND EXTRACT(YEAR FROM d.criado_em) = $${params.length}`;
  }
  if (mes) {
    params.push(parseInt(mes));
    clause += ` AND EXTRACT(MONTH FROM d.criado_em) = $${params.length}`;
  }
  return clause;
}

// Helper: adiciona filtro de data no WHERE (para queries diretas em deals)
function addWhereDate(params: any[], mes?: string, ano?: string): string {
  let clause = '';
  if (ano) {
    params.push(parseInt(ano));
    clause += ` AND EXTRACT(YEAR FROM d.criado_em) = $${params.length}`;
  }
  if (mes) {
    params.push(parseInt(mes));
    clause += ` AND EXTRACT(MONTH FROM d.criado_em) = $${params.length}`;
  }
  return clause;
}

// Sincronização manual
router.post('/sync', async (_req, res) => {
  try {
    const result = await syncAgendorData();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Listar vendedores
router.get('/vendedores', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM vendedores ORDER BY nome ASC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erro ao buscar vendedores' });
  }
});

// Listar funis
router.get('/funis', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM funis ORDER BY nome ASC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erro ao buscar funis' });
  }
});

// Visão geral de TODOS os funis (um card por vendedor)
router.get('/funis-overview', async (req, res) => {
  const { mes, ano } = req.query;
  try {
    const params: any[] = [];
    const dateJoin = addJoinDate(params, mes as string, ano as string);

    const query = `
      SELECT
        f.id,
        f.nome,
        COUNT(d.id) as total_deals,
        COUNT(CASE WHEN d.status = 'ganho' THEN 1 END) as deals_ganhos,
        COUNT(CASE WHEN d.status = 'perdido' THEN 1 END) as deals_perdidos,
        COUNT(CASE WHEN d.status = 'aberto' THEN 1 END) as deals_abertos,
        COALESCE(SUM(CASE WHEN d.status = 'ganho' THEN d.valor ELSE 0 END), 0) as valor_ganho,
        COALESCE(SUM(d.valor), 0) as valor_pipeline,
        CASE
          WHEN COUNT(d.id) > 0 THEN
            ROUND((COUNT(CASE WHEN d.status = 'ganho' THEN 1 END)::numeric / COUNT(d.id)) * 100, 1)
          ELSE 0
        END as conversion
      FROM funis f
      LEFT JOIN deals d ON f.id = d.funil_id${dateJoin}
      GROUP BY f.id, f.nome
      ORDER BY deals_ganhos DESC, valor_ganho DESC
    `;

    const { rows } = await pool.query(query, params);

    const data = rows.map(r => ({
      id: r.id,
      nome: r.nome.replace('Vendedor(a) ', ''),
      total_deals: parseInt(r.total_deals),
      deals_ganhos: parseInt(r.deals_ganhos),
      deals_perdidos: parseInt(r.deals_perdidos),
      deals_abertos: parseInt(r.deals_abertos),
      valor_ganho: parseFloat(r.valor_ganho),
      valor_pipeline: parseFloat(r.valor_pipeline),
      conversion: parseFloat(r.conversion),
      valor_formatado: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        notation: 'compact'
      }).format(parseFloat(r.valor_ganho))
    }));

    res.json({ success: true, data });
  } catch (error) {
    console.error('Erro ao buscar funis-overview:', error);
    res.status(500).json({ success: false, error: 'Erro ao buscar visão geral dos funis' });
  }
});

// Métricas globais ou filtradas (funil + vendedor + período)
router.get('/metrics', async (req, res) => {
  const { funil_id, vendedor_id, mes, ano } = req.query;
  try {
    const params: any[] = [];
    let query = `
      SELECT
        COALESCE(SUM(CASE WHEN d.status = 'ganho' THEN d.valor ELSE 0 END), 0) as totalVendas,
        COUNT(CASE WHEN d.status = 'ganho' THEN 1 END) as leadsConvertidos,
        COUNT(d.id) as novosLeads
      FROM deals d
      WHERE 1=1
    `;

    if (funil_id) {
      params.push(funil_id);
      query += ` AND d.funil_id = $${params.length}`;
    }
    if (vendedor_id) {
      params.push(vendedor_id);
      query += ` AND d.vendedor_id = $${params.length}`;
    }
    query += addWhereDate(params, mes as string, ano as string);

    const { rows } = await pool.query(query, params);

    res.json({
      success: true,
      data: {
        dados: {
          totalVendas: parseFloat(rows[0].totalvendas || 0),
          leadsConvertidos: parseInt(rows[0].leadsconvertidos || 0),
          novosLeads: parseInt(rows[0].novosleads || 0)
        },
        atualizado_em: new Date()
      }
    });
  } catch (error) {
    console.error('Erro ao buscar métricas:', error);
    res.status(500).json({ success: false, error: 'Erro interno ao buscar as métricas.' });
  }
});

// Pipeline por etapa (com filtros de funil, vendedor e período)
router.get('/pipeline', async (req, res) => {
  const { funil_id, vendedor_id, mes, ano } = req.query;
  try {
    const params: any[] = [];
    let query = '';

    if (funil_id) {
      params.push(funil_id);
      const dateJoin = addJoinDate(params, mes as string, ano as string);

      let vendedorCond = '';
      if (vendedor_id) {
        params.push(vendedor_id);
        vendedorCond = ` AND d.vendedor_id = $${params.length}`;
      }

      query = `
        SELECT e.nome as etapa, COALESCE(COUNT(d.id), 0) as total
        FROM etapas e
        LEFT JOIN deals d ON e.id = d.etapa_id${dateJoin}${vendedorCond}
        WHERE e.funil_id = $1
        GROUP BY e.id, e.nome, e.ordem
        ORDER BY e.ordem ASC
      `;
    } else {
      const dateJoin = addJoinDate(params, mes as string, ano as string);

      let vendedorCond = '';
      if (vendedor_id) {
        params.push(vendedor_id);
        vendedorCond = ` AND d.vendedor_id = $${params.length}`;
      }

      query = `
        SELECT e.nome as etapa, COALESCE(COUNT(d.id), 0) as total, MIN(e.ordem) as ordem
        FROM etapas e
        LEFT JOIN deals d ON e.id = d.etapa_id${dateJoin}${vendedorCond}
        GROUP BY e.nome
        ORDER BY ordem ASC
      `;
    }

    const { rows } = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Erro ao buscar pipeline:', error);
    res.status(500).json({ success: false, error: 'Erro interno' });
  }
});

// Ranking de performance por funil/vendedor (com filtro de período)
router.get('/ranking', async (req, res) => {
  const { mes, ano } = req.query;
  try {
    const params: any[] = [];
    const dateJoin = addJoinDate(params, mes as string, ano as string);

    const query = `
      SELECT
        f.id,
        f.nome,
        COUNT(d.id) as total_deals,
        COUNT(CASE WHEN d.status = 'ganho' THEN 1 END) as deals_ganhos,
        CASE
          WHEN COUNT(d.id) > 0 THEN
            ROUND((COUNT(CASE WHEN d.status = 'ganho' THEN 1 END)::numeric / COUNT(d.id)) * 100, 1)
          ELSE 0
        END as conversion,
        COALESCE(SUM(CASE WHEN d.status = 'ganho' THEN d.valor ELSE 0 END), 0) as total_ganho
      FROM funis f
      LEFT JOIN deals d ON f.id = d.funil_id${dateJoin}
      GROUP BY f.id, f.nome
      ORDER BY total_ganho DESC, conversion DESC
      LIMIT 10
    `;
    const { rows } = await pool.query(query, params);

    const data = rows.map(r => ({
      id: r.id,
      nome: r.nome.replace('Vendedor(a) ', ''),
      open_deals: parseInt(r.total_deals),
      deals_ganhos: parseInt(r.deals_ganhos),
      conversion: parseFloat(r.conversion) + '%',
      total_pipeline: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        notation: 'compact'
      }).format(parseFloat(r.total_ganho)),
      segment: parseInt(r.total_deals) + ' negócios'
    }));

    res.json({ success: true, data });
  } catch (error) {
    console.error('Erro ao buscar ranking:', error);
    res.status(500).json({ success: false, error: 'Erro ao buscar ranking' });
  }
});

export default router;
