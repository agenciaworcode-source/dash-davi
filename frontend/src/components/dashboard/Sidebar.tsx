'use client';

import { Home, HelpCircle, LogOut, Beaker, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const handleSync = async () => {
    try {
      const res = await fetch('/api/dashboard/sync', { method: 'POST', credentials: 'include' });
      const data = await res.json();
      if (data.success) alert('Sincronização concluída!');
      else alert('Erro: ' + data.error);
    } catch {
      alert('Erro de conexão com o servidor');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    window.location.href = '/login';
  };

  return (
    <aside
      className={`
        h-screen w-64 fixed left-0 top-0 border-r border-slate-100 bg-white flex flex-col py-6 z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}
    >
      {/* Botão fechar — apenas mobile */}
      <button
        className="absolute top-4 right-4 md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
        onClick={onClose}
      >
        <X size={18} />
      </button>

      <div className="px-6 mb-10">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Beautyderm Logo" className="h-10 w-auto" />
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        <a
          className="flex items-center gap-3 px-4 py-3 text-blue-600 font-bold bg-blue-50/50 rounded-xl transition-all"
          href="#"
          onClick={onClose}
        >
          <Home size={20} />
          <span className="text-sm">Visão Geral</span>
        </a>
      </nav>

      <div className="px-6 mt-auto pt-6 border-t border-slate-100 space-y-4">
        <button
          onClick={handleSync}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-sm"
        >
          Sincronizar CRM
        </button>
        <div className="space-y-1">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-2 py-2 text-slate-500 text-xs font-semibold hover:text-red-500 transition-colors w-full"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </div>
    </aside>
  );
}
