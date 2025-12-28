import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import AchievementsSection from '@/components/home/AchievementsSection';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import club7Logo from '@/assets/club7-logo.png';

export default function Index() {
  return (
    <>
      <Helmet>
        <title>Club7overseas | Premium Footwear Collection</title>
        <meta name="description" content="Discover premium footwear crafted for excellence. Shop the finest collection of luxury shoes at Club7overseas. Pan-India delivery available." />
        <meta name="keywords" content="premium footwear, luxury shoes, Club7overseas, Indian footwear, leather shoes, sneakers" />
        <link rel="canonical" href="https://club7overseas.com" />
      </Helmet>

      <Layout>
        {/* Hero */}
        <HeroSection />

        {/* Featured Products */}
        <FeaturedProducts />

        {/* Why Choose Us */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-display text-3xl lg:text-4xl font-bold mb-6">
                  Why Choose <span className="text-gradient-gold">Club7overseas</span>?
                </h2>
                <p className="text-muted-foreground mb-8">
                  We're not just selling shoes – we're delivering an experience. 
                  Every pair is crafted with precision and passion.
                </p>
                
                <div className="space-y-4">
                  {[
                    'Premium quality materials sourced globally',
                    'Handcrafted with attention to detail',
                    'Comfort-first design philosophy',
                    'Pan-India fast shipping',
                    'Easy returns and exchanges',
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <Link to="/about">
                    <Button variant="gold-outline">
                      Learn More About Us
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden border border-border">
                  <img 
                    src={club7Logo} 
                    alt="Club7overseas - 10+ Years of Excellence" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Stats Cards */}
                <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 p-3 sm:p-4 rounded-lg bg-card border border-border shadow-card">
                  <div className="text-xl sm:text-2xl font-bold text-primary">10K+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Happy Customers</div>
                </div>
                
                <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 p-3 sm:p-4 rounded-lg bg-card border border-border shadow-card">
                  <div className="text-xl sm:text-2xl font-bold text-primary">500+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Product Designs</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements */}
        <AchievementsSection />

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-r from-charcoal to-charcoal-light relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/50 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
            <h2 className="font-display text-3xl lg:text-4xl font-bold mb-6">
              Ready to <span className="text-gradient-gold">Elevate</span> Your Style?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Explore our complete collection and find your perfect pair. 
              Free shipping on orders above ₹2,999.
            </p>
            <Link to="/shop">
              <Button variant="gold" size="xl">
                Shop Now
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </Layout>
    </>
  );
}
