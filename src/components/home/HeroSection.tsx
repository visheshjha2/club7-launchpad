import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Award, Truck, Shield } from 'lucide-react';
import heroImage from '@/assets/hero-placeholder.jpg';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Premium Footwear Collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-2xl space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm animate-fade-in">
            <Award className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm font-medium text-primary">Award-Winning Collection</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Step Into
            <span className="text-gradient-gold block">Excellence</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Discover premium footwear crafted for the discerning individual. 
            Where luxury meets comfort in every step.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/shop">
              <Button variant="gold" size="xl">
                Shop Collection
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="gold-outline" size="xl">
                Our Story
              </Button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-6 pt-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Truck className="h-5 w-5 text-primary" />
              <span className="text-sm">Pan-India Shipping</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm">Secure Payments</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Award className="h-5 w-5 text-primary" />
              <span className="text-sm">Premium Quality</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
