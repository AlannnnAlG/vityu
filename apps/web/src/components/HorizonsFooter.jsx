import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t bg-muted/50 mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://horizons-cdn.hostinger.com/f4f43ded-dd69-4e09-8ef1-f3407f7ad1fe/0d786ee726b116962014fc6f016b45d1.png"
                alt="Vityu"
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold">Vityu</span>
            </div>
            <p className="text-sm leading-relaxed max-w-prose">
              Your companion for managing sugar cravings and building healthier habits through AI-powered insights and community support.
            </p>
          </div>

          <div>
            <span className="font-semibold mb-4 block">Quick links</span>
            <div className="flex flex-col gap-2">
              <Link to="/tracker" className="text-sm hover:text-primary transition-colors">
                Craving tracker
              </Link>
              <Link to="/insights" className="text-sm hover:text-primary transition-colors">
                AI insights
              </Link>
              <Link to="/education" className="text-sm hover:text-primary transition-colors">
                Education
              </Link>
              <Link to="/rewards" className="text-sm hover:text-primary transition-colors">
                Rewards
              </Link>
            </div>
          </div>

          <div>
            <span className="font-semibold mb-4 block">Connect with us</span>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-lg bg-background flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-lg bg-background flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-lg bg-background flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            © 2026 Vityu. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;