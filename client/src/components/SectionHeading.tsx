interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export const SectionHeading = ({ title, subtitle }: SectionHeadingProps) => (
  <div className="space-y-3 text-center">
    <p className="text-sm uppercase tracking-[0.3em] text-primary">RentNest</p>
    <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">{title}</h2>
    {subtitle ? <p className="mx-auto max-w-2xl text-slate-600">{subtitle}</p> : null}
  </div>
);
