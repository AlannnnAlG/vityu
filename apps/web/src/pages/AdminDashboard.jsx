
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Package, FileText, ShoppingBag, Users, DollarSign } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar.jsx';
import Header from '@/components/Header.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({ products: 0, blogs: 0, orders: 0, users: 0, revenue: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prodList, blogList, orderList, userList] = await Promise.all([
          pb.collection('products').getList(1, 1, { filter: 'is_deleted = false || is_deleted = null', $autoCancel: false }),
          pb.collection('blog').getList(1, 1, { filter: 'is_deleted = false || is_deleted = null', $autoCancel: false }),
          pb.collection('orders').getFullList({ $autoCancel: false }),
          pb.collection('users').getList(1, 1, { $autoCancel: false })
        ]);
        
        const rev = orderList.reduce((sum, o) => sum + (o.total_harga || 0), 0);
        
        setStats({
          products: prodList.totalItems,
          blogs: blogList.totalItems,
          orders: orderList.length,
          users: userList.totalItems,
          revenue: rev
        });
      } catch (e) {
        console.error("Error fetching stats:", e);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Produk', value: stats.products, icon: Package, color: 'text-primary', bg: 'bg-primary/10', link: '/admin/products' },
    { title: 'Artikel Blog', value: stats.blogs, icon: FileText, color: 'text-secondary', bg: 'bg-secondary/10', link: '/admin/blog' },
    { title: 'Total Pesanan', value: stats.orders, icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-500/10', link: '/admin/orders' },
    { title: 'Pengguna', value: stats.users, icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10', link: '/admin/users' },
  ];

  return (
    <>
      <Helmet><title>Dashboard Admin | Vityuu</title></Helmet>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex flex-grow max-w-7xl mx-auto w-full">
          <AdminSidebar />
          <main className="flex-grow p-6 md:p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground">Halo, {currentUser?.nama_lengkap}!</h1>
              <p className="text-muted-foreground text-sm">Ringkasan aktivitas toko Vityuu hari ini</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat, i) => (
                <Link key={i} to={stat.link} className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform group cursor-pointer">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.bg}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color} group-hover:scale-110 transition-transform`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 bg-emerald-500/10 text-emerald-500">
                <DollarSign className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Revenue Sepanjang Waktu</p>
                <p className="text-4xl font-extrabold text-foreground">Rp {stats.revenue.toLocaleString('id-ID')}</p>
              </div>
            </div>
            
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
