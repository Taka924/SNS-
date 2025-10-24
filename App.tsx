
import React from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import AnalyzerPage from './pages/AnalyzerPage';
import LearnPage from './pages/LearnPage';
import { ResilienceProvider } from './hooks/useResilienceScore';
import { ShieldCheckIcon, BookOpenIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

// Moved NavLink to module scope
const NavLink: React.FC<{ to: string; icon: React.ElementType; children: React.ReactNode }> = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  // Adjust isActive to correctly default to AnalyzerPage when path is "/"
  const isActive = location.pathname === to || (location.pathname === '/' && to === '/analyzer');

  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out
                  ${isActive ? 'bg-sky-600 text-white' : 'text-sky-100 hover:bg-sky-500 hover:text-white'}`}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon className="h-5 w-5 mr-3" aria-hidden="true" />
      {children}
    </Link>
  );
};

const App: React.FC = () => {
  return (
    <ResilienceProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-sky-800 to-slate-900 text-gray-100">
          <header className="bg-slate-900/70 backdrop-blur-md shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-20">
                <div className="flex items-center">
                   <InformationCircleIcon className="h-10 w-10 text-sky-400" aria-hidden="true" />
                  <h1 className="ml-3 text-2xl sm:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300">
                    SNS偽情報ファクトチェッカー
                  </h1>
                </div>
                <nav aria-label="メインナビゲーション" className="flex space-x-2 sm:space-x-4">
                  <NavLink to="/analyzer" icon={ShieldCheckIcon}>分析ツール</NavLink>
                  <NavLink to="/learn" icon={BookOpenIcon}>学習モード</NavLink>
                </nav>
              </div>
            </div>
          </header>

          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<AnalyzerPage />} />
              <Route path="/analyzer" element={<AnalyzerPage />} />
              <Route path="/learn" element={<LearnPage />} />
            </Routes>
          </main>

          <footer className="bg-slate-900/70 backdrop-blur-md text-center py-6 shadow-top-lg">
            <p className="text-sm text-sky-300">
              © {new Date().getFullYear()} SNS偽情報ファクトチェッカー. AIによる分析は参考情報です。最終的な判断はご自身で行ってください。
            </p>
          </footer>
        </div>
      </HashRouter>
    </ResilienceProvider>
  );
};

export default App;
