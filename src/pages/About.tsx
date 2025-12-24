import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import AchievementsSection from '@/components/home/AchievementsSection';
import { CheckCircle2 } from 'lucide-react';

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us | Club7overseas</title>
        <meta name="description" content="Learn about Club7overseas - Premium footwear crafted with excellence since our founding." />
      </Helmet>

      <Layout>
        <section className="py-16 lg:py-24 bg-card">
          <div className="container mx-auto px-4 lg:px-8">
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-center mb-6">
              About <span className="text-gradient-gold">Club7overseas</span>
            </h1>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto text-lg">
              Premium footwear crafted for the discerning individual
            </p>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-display text-2xl lg:text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Club7overseas was founded with a singular vision: to bring world-class footwear to 
                discerning customers who appreciate quality, comfort, and style. Based in Agra, India, 
                we combine traditional craftsmanship with modern design sensibilities.
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Every pair of shoes we create goes through rigorous quality checks to ensure they meet 
                our exacting standards. We source premium materials globally and work with skilled 
                artisans to craft footwear that stands the test of time.
              </p>
              
              <div className="space-y-4">
                {['Premium materials sourced globally', 'Handcrafted excellence', 'Comfort-first design', 'Pan-India shipping'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <AchievementsSection />
      </Layout>
    </>
  );
}
