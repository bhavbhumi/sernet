import { Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface FieldInfoTooltipProps {
  tip: string;
}

export function FieldInfoTooltip({ tip }: FieldInfoTooltipProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className="inline-flex items-center justify-center focus:outline-none">
          <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-help transition-colors" />
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" align="start" className="max-w-[260px] text-xs leading-relaxed p-2.5">
        {tip}
      </PopoverContent>
    </Popover>
  );
}
