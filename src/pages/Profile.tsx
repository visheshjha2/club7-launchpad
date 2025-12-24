import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/auth');
  }, [user]);

  if (!user) return null;

  return (
    <>
      <Helmet><title>Profile | Club7overseas</title></Helmet>
      <Layout>
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <h1 className="font-display text-3xl font-bold mb-8">My <span className="text-gradient-gold">Profile</span></h1>
          <div className="p-6 rounded-lg bg-card border border-border max-w-md">
            <p className="text-muted-foreground mb-2">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
        </div>
      </Layout>
    </>
  );
}
