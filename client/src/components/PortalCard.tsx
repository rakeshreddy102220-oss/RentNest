import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PortalCardProps {
  title: string;
  description: string;
  button: string;
  to: string;
  accent: string;
}

export const PortalCard = ({ title, description, button, to, accent }: PortalCardProps) => {
  return (
    <Link
      to={to}
      className={`group relative overflow-hidden rounded-[32px] border border-white/40 bg-white/80 p-8 shadow-glass transition duration-500 hover:-translate-y-1 hover:bg-white/95 ${accent}`}
    >
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-br from-primary to-secondary opacity-10 blur-2xl" />
      <div className="relative space-y-4">
        <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Portal</p>
        <h3 className="text-2xl font-semibold text-slate-900">{title}</h3>
        <p className="max-w-sm text-sm leading-6 text-slate-600">{description}</p>
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition group-hover:translate-x-1">
          {button} <ArrowRight size={16} />
        </div>
      </div>
    </Link>
  );
};
