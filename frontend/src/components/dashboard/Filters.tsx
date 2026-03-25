'use client';

import { Calendar } from 'lucide-react';

const MESES = [
  { value: '', label: 'Todos os Meses' },
  { value: '1', label: 'Janeiro' },
  { value: '2', label: 'Fevereiro' },
  { value: '3', label: 'Março' },
  { value: '4', label: 'Abril' },
  { value: '5', label: 'Maio' },
  { value: '6', label: 'Junho' },
  { value: '7', label: 'Julho' },
  { value: '8', label: 'Agosto' },
  { value: '9', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' },
];

const currentYear = new Date().getFullYear();
const ANOS = [
  { value: '', label: 'Todos os Anos' },
  { value: String(currentYear - 1), label: String(currentYear - 1) },
  { value: String(currentYear), label: String(currentYear) },
];

interface FiltersProps {
  funnels: { id: number; nome: string }[];
  selectedFunnel: string;
  selectedMes: string;
  selectedAno: string;
  onFunnelChange: (id: string) => void;
  onMesChange: (mes: string) => void;
  onAnoChange: (ano: string) => void;
}

export default function Filters({
  funnels,
  selectedFunnel,
  selectedMes,
  selectedAno,
  onFunnelChange,
  onMesChange,
  onAnoChange,
}: FiltersProps) {
  const now = new Date();
  const mesAtual = String(now.getMonth() + 1);
  const anoAtual = String(now.getFullYear());

  const isEsteMes = selectedMes === mesAtual && selectedAno === anoAtual;
  const isAno = !selectedMes && selectedAno === anoAtual;
  const isTodos = !selectedMes && !selectedAno;

  const handleEsteMes = () => {
    onMesChange(mesAtual);
    onAnoChange(anoAtual);
  };

  const handleAno = () => {
    onMesChange('');
    onAnoChange(anoAtual);
  };

  const handleTodos = () => {
    onMesChange('');
    onAnoChange('');
  };

  const selectClass =
    'bg-slate-50 border border-slate-100 text-slate-700 text-xs font-semibold rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all';

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard de Vendas</h2>
        <p className="text-sm text-slate-500">Acompanhamento em tempo real da Beautyderm</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        {/* Seletor de Vendedor/Funil */}
        <select
          className={selectClass}
          value={selectedFunnel}
          onChange={(e) => onFunnelChange(e.target.value)}
        >
          <option value="">Todos os Vendedores</option>
          {funnels.map((f) => (
            <option key={f.id} value={f.id}>
              {f.nome.replace('Vendedor(a) ', '')}
            </option>
          ))}
        </select>

        {/* Seletor de Mês */}
        <select
          className={selectClass}
          value={selectedMes}
          onChange={(e) => onMesChange(e.target.value)}
        >
          {MESES.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        {/* Seletor de Ano */}
        <select
          className={selectClass}
          value={selectedAno}
          onChange={(e) => onAnoChange(e.target.value)}
        >
          {ANOS.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>

        {/* Atalhos de período */}
        <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
          <button
            onClick={handleEsteMes}
            className={`px-4 py-1.5 text-[10px] font-bold rounded-lg transition-colors ${
              isEsteMes
                ? 'bg-white text-blue-600 shadow-sm border border-slate-100'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Este Mês
          </button>
          <button
            onClick={handleAno}
            className={`px-4 py-1.5 text-[10px] font-bold rounded-lg transition-colors ${
              isAno
                ? 'bg-white text-blue-600 shadow-sm border border-slate-100'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Ano
          </button>
          <button
            onClick={handleTodos}
            className={`px-4 py-1.5 text-[10px] font-bold rounded-lg transition-colors ${
              isTodos
                ? 'bg-white text-blue-600 shadow-sm border border-slate-100'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Todos
          </button>
          <div className="px-3 flex items-center text-slate-300">
            <Calendar size={14} />
          </div>
        </div>
      </div>
    </div>
  );
}
