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

      </div>

      <div className="flex items-center gap-2 md:gap-5">
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
