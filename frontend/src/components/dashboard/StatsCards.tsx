import { Handshake, PieChart, Landmark, TrendingUp, Verified, Clock } from 'lucide-react';

interface StatsProps {
  metrics: {
    totalVendas: number;
    leadsConvertidos: number;
    novosLeads: number;
  };
  loading?: boolean;
}

export default function StatsCards({ metrics, loading }: StatsProps) {
  const conversionRate = metrics.novosLeads > 0
    ? ((metrics.leadsConvertidos / metrics.novosLeads) * 100).toFixed(1)
    : 0;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
      {/* Total de Negócios */}
      <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-100 group transition-all hover:border-blue-100">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <Handshake size={24} />
          </div>
          <span className="text-xs font-bold text-blue-600 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg">
            <TrendingUp size={14} /> +12.5%
          </span>
        </div>
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Inscrições</p>
        <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">{metrics.novosLeads}</h3>
        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
          <span className="text-[10px] text-slate-300 font-medium tracking-tight">VS PERÍODO ANTERIOR</span>
        </div>
      </div>

      {/* Taxa de Conversão */}
      <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-100 group transition-all hover:border-blue-100">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <PieChart size={24} />
          </div>
          <span className="text-xs font-bold text-blue-600 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg">
            <Verified size={14} /> Pico
          </span>
        </div>
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Presentes</p>
        <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">{conversionRate}%</h3>
        <div className="mt-4 pt-4 border-t border-slate-50">
          <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-1000" 
              style={{ width: `${conversionRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Valor Total */}
      <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-100 group transition-all hover:border-blue-100 overflow-hidden">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <Landmark size={24} />
          </div>
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg">
            <Clock size={14} /> Meta 92%
          </span>
        </div>
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Faturamento</p>
        <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(metrics.totalVendas)}
        </h3>
        <p className="text-[10px] text-slate-300 font-medium mt-4 pt-4 border-t border-slate-50 uppercase tracking-tighter">Receita bruta gerada</p>
      </div>
    </div>
  );
}
