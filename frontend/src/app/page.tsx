'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Filters from '@/components/dashboard/Filters';
import StatsCards from '@/components/dashboard/StatsCards';
import FunnelChart from '@/components/dashboard/FunnelChart';
import VendorRanking from '@/components/dashboard/VendorRanking';
import { PlusCircle } from 'lucide-react';

const API_BASE_URL = '/api/dashboard';

interface FunilOverview {
  id: number;
  nome: string;
  total_deals: number;
  deals_ganhos: number;
  deals_perdidos: number;
  deals_abertos: number;
  valor_ganho: number;
  valor_pipeline: number;
  conversion: number;
  valor_formatado: string;
}

function FunilCard({
  funil,
  isSelected,
  onClick,
}: {
  funil: FunilOverview;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white p-5 rounded-2xl border shadow-sm cursor-pointer transition-all hover:shadow-md select-none ${
        isSelected
          ? 'border-blue-400 ring-2 ring-blue-100'
          : 'border-slate-100 hover:border-blue-200'
      }`}
    >
      <div className="flex items-center gap-2 mb-4">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs border shrink-0 ${
            isSelected
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-blue-50 text-blue-600 border-blue-100'
          }`}
        >
          {funil.nome.substring(0, 2).toUpperCase()}
        </div>
        <p className="text-xs font-bold text-slate-800 leading-tight line-clamp-2">{funil.nome}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Inscrições</p>
          <p className="text-xl font-extrabold text-slate-900">{funil.total_deals}</p>
        </div>
        <div>
          <p className="text-[9px] text-green-500 uppercase font-bold tracking-wider mb-0.5">Confirmados</p>
          <p className="text-xl font-extrabold text-green-600">{funil.deals_ganhos}</p>
        </div>
        <div>
          <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Presentes</p>
          <p className="text-base font-extrabold text-blue-600">{funil.conversion}%</p>
        </div>
        <div>
          <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Faturamento</p>
          <p className="text-sm font-extrabold text-slate-900">{funil.valor_formatado}</p>
        </div>
      </div>

      {/* Barra de conversão */}
      <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-blue-600 h-full transition-all duration-700"
          style={{ width: `${Math.min(funil.conversion, 100)}%` }}
        />
      </div>

      <div className="flex justify-between mt-2 text-[9px] text-slate-300 font-medium">
        <span>{funil.deals_abertos} abertos</span>
        <span>{funil.deals_perdidos} perdidos</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState({ totalVendas: 0, leadsConvertidos: 0, novosLeads: 0 });
  const [pipeline, setPipeline] = useState([]);
  const [funnels, setFunnels] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [funisOverview, setFunisOverview] = useState<FunilOverview[]>([]);

  const [selectedFunnel, setSelectedFunnel] = useState('');
  const [selectedMes, setSelectedMes] = useState('');
  const [selectedAno, setSelectedAno] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const dealParams = {
        funil_id: selectedFunnel || undefined,
        mes: selectedMes || undefined,
        ano: selectedAno || undefined,
      };
      const periodParams = {
        mes: selectedMes || undefined,
        ano: selectedAno || undefined,
      };

      const [metricaRes, pipelineRes, funisRes, rankingRes, overviewRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/metrics`, { params: dealParams }),
        axios.get(`${API_BASE_URL}/pipeline`, { params: dealParams }),
        axios.get(`${API_BASE_URL}/funis`),
        axios.get(`${API_BASE_URL}/ranking`, { params: periodParams }),
        axios.get(`${API_BASE_URL}/funis-overview`, { params: periodParams }),
      ]);

      if (metricaRes.data.success) setMetrics(metricaRes.data.data.dados);
      if (pipelineRes.data.success) setPipeline(pipelineRes.data.data);
      if (funisRes.data.success) setFunnels(funisRes.data.data);
      if (rankingRes.data.success) setRanking(rankingRes.data.data);
      if (overviewRes.data.success) setFunisOverview(overviewRes.data.data);
    } catch (err) {
      console.error('Erro ao buscar dados do dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFunnel, selectedMes, selectedAno]);

  const handleFunnelSelect = (id: string) => {
    setSelectedFunnel((prev) => (prev === id ? '' : id));
  };

  // Totais consolidados de todos os funis (para o painel lateral)
  const totalAbertos = funisOverview.reduce((acc, f) => acc + f.deals_abertos, 0);
  const totalGanhos = funisOverview.reduce((acc, f) => acc + f.deals_ganhos, 0);
  const totalPerdidos = funisOverview.reduce((acc, f) => acc + f.deals_perdidos, 0);

  return (
    <div className="relative bg-slate-50 min-h-screen">
      <div className="pt-6 px-4 md:px-8 pb-12 max-w-[1600px] mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-700">
        {/* Filtros */}
        <Filters
          funnels={funnels}
          selectedFunnel={selectedFunnel}
          selectedMes={selectedMes}
          selectedAno={selectedAno}
          onFunnelChange={setSelectedFunnel}
          onMesChange={setSelectedMes}
          onAnoChange={setSelectedAno}
        />

        {/* KPIs globais ou do funil selecionado */}
        <StatsCards metrics={metrics} loading={loading} />

        {/* Grid de todos os vendedores — sempre visível */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Visão por Vendedor</h3>
              <p className="text-xs text-slate-400">
                {selectedFunnel
                  ? 'Clique no mesmo card para ver todos'
                  : 'Clique em um card para filtrar o dashboard'}
              </p>
            </div>
            {selectedFunnel && (
              <button
                onClick={() => setSelectedFunnel('')}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                ← Ver todos
              </button>
            )}
          </div>

          {loading && funisOverview.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 h-44 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {funisOverview.map((funil) => (
                <FunilCard
                  key={funil.id}
                  funil={funil}
                  isSelected={selectedFunnel === String(funil.id)}
                  onClick={() => handleFunnelSelect(String(funil.id))}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pipeline + Painel lateral */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-3">
            <FunnelChart data={pipeline} />
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-6 min-h-[400px]">
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-1">
                  Consolidado
                </h4>
                <p className="text-xs text-slate-400">Todos os vendedores no período</p>
              </div>

              {/* Totais consolidados */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                    Abertos
                  </p>
                  <p className="text-2xl font-extrabold text-slate-900">{totalAbertos}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-[9px] text-green-500 uppercase font-bold tracking-wider mb-1">
                    Ganhos
                  </p>
                  <p className="text-2xl font-extrabold text-green-600">{totalGanhos}</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 text-center">
                  <p className="text-[9px] text-red-400 uppercase font-bold tracking-wider mb-1">
                    Perdidos
                  </p>
                  <p className="text-2xl font-extrabold text-red-500">{totalPerdidos}</p>
                </div>
              </div>

              {/* Taxa de conversão geral */}
              {funisOverview.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-semibold text-slate-500">Taxa de Conversão Geral</p>
                    <p className="text-xs font-extrabold text-blue-600">
                      {(totalGanhos + totalPerdidos + totalAbertos) > 0
                        ? ((totalGanhos / (totalGanhos + totalPerdidos + totalAbertos)) * 100).toFixed(1)
                        : 0}%
                    </p>
                  </div>
                  <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full transition-all duration-700"
                      style={{
                        width: `${
                          (totalGanhos + totalPerdidos + totalAbertos) > 0
                            ? (totalGanhos / (totalGanhos + totalPerdidos + totalAbertos)) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Ranking rápido: top 3 */}
              {funisOverview.length > 0 && (
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-3">
                    Top Vendedores
                  </p>
                  <div className="space-y-2">
                    {funisOverview.slice(0, 3).map((f, idx) => (
                      <div key={f.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold text-slate-300 w-4">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-700">{f.nome}</span>
                        </div>
                        <span className="text-xs font-bold text-green-600">
                          {f.deals_ganhos} ganhos
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 mt-auto">
                <div className="flex items-center gap-3">
                  <PlusCircle size={16} className="text-blue-600 shrink-0" />
                  <p className="text-[10px] leading-relaxed text-slate-500">
                    <strong className="text-blue-700">
                      {funisOverview.length} vendedores
                    </strong>{' '}
                    ativos no período selecionado.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ranking detalhado */}
        <VendorRanking data={ranking} />
      </div>

    </div>
  );
}
