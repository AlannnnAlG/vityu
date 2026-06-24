import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Silakan isi email dan password Anda');
      return;
    }

    try {
      setLoading(true);
      
      // 🔥 LOGIN PAKAI POCKETBASE
      const authData = await pb.collection('users').authWithPassword(email, password);
      
      // 🔥 SIMPAN KE LOCALSTORAGE PAKAI CARA MANUAL
      localStorage.setItem('pb_token', authData.token);
      localStorage.setItem('pb_auth', JSON.stringify({
        record: authData.record,
        token: authData.token
      }));
      
      // 🔥 SET JUGA KE pb.authStore
      pb.authStore.save(authData.token, authData.record);
      
      console.log('✅ Login success:', authData.record.email);
      console.log('✅ Token saved:', !!localStorage.getItem('pb_token'));
      
      toast.success('Login berhasil!');
      
      // 🔥 LANGSUNG REDIRECT KE ORDERS
      window.location.href = '/orders';
      
    } catch (err) {
      console.error('❌ Login error:', err);
      toast.error('Email atau password salah. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Login | Vityuu</title></Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <div className="w-full max-w-md bg-card rounded-3xl p-8 border border-border shadow-lg">
          <div className="text-center mb-8">
            <Link to="/">
              <img src="https://horizons-cdn.hostinger.com/2b565e51-18ea-4df3-a1d9-7a52c6aa74b4/456510c1e5fc5030feef0a6f70003395.png" alt="Vityuu" className="h-10 mx-auto mb-6" />
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Selamat Datang Kembali</h1>
            <p className="text-muted-foreground mt-2">Login untuk melanjutkan ke akun Anda</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com" 
                className="bg-background h-12"
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="bg-background h-12"
                required
              />
            </div>

            <Button type="submit" className="w-full btn-primary h-12 text-base" disabled={loading}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Login'}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground border-t border-border pt-6">
            Belum punya akun? <Link to="/register" className="font-bold text-primary hover:underline">Daftar sekarang</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;