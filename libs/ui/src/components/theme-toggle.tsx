import { MoonIcon, SunIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './button';

export function ThemeToggle() {
  // 1. Initialize state with localStorage value or default to light
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'light',
  );

  // 2. Watch for changes to the theme state
  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  // 3. Handler function to switch states
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <Button
      size="icon-lg"
      variant="outline"
      onClick={toggleTheme}
      className="transition-colors duration-200
                 bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-50
                 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-700"
    >
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
}
