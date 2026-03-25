'use client';

import { Search, Bell, History, Menu } from 'lucide-react';

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md h-16 px-4 md:px-8 flex justify-between items-center border-b border-slate-100 shrink-0">
      <div className="flex items-center gap-3">
        {/* Hamburger — só mobile */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-colors"
          onClick={onMenuClick}
          aria-label="Abrir menu"
        >
          <Menu size={22} />
        </button>

        {/* Search — oculto em mobile */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/10 w-64 outline-none transition-all"
            placeholder="Pesquisar..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-5">
        <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-slate-50">
          <Bell size={20} />
        </button>
        <button className="hidden md:block p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-slate-50">
          <History size={20} />
        </button>
        <div className="hidden md:block h-6 w-px bg-slate-100 mx-1" />
        <div className="flex items-center gap-2">
          <div className="hidden md:block text-right">
            <p className="text-xs font-bold text-slate-900">Admin</p>
            <p className="text-[10px] text-slate-400">Administrador</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100 shadow-sm shrink-0">
            <span className="text-xs">AD</span>
          </div>
        </div>
      </div>
    </header>
  );
}
