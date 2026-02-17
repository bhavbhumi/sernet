import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const themeOptions = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'system', icon: Monitor, label: 'System' },
] as const;

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const CurrentIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className="p-2 text-muted-foreground hover:text-primary transition-colors"
        onClick={() => setOpen(!open)}
        aria-label="Toggle theme"
      >
        <CurrentIcon className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-32 bg-background border border-border rounded-md shadow-lg z-50 py-1">
          {themeOptions.map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              className={`flex items-center gap-2 w-full text-left px-4 py-2 text-[14px] hover:bg-muted transition-colors ${
                theme === value ? 'text-primary font-medium' : 'text-muted-foreground'
              }`}
              onClick={() => { setTheme(value); setOpen(false); }}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
