import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Zap, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-background" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Propulsé par l'IA
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Transforme ton cours en{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              fiches de révision
            </span>{' '}
            en 10 secondes
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Colle ton cours, l'IA génère des fiches structurées et des flash cards 
            pour réviser efficacement. Fini les heures perdues à résumer ! ⚡
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/generer">
              <Button size="lg" className="text-base px-8 py-6 rounded-2xl gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                <Zap className="w-5 h-5" />
                Générer mes fiches gratuitement
              </Button>
            </Link>
            <Link to="/fiches-pretes">
              <Button variant="outline" size="lg" className="text-base px-8 py-6 rounded-2xl">
                Voir les fiches prêtes
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            ✨ 3 générations gratuites par jour — aucune carte bancaire requise
          </p>
        </motion.div>
      </div>
    </section>
  );
}