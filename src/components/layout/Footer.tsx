import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { ROUTES, SHOP_CATEGORIES } from '@/constants/routes';
import gamLogo from '@/assets/gamlogo.png';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <Link to={ROUTES.HOME} className="flex items-center gap-2">
              <img src={gamLogo} alt="GAM Shop" className="h-12 w-auto" />
              <span className="font-bold text-xl">GAM Shop</span>
            </Link>
            <p className="text-sm text-primary-foreground/80">
              Your one-stop shop for spiritual resources, apparel, and accessories from the ministry.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-secondary transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-secondary transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-secondary transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-secondary transition-colors" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Shop</h3>
            <ul className="space-y-2 text-sm">
              {SHOP_CATEGORIES.map((category) => (
                <li key={category.href}>
                  <Link 
                    to={category.href} 
                    className="text-primary-foreground/80 hover:text-secondary transition-colors"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Grace Arena Ministries</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-secondary" />
                <span className="text-primary-foreground/80">
                  Bungoma Road, off Baricho Road, Nairobi, Kenya
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-secondary" />
                <a 
                  href="tel:+254759212574" 
                  className="text-primary-foreground/80 hover:text-secondary transition-colors"
                >
                  0759 212574
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-secondary" />
                <a 
                  href="mailto:gracearenakenya@gmail.com" 
                  className="text-primary-foreground/80 hover:text-secondary transition-colors"
                >
                  gracearenakenya@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Globe className="h-5 w-5 shrink-0 text-secondary" />
                <a 
                  href="https://gracearenaministries.org" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors"
                >
                  gracearenaministries.org
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-sm md:flex-row">
            <p className="text-primary-foreground/80">
              © {currentYear} Grace Arena Ministries. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link 
                to={ROUTES.PRIVACY} 
                className="text-primary-foreground/80 hover:text-secondary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                to={ROUTES.TERMS} 
                className="text-primary-foreground/80 hover:text-secondary transition-colors"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
