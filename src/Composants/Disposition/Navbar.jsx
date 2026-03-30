import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Zap, BookOpen, History, Library, Menu, X, GraduationCap, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import XPBar from '@/components/progress/XPBar';
import { useProgress } from '@/hooks/useProgress';

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { xp } = useProgress();

  const links = [
    { path: '/', label: 'Accueil', icon: Zap },
    { path: '/generer', label: 'Générer', icon: BookOpen },
    { path: '/examen', label: 'Mode Examen', icon: GraduationCap },
    { path: '/historique', label: 'Historique', icon: History },
    { path: '/fiches-pretes', label: 'Fiches prêtes', icon: Library },
    { path: '/progression', label: 'Progression', icon: Trophy },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">FicheFlash</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {links.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path}>
              <Button
                variant={location.pathname === path ? 'default' : 'ghost'}
                size="sm"
                className="gap-1.5 text-xs"
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Button>
            </Link>
          ))}
        </div>

        {/* XP Bar — desktop */}
        <div className="hidden lg:block flex-shrink-0">
          <XPBar xp={xp} />
        </div>

        {/* Mobile toggle */}
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-b border-border bg-card"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {/* XP bar mobile */}
              <div className="pb-2 mb-1 border-b border-border/50">
                <XPBar xp={xp} />
              </div>
              {links.map(({ path, label, icon: Icon }) => (
                <Link key={path} to={path} onClick={() => setMobileOpen(false)}>
                  <Button
                    variant={location.pathname === path ? 'default' : 'ghost'}
                    className="w-full justify-start gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Button>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}