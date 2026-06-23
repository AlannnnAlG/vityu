
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, FileText, ShoppingBag, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils.js';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Produk', path: '/admin/products', icon: Package },
    { name: 'Blog', path: '/admin/blog', icon: FileText },
    { name: 'Pesanan', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Pengguna', path: '/admin/users', icon: Users },
  ];

  return (
    <div className="w-64 bg-card border-r border-border min-h-[calc(100vh-5rem)] flex flex-col hidden md:flex sticky top-20">
      <div className="p-6">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Menu Admin</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
