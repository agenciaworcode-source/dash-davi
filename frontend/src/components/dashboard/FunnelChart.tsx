'use client';

import { ChevronRight } from 'lucide-react';

interface PipelineStage {
  etapa: string;
  total: number;
}

interface FunnelChartProps {
  data: PipelineStage[];
}

export default function FunnelChart({ data }: FunnelChartProps) {
  const maxDeals = Math.max(...data.map(d => d.total), 1);

  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm h-full">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h4 className="text-lg font-bold text-slate-900">Pipeline de Vendas</h4>
          <p className="text-xs text-slate-400">Conversão por etapa do funil</p>
        </div>
        <button className="text-blue-600 text-[10px] font-bold flex items-center gap-1 hover:underline">
          VER DETALHES <ChevronRight size={12} />
        </button>
      </div>
      <div className="space-y-8">
        {data.map((stage, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex justify-between items-end gap-2">
              <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase truncate">{stage.etapa}</span>
              <span className="text-xs font-bold text-blue-600 shrink-0">{stage.total}</span>
            </div>
            <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-1000 shadow-sm" 
                style={{ 
                  width: `${(stage.total / maxDeals) * 100}%`,
                  opacity: 1 - (idx * 0.12)
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
