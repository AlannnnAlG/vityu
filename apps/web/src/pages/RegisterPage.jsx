
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    email: '',
    password: '',
    passwordConfirm: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateStrength = (pass) => {
    if (pass.length === 0) return 0;
    let strength = 0;
    if (pass.length >= 8) strength += 25;
    if (pass.match(/[A-Z]/)) strength += 25;
    if (pass.match(/[0-9]/)) strength += 25;
    if (pass.match(/[^A-Za-z0-9]/)) strength += 25;
    return strength;
  };

  const strength = calculateStrength(formData.password);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      toast.error('Anda harus menyetujui Syarat dan Ketentuan');
      return;
    }
    if (formData.password !== formData.passwordConfirm) {
      toast.error('Konfirmasi password tidak cocok');
      return;
    }
    if (formData.password.length < 8) {
      toast.error('Password minimal 8 karakter');
      return;
    }

    try {
      setLoading(true);
      await register(formData);
      toast.success('Pendaftaran berhasil! Silakan login.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Pendaftaran gagal. Email mungkin sudah terdaftar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Daftar | Vityuu</title>
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 py-12">
        <div className="w-full max-w-lg bg-card rounded-3xl p-8 border border-border shadow-lg">
          <div className="text-center mb-8">
            <Link to="/">
              <img src="https://horizons-cdn.hostinger.com/2b565e51-18ea-4df3-a1d9-7a52c6aa74b4/456510c1e5fc5030feef0a6f70003395.png" alt="Vityuu" className="h-10 mx-auto mb-6" />
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Daftar Akun Baru</h1>
            <p className="text-muted-foreground mt-2">Mulai gaya hidup sehat Anda bersama Vityuu</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
              <Input 
                id="nama_lengkap" name="nama_lengkap" 
                value={formData.nama_lengkap} onChange={handleChange}
                placeholder="John Doe" className="bg-background h-12" required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" name="email" type="email"
                value={formData.email} onChange={handleChange}
                placeholder="nama@email.com" className="bg-background h-12" required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" name="password" type="password"
                value={formData.password} onChange={handleChange}
                placeholder="Minimal 8 karakter" className="bg-background h-12" required
              />
              {formData.password && (
                <div className="pt-2">
                  <div className="flex gap-1 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className={`h-full transition-all ${strength >= 25 ? 'bg-destructive w-1/4' : 'w-0'}`} />
                    <div className={`h-full transition-all ${strength >= 50 ? 'bg-yellow-500 w-1/4' : 'w-0'}`} />
                    <div className={`h-full transition-all ${strength >= 75 ? 'bg-primary/80 w-1/4' : 'w-0'}`} />
                    <div className={`h-full transition-all ${strength === 100 ? 'bg-primary w-1/4' : 'w-0'}`} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Gunakan kombinasi huruf besar, angka, dan simbol.</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="passwordConfirm">Konfirmasi Password</Label>
              <Input 
                id="passwordConfirm" name="passwordConfirm" type="password"
                value={formData.passwordConfirm} onChange={handleChange}
                placeholder="Ulangi password" className="bg-background h-12" required
              />
              {formData.passwordConfirm && formData.password === formData.passwordConfirm && (
                <p className="text-xs text-primary flex items-center gap-1 mt-1"><CheckCircle2 className="w-3 h-3" /> Password cocok</p>
              )}
            </div>

            <div className="flex items-start space-x-3 pt-2">
              <Checkbox 
                id="terms" 
                checked={termsAccepted} 
                onCheckedChange={setTermsAccepted} 
                className="mt-1"
              />
              <label htmlFor="terms" className="text-sm font-medium leading-relaxed text-muted-foreground">
                Saya menyetujui <a href="#" className="text-primary hover:underline">Syarat dan Ketentuan</a> serta <a href="#" className="text-primary hover:underline">Kebijakan Privasi</a> yang berlaku.
              </label>
            </div>

            <Button type="submit" className="w-full btn-primary h-12 text-base mt-4" disabled={loading}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Daftar Sekarang'}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground border-t border-border pt-6">
            Sudah punya akun? <Link to="/login" className="font-bold text-primary hover:underline">Login di sini</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
