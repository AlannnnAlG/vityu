
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Silakan isi email dan password Anda');
      return;
    }

    try {
      setLoading(true);
      const authData = await login(email, password);
      toast.success('Login berhasil!');
      
      if (authData.record.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        const origin = location.state?.from?.pathname || '/profile';
        navigate(origin);
      }
    } catch (err) {
      console.error(err);
      toast.error('Email atau password salah. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | Vityuu</title>
      </Helmet>
      
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
                <a href="#" className="text-sm font-medium text-primary hover:underline">Lupa password?</a>
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

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label htmlFor="remember" className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Ingat saya
              </label>
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
