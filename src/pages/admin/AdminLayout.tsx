import { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, Package, ShoppingCart, FolderOpen, Trophy, Settings, MessageSquare, ArrowLeft, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Categories', href: '/admin/categories', icon: FolderOpen },
  { name: 'Achievements', href: '/admin/achievements', icon: Trophy },
  { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/auth');
    }
  }, [user, isAdmin, loading]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background">Loading...</div>;
  if (!isAdmin) return null;

  const NavContent = () => (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          onClick={() => setMobileMenuOpen(false)}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            location.pathname === item.href ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
          }`}
        >
          <item.icon className="h-4 w-4" />
          {item.name}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-card border-r border-border p-4 hidden lg:block">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <ArrowLeft className="h-4 w-4" />
          <span className="font-display text-lg font-bold text-gradient-gold">Club7overseas</span>
        </Link>
        <NavContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-display text-base font-bold text-gradient-gold">Club7overseas</span>
          </Link>
          
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-4">
              <div className="mb-6">
                <span className="font-display text-lg font-bold text-gradient-gold">Admin Panel</span>
              </div>
              <NavContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 overflow-auto pt-20 lg:pt-8">
        <Outlet />
      </main>
    </div>
  );
}
