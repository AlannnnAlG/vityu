
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut, Settings, LayoutDashboard, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { getCart } from '@/lib/cartUtils.js';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    const updateCartCount = () => {
      const cart = getCart();
      const count = cart.reduce((total, item) => total + item.quantity, 0);
      setCartCount(count);
    };
    
    updateCartCount();
    window.addEventListener('vityuu_cart_updated', updateCartCount);
    return () => window.removeEventListener('vityuu_cart_updated', updateCartCount);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="https://horizons-cdn.hostinger.com/2b565e51-18ea-4df3-a1d9-7a52c6aa74b4/456510c1e5fc5030feef0a6f70003395.png" 
              alt="Vityuu Logo" 
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? 'text-primary font-bold relative after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-primary after:rounded-full'
                    : 'text-foreground hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-foreground hover:text-primary transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-secondary rounded-full transform translate-x-1 -translate-y-1">
                  {cartCount}
                </span>
              )}
            </Link>

            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative flex items-center gap-2 px-3 py-2 border border-border hover:bg-muted rounded-full">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                      {currentUser.nama_lengkap?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium max-w-[100px] truncate">{currentUser.nama_lengkap}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm">{currentUser.nama_lengkap}</p>
                      <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer flex items-center">
                      <User className="w-4 h-4 mr-2" /> Lihat Profil
                    </Link>
                  </DropdownMenuItem>
                  {currentUser.role === 'user' && (
                    <DropdownMenuItem asChild>
                      <Link to="/orders" className="cursor-pointer flex items-center">
                        <Package className="w-4 h-4 mr-2" /> Pesanan Saya
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {currentUser.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin/dashboard" className="cursor-pointer flex items-center font-medium text-primary">
                        <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="font-semibold text-foreground hover:text-primary">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="btn-primary shadow-sm hover:shadow-md">
                    Daftar
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <Link to="/cart" className="relative p-2 text-foreground">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-secondary rounded-full transform translate-x-1 -translate-y-1">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-muted text-foreground transition-all duration-200"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background absolute w-full shadow-xl">
          <nav className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="pt-4 mt-4 border-t border-border">
              {currentUser ? (
                <>
                  <div className="px-4 py-2 mb-2">
                    <p className="font-bold text-foreground">{currentUser.nama_lengkap}</p>
                    <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                  </div>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-muted text-foreground font-medium flex items-center">
                    <User className="w-5 h-5 mr-3" /> Profil
                  </Link>
                  {currentUser.role === 'admin' ? (
                    <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-muted text-primary font-bold flex items-center">
                      <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard Admin
                    </Link>
                  ) : (
                    <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-muted text-foreground font-medium flex items-center">
                      <Package className="w-5 h-5 mr-3" /> Pesanan Saya
                    </Link>
                  )}
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-destructive/10 text-destructive font-medium flex items-center mt-2">
                    <LogOut className="w-5 h-5 mr-3" /> Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 px-4">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center h-12 text-base">Login</Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full btn-primary justify-center h-12 text-base">Daftar</Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
