import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-[#8A4325] shrink-0" />,
  };

  const bgStyles = {
    success: 'bg-[#F4FAF6] border-[#B7E4C7] text-slate-900',
    warning: 'bg-[#FFF9F2] border-[#FED7AA] text-slate-900',
    info: 'bg-[#FDF8F5] border-[#E8C5B0] text-slate-900',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className={`p-4 rounded-xl border shadow-lg flex items-start gap-3 ${bgStyles[toast.type]}`}>
        {icons[toast.type]}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#2D1E18]">{toast.title}</p>
          <p className="text-xs text-[#5D4037] mt-0.5 leading-relaxed">{toast.desc}</p>
        </div>
      </div>
    </div>
  );
};
