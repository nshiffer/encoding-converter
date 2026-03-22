import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

const THEMES = ['light', 'dark', 'cupcake', 'synthwave', 'corporate', 'retro', 'night', 'dracula'] as const;

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved && (THEMES as readonly string[]).includes(saved)) {
      setTheme(saved);
    } else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      {/* Header */}
      <header className="navbar bg-base-200/80 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-base-300">
        <div className="container mx-auto">
          <div className="navbar-start">
            <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src="/purple_logo.png" alt="converter.shwrk logo" className="w-8 h-8 object-contain" />
              <span className="font-bold text-lg tracking-tight">
                converter<span className="opacity-50">.shwrk</span>
              </span>
            </a>
          </div>

          <div className="navbar-center hidden lg:flex">
            <span className="text-sm text-base-content/50">Developer Encoding & Formatting Tools</span>
          </div>

          <div className="navbar-end gap-1">
            {/* Theme Picker */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-sm gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <span className="hidden sm:inline text-xs capitalize">{theme}</span>
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-200 rounded-box w-44 border border-base-300">
                {THEMES.map((t) => (
                  <li key={t}>
                    <button
                      className={theme === t ? 'active font-medium' : ''}
                      onClick={() => setTheme(t)}
                    >
                      <span className="capitalize">{t}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* GitHub */}
            <a
              href="https://github.com/encoding-converter"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm"
              aria-label="GitHub Repository"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-base-200 border-t border-base-300 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-base-content/60">
            <div className="flex items-center gap-2">
              <img src="/purple_logo.png" alt="" className="w-4 h-4 object-contain" aria-hidden="true" />
              <span className="font-semibold">converter.shwrk</span>
            </div>
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>All processing happens locally in your browser</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
