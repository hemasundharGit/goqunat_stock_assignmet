import { CandlestickChart } from 'lucide-react';

export function Header() {
  return (
    <header className="flex items-center gap-3 p-4 border-b shrink-0">
      <CandlestickChart className="size-7 text-primary" />
      <h1 className="text-2xl font-headline font-bold text-foreground tracking-tighter">
        OrderStream
      </h1>
    </header>
  );
}
