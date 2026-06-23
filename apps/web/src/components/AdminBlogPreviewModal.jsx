
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import pb from '@/lib/pocketbaseClient.js';
import { Calendar, User } from 'lucide-react';

const AdminBlogPreviewModal = ({ isOpen, onClose, article }) => {
  const [authorName, setAuthorName] = useState('Admin');

  useEffect(() => {
    if (article?.author_id) {
      pb.collection('users').getOne(article.author_id, { $autoCancel: false })
        .then(user => setAuthorName(user.nama_lengkap || 'Admin'))
        .catch(() => setAuthorName('Admin'));
    }
  }, [article]);

  if (!article) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-0 sticky top-0 bg-background z-10 border-b border-border flex flex-row justify-between items-center">
          <DialogTitle>Preview Artikel</DialogTitle>
        </DialogHeader>
        <div className="p-6 md:p-10 bg-background">
          <article className="max-w-3xl mx-auto prose prose-slate dark:prose-invert lg:prose-lg">
            <h1 className="text-3xl md:text-5xl font-extrabold text-foreground leading-tight mb-6" style={{letterSpacing: '-0.02em'}}>
              {article.judul || 'Judul Artikel'}
            </h1>
            
            <div className="flex items-center gap-6 text-muted-foreground text-sm font-medium mb-8 pb-8 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <span>{authorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{article.created ? new Date(article.created).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Belum dipublish'}</span>
              </div>
            </div>

            {article.featured_image && typeof article.featured_image === 'string' && (
              <div className="w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden mb-10 bg-muted">
                <img 
                  src={pb.files.getURL(article, article.featured_image)} 
                  alt={article.judul} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {article.featured_image && typeof article.featured_image !== 'string' && (
              <div className="w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden mb-10 bg-muted">
                <img 
                  src={URL.createObjectURL(article.featured_image)} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {article.excerpt && (
              <p className="text-xl text-muted-foreground font-medium italic mb-8 border-l-4 border-primary pl-4">
                {article.excerpt}
              </p>
            )}

            <div 
              className="text-foreground leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: article.konten || '<p>Konten artikel akan tampil di sini...</p>' }}
            />
          </article>
        </div>
        <div className="p-4 border-t border-border sticky bottom-0 bg-background flex justify-end">
          <Button variant="outline" onClick={onClose}>Tutup Preview</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminBlogPreviewModal;
