import { AlertCircle } from 'lucide-react';

interface Props {
  message?: string;
}

const EmptyState = ({ message = "No data available for this filter combination. Try adjusting your selections." }: Props) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border-dim bg-surface px-6 py-12 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: 'hsl(var(--primary) / 0.10)' }}>
      <AlertCircle className="h-6 w-6 text-primary" strokeWidth={1.5} />
    </div>
    <p className="max-w-xs text-sm text-muted-foreground leading-relaxed">{message}</p>
  </div>
);

export default EmptyState;
