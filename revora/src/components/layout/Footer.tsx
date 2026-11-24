import React from 'react';
import { Logo } from '@/components/common/Logo';
import {
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from 'lucide-react';

interface FooterProps {
  onOpenAuth: (mode?: 'login' | 'register', role?: 'buyer' | 'seller' | 'dealer', title?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAuth }) => {
  return (
    <footer id="about-us" className="bg-revora-dark text-white border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Col 1 & 2: Brand Information */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" size="lg" showTagline={true} />
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed mt-4">
              REVORA is India’s next-generation multi-vendor automotive ecosystem, connecting discerning car buyers with verified individual sellers and certified dealerships nationwide.
            </p>

            <div className="space-y-2 text-xs text-gray-400 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-revora-sky shrink-0" />
                <span>Avinashi Road, Coimbatore, Tamil Nadu, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-revora-sky shrink-0" />
                <span>enquiries@revora.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-revora-sky shrink-0" />
                <span>+91 1800 209 8899 (Toll Free)</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-3">
              <a
                href="#social"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#social"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#social"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#social"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: REVORA */}
          <div>
            <h4 className="font-heading text-xs font-bold text-white uppercase tracking-widest mb-4">
              REVORA
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <a href="#about-us" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#about-us" className="hover:text-white transition-colors">
                  Our Story & Mission
                </a>
              </li>
              <li>
                <a href="#about-us" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#careers"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenAuth('register', 'buyer', 'Careers Portal');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Careers at REVORA
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: EXPLORE */}
          <div>
            <h4 className="font-heading text-xs font-bold text-white uppercase tracking-widest mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <a href="#explore-cars" className="hover:text-white transition-colors">
                  Buy Used Cars
                </a>
              </li>
              <li>
                <a href="#sell-car" className="hover:text-white transition-colors">
                  Sell Your Car
                </a>
              </li>
              <li>
                <a href="#dealerships" className="hover:text-white transition-colors">
                  Verified Dealerships
                </a>
              </li>
              <li>
                <a
                  href="#valuation"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenAuth('login', 'seller', 'Free Car Valuation Tool');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Free Car Valuation
                </a>
              </li>
              <li>
                <a
                  href="#dealerships"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenAuth('register', 'dealer', 'Register Dealership');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Dealer Partner Portal
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: SUPPORT & LEGAL */}
          <div>
            <h4 className="font-heading text-xs font-bold text-white uppercase tracking-widest mb-4">
              Support & Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <a
                  href="#help"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('REVORA Help Centre: 24/7 support line 1800-209-8899.');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Help Centre
                </a>
              </li>
              <li>
                <a
                  href="#faqs"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('how-it-works');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="#privacy"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('REVORA Privacy Policy: All personal data is encrypted and strictly protected under DPDP Act.');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('REVORA Terms of Service: Compliant with Indian Consumer Protection Rules.');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Terms and Conditions
                </a>
              </li>
              <li>
                <a
                  href="#cookies"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('REVORA Cookie Policy: Essential functional cookies only.');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} REVORA Technologies India Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-gray-400">
              <ShieldCheck className="w-4 h-4 text-revora-success" />
              Verified Automotive Platform
            </span>
            <span>Designed for India’s Discerning Drivers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
