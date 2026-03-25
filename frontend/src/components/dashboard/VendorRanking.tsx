'use client';

import { Filter } from 'lucide-react';

interface Vendor {
  id: string;
  nome: string;
  open_deals: number;
  conversion: string;
  total_pipeline: string;
  segment: string;
}

interface VendorRankingProps {
  data: Vendor[];
}

export default function VendorRanking({ data }: VendorRankingProps) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h4 className="text-xl font-bold text-slate-900 tracking-tight">Performance dos Vendedores</h4>
          <p className="text-xs text-slate-400">Eficiência e conversão por colaborador</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-blue-600 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto -mx-8 px-8">
        <table className="w-full text-left min-w-[480px]">
          <thead>
            <tr className="border-b border-slate-50">
              <th className="pb-5 text-[10px] font-bold text-slate-300 uppercase tracking-widest">Colaborador</th>
              <th className="pb-5 text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center">Deals</th>
              <th className="pb-5 text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center">Conversão</th>
              <th className="pb-5 text-[10px] font-bold text-slate-300 uppercase tracking-widest text-right">Volume</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.length > 0 ? (
              data.map((vendor) => (
                <tr key={vendor.id} className="group hover:bg-slate-50/30 transition-colors">
                  <td className="py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-[10px] border border-blue-100">
                        {vendor.nome.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">{vendor.nome}</p>
                        <p className="text-[10px] text-slate-300 uppercase font-medium">{vendor.segment}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 text-center">
                    <span className="text-sm font-bold text-slate-900">{vendor.open_deals}</span>
                  </td>
                  <td className="py-5 text-center">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">{vendor.conversion}</span>
                  </td>
                  <td className="py-5 text-right">
                    <span className="text-sm font-extrabold text-slate-900">{vendor.total_pipeline}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-10 text-center text-xs text-slate-400">
                  Nenhum dado de performance disponível.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
