import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Target, BarChart3, Gift, User } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dasbor', icon: Home, label: 'Beranda' },
    { path: '/tracker', icon: Target, label: 'Tracker' },
    { path: '/insights', icon: BarChart3, label: 'Insights' },
    { path: '/rewards', icon: Gift, label: 'Rewards' },
    { path: '/dasbor-profile', icon: User, label: 'Profil' },
  ];

  const getIsActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] md:hidden">
      <div className="flex justify-around items-center h-[72px] max-w-md mx-auto px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = getIsActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] transition-all duration-200 rounded-xl ${
                isActive ? 'text-[#4A7C2E]' : 'text-gray-400 hover:text-[#6B9E3A]'
              }`}
            >
              <div className={`relative flex flex-col items-center p-1 rounded-2xl transition-all duration-300 ${
                isActive ? 'scale-105' : 'hover:scale-105'
              }`}>
                <Icon
                  className={`h-6 w-6 mb-1 transition-all ${isActive ? 'scale-110 text-[#6B9E3A]' : ''}`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={`text-[10px] font-semibold tracking-wide transition-all ${
                  isActive ? 'text-[#4A7C2E]' : ''
                }`}>
                  {item.label}
                </span>
                {isActive && <span className="absolute -bottom-1 w-6 h-1 rounded-full bg-[#6B9E3A]" />}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;