
import { MoreVertical, Pencil, Trash2, Power, PowerOff, Eye, Copy, Send, Check, X, ExternalLink, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface RowAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'destructive';
  /** If true, a separator is rendered before this item */
  separator?: boolean;
  disabled?: boolean;
  hidden?: boolean;
}

interface RowActionsProps {
  actions: RowAction[];
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Edit: <Pencil className="h-3.5 w-3.5" />,
  Delete: <Trash2 className="h-3.5 w-3.5" />,
  Enable: <Power className="h-3.5 w-3.5" />,
  Disable: <PowerOff className="h-3.5 w-3.5" />,
  View: <Eye className="h-3.5 w-3.5" />,
  Duplicate: <Copy className="h-3.5 w-3.5" />,
  Send: <Send className="h-3.5 w-3.5" />,
  Approve: <Check className="h-3.5 w-3.5" />,
  Reject: <X className="h-3.5 w-3.5" />,
  Open: <ExternalLink className="h-3.5 w-3.5" />,
  Archive: <Archive className="h-3.5 w-3.5" />,
};

export function RowActions({ actions }: RowActionsProps) {
  const visibleActions = actions.filter(a => !a.hidden);
  if (visibleActions.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7 p-0">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {visibleActions.map((action, i) => (
          <span key={i}>
            {action.separator && i > 0 && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onClick={action.onClick}
              disabled={action.disabled}
              className={action.variant === 'destructive' ? 'text-destructive focus:text-destructive' : ''}
            >
              <span className="mr-2">{action.icon || ICON_MAP[action.label] || null}</span>
              {action.label}
            </DropdownMenuItem>
          </span>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
