import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Achievement } from '@/types';
import { Trophy } from 'lucide-react';
import achievementImage from '@/assets/achievement-trophy.jpg';

export default function AchievementsSection() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (!error && data) {
      setAchievements(data);
    }
    setLoading(false);
  };

  return (
    <section className="py-16 lg:py-24 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-6">
            <Trophy className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm font-medium text-primary">Our Achievements</span>
          </div>
          <h2 className="font-display text-3xl lg:text-4xl font-bold">
            A Legacy of <span className="text-gradient-gold">Excellence</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Our commitment to quality and craftsmanship has earned us recognition across the industry.
          </p>
        </div>

        {/* Featured Achievement Image */}
        <div className="relative max-w-xl mx-auto mb-16">
          <div className="aspect-square rounded-2xl overflow-hidden border border-border shadow-card">
            <img
              src={achievementImage}
              alt="Club7overseas Achievement"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold shadow-gold">
            Excellence in Footwear
          </div>
        </div>

        {/* Achievements Grid */}
        {achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <div
                key={achievement.id}
                className="p-6 rounded-lg bg-background border border-border hover:border-primary/50 transition-all duration-300 hover-lift animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {achievement.image_url && (
                  <img
                    src={achievement.image_url}
                    alt={achievement.title}
                    className="w-16 h-16 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {achievement.title}
                </h3>
                {achievement.year && (
                  <span className="text-primary text-sm font-medium">{achievement.year}</span>
                )}
                {achievement.description && (
                  <p className="text-muted-foreground text-sm mt-2">
                    {achievement.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : !loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Quality Excellence Award', year: '2023', desc: 'Recognized for premium craftsmanship' },
              { title: 'Customer Satisfaction', year: '2022', desc: '10,000+ happy customers served' },
              { title: 'Industry Innovation', year: '2021', desc: 'Pioneering sustainable footwear' },
            ].map((item, index) => (
              <div
                key={index}
                className="p-6 rounded-lg bg-background border border-border hover:border-primary/50 transition-all duration-300 hover-lift"
              >
                <Trophy className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <span className="text-primary text-sm font-medium">{item.year}</span>
                <p className="text-muted-foreground text-sm mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
