import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard, Home, Target, BarChart3, Gift, User } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation.jsx';
import '@/styles/dasbor-theme.css';

const DasborLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDesktop, setIsDesktop] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsDesktop(window.innerWidth > 1024);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // 🔥 FIX ZOOM DI MOBILE
  useEffect(() => {
    const meta = document.querySelector('meta[name=viewport]');
    if (meta) {
      meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    return () => {
      if (meta) {
        meta.setAttribute('content', 'width=device-width, initial-scale=1.0');
      }
    };
  }, []);

  const navItems = [
    { path: '/dasbor', icon: Home, label: 'Beranda' },
    { path: '/tracker', icon: Target, label: 'Tracker' },
    { path: '/insights', icon: BarChart3, label: 'Insights' },
    { path: '/rewards', icon: Gift, label: 'Rewards' },
    { path: '/dasbor-profile', icon: User, label: 'Profil' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="dasbor-root">
      <header className="dasbor-header sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-[#4A7C2E] transition-all duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium hidden md:inline">Kembali ke Vityuu</span>
            </button>
            
            {!isDesktop && (
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <LayoutDashboard className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#6B9E3A] flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="font-bold text-gray-800 text-sm hidden sm:inline">Dasbor Vityuu</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto relative">
        {isDesktop && (
          <aside className="w-64 flex-shrink-0 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto py-6 px-3 bg-white border-r border-gray-200">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                      active
                        ? 'bg-[#E8F5D8] text-[#4A7C2E] font-semibold shadow-sm'
                        : 'text-gray-600 hover:bg-[#F0F7E8] hover:text-[#4A7C2E] hover:translate-x-1'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${active ? 'text-[#6B9E3A]' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                    {active && (
                      <span className="ml-auto w-1.5 h-8 rounded-full bg-[#6B9E3A]" />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200 px-4">
              <p className="text-xs text-gray-400">Vityuu Ecosystem v2.0</p>
              <p className="text-xs text-gray-300">© 2026 All rights reserved</p>
            </div>
          </aside>
        )}

        <main className={`flex-1 min-h-screen ${isDesktop ? 'px-8 py-8' : 'px-4 py-4'} pb-32 bg-gray-50`}>
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>

        {!isDesktop && isSidebarOpen && (
          <>
            <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setIsSidebarOpen(false)} />
            <aside className="fixed left-0 top-0 z-50 h-full w-72 bg-white shadow-2xl p-4 animate-slide-in">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#6B9E3A] flex items-center justify-center">
                    <span className="text-white font-bold text-sm">V</span>
                  </div>
                  <span className="font-bold text-gray-800">Dasbor</span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                  ✕
                </button>
              </div>
              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <button
                      key={item.path}
                      onClick={() => { navigate(item.path); setIsSidebarOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                        active
                          ? 'bg-[#E8F5D8] text-[#4A7C2E]'
                          : 'text-gray-600 hover:bg-[#F0F7E8] hover:text-[#4A7C2E]'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${active ? 'text-[#6B9E3A]' : 'text-gray-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </aside>
          </>
        )}
      </div>

      {!isDesktop && <BottomNavigation />}
    </div>
  );
};

export default DasborLayout;