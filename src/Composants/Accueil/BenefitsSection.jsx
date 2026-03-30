import React from 'react';
import { Zap, Brain, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const benefits = [
  {
    icon: Zap,
    title: 'Ultra rapide',
    description: 'Colle ton cours et obtiens une fiche structurée en moins de 10 secondes. Plus besoin de passer des heures à résumer.',
    gradient: 'from-primary/20 to-primary/5',
  },
  {
    icon: Brain,
    title: 'Personnalisé',
    description: "L'IA adapte le contenu à ta matière et ton niveau. Maths, philo, histoire... chaque fiche est sur-mesure.",
    gradient: 'from-secondary/20 to-secondary/5',
  },
  {
    icon: Target,
    title: 'Mémorisable',
    description: 'Les flash cards et moyens mnémotechniques te font retenir durablement. Tu apprends vraiment, pas juste lire.',
    gradient: 'from-primary/15 to-secondary/10',
  },
];

export default function BenefitsSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold">
            Pourquoi FicheFlash ?
          </h2>
          <p className="mt-3 text-muted-foreground text-lg">
            L'outil que tu aurais aimé avoir depuis la Seconde 🎓
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group"
            >
              <div className="h-full bg-card rounded-2xl border border-border/50 p-8 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-5`}>
                  <benefit.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}