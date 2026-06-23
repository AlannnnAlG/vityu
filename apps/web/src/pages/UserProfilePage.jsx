
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { User, MapPin, Phone, Mail, Edit3, Lock, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import EditProfileForm from '@/components/EditProfileForm.jsx';
import ChangePasswordForm from '@/components/ChangePasswordForm.jsx';
import pb from '@/lib/pocketbaseClient.js';

const UserProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const [user, setUser] = useState(currentUser);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      <Helmet>
        <title>Profil Saya | Vityuu</title>
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-grow py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-8">
              
              <div className="w-full md:w-1/3">
                <div className="bg-card border border-border rounded-3xl p-6 text-center shadow-sm">
                  <div className="w-24 h-24 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
                    {user.nama_lengkap?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-1">{user.nama_lengkap}</h2>
                  <p className="text-sm text-muted-foreground mb-6">{user.email}</p>
                  
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" onClick={() => setIsEditOpen(true)}>
                      <Edit3 className="w-4 h-4 mr-2" /> Edit Profil
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setIsPasswordOpen(true)}>
                      <Lock className="w-4 h-4 mr-2" /> Ubah Password
                    </Button>
                    <div className="pt-4 mt-4 border-t border-border">
                      <Button variant="ghost" className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={logout}>
                        <LogOut className="w-4 h-4 mr-2" /> Logout
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-2/3">
                <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                  <h3 className="text-xl font-bold text-foreground mb-6 pb-4 border-b border-border">Informasi Personal</h3>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Nama Lengkap</p>
                        <p className="font-medium text-foreground">{user.nama_lengkap || '-'}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium text-foreground">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Nomor Telepon</p>
                        <p className="font-medium text-foreground">{user.nomor_telepon || '-'}</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Alamat Lengkap</p>
                        <p className="font-medium text-foreground leading-relaxed">
                          {user.alamat ? (
                            <>
                              {user.alamat}<br/>
                              {user.kota && `${user.kota}, `}{user.provinsi} {user.kode_pos}
                            </>
                          ) : '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </main>
        
        <Footer />
      </div>

      <EditProfileForm isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} user={user} onUpdate={(updated) => {
        setUser(updated);
        // Sync local auth store if needed, pb handles it automatically on update usually, 
        // but explicit update ensures immediate refresh if using local state wrapper
      }} />
      
      <ChangePasswordForm isOpen={isPasswordOpen} onClose={() => setIsPasswordOpen(false)} user={user} />
    </>
  );
};

export default UserProfilePage;
