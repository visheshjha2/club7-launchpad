import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-bold text-gradient-gold">
              Club7overseas
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Premium footwear for the discerning individual. Step into excellence with our curated collection of luxury shoes.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold text-foreground">
              Quick Links
            </h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Shop All
              </Link>
              <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                About Us
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Contact
              </Link>
            </nav>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold text-foreground">
              Customer Service
            </h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/orders" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Track Order
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Returns & Exchange
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Shipping Info
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold text-foreground">
              Contact Us
            </h4>
            <div className="space-y-3">
              <a 
                href="mailto:abuzargw@gmail.com" 
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                <Mail className="h-4 w-4" />
                <span>abuzargw@gmail.com</span>
              </a>
              <a 
                href="tel:+919027776771" 
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                <Phone className="h-4 w-4" />
                <span>+91 9027776771</span>
              </a>
              <div className="flex items-start space-x-2 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>19/186-A/1 Saket Colony, Shahganj, Agra, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Club7overseas. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-muted-foreground text-sm">We accept:</span>
              <div className="flex items-center space-x-2 text-muted-foreground text-xs">
                <span className="px-2 py-1 bg-secondary rounded">UPI</span>
                <span className="px-2 py-1 bg-secondary rounded">Net Banking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
