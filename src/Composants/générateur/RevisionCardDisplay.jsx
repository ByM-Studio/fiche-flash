import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Key, Calculator, AlertTriangle, Lightbulb, ArrowRight, FileText, Pin, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RevisionCardDisplay({ card, onStartFlashCards, onExportPDF }) {
  if (!card) return null;

  const sections = [
    {
      icon: Pin,
      title: 'Résumé en 5 points clés',
      content: card.summary_points,
      type: 'list',
    },
    {
      icon: Key,
      title: 'Définitions importantes',
      content: card.definitions,
      type: 'definitions',
    },
    {
      icon: Calculator,
      title: 'Formules / Dates / Chiffres clés',
      content: card.key_formulas,
      type: 'list',
    },
    {
      icon: AlertTriangle,
      title: 'Points à ne pas confondre',
      content: card.traps,
      type: 'list',
    },
    {
      icon: Lightbulb,
      title: 'Moyen mnémotechnique',
      content: card.mnemonic,
      type: 'text',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 p-6 md:p-8">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary" className="rounded-lg">{card.subject}</Badge>
          <Badge variant="outline" className="rounded-lg">{card.level}</Badge>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold">📌 {card.title}</h2>
        <p className="text-muted-foreground mt-2">
          🎉 Ta fiche est prête ! Révise les points clés ci-dessous.
        </p>
      </div>

      {/* Sections */}
      {sections.map((section, i) => {
        const hasContent = section.type === 'list' 
          ? section.content?.length > 0 
          : section.type === 'definitions'
            ? section.content?.length > 0
            : !!section.content;

        if (!hasContent) return null;

        return (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-2xl border border-border/50 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <section.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold">{section.title}</h3>
            </div>

            {section.type === 'list' && (
              <ul className="space-y-2">
                {section.content.map((item, j) => (
                  <li key={j} className="flex gap-3 text-foreground">
                    <span className="text-primary font-bold mt-0.5">•</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {section.type === 'definitions' && (
              <div className="grid gap-3">
                {section.content.map((def, j) => (
                  <div key={j} className="bg-muted/50 rounded-xl p-4">
                    <span className="font-semibold text-primary">{def.term}</span>
                    <span className="text-muted-foreground"> — </span>
                    <span className="text-foreground">{def.definition}</span>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'text' && (
              <p className="text-foreground bg-accent/50 rounded-xl p-4 leading-relaxed">
                💡 {section.content}
              </p>
            )}
          </motion.div>
        );
      })}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={onStartFlashCards}
          size="lg"
          className="rounded-2xl gap-2 flex-1 py-6 shadow-lg shadow-primary/20"
        >
          🃏 Flash Cards
          <ArrowRight className="w-5 h-5" />
        </Button>
        <Link to="/examen" className="flex-1">
          <Button
            variant="outline"
            size="lg"
            className="rounded-2xl gap-2 w-full py-6 border-primary/30 text-primary hover:bg-primary/5"
          >
            <GraduationCap className="w-5 h-5" />
            Mode Examen
          </Button>
        </Link>
        <Button
          onClick={onExportPDF}
          variant="outline"
          size="lg"
          className="rounded-2xl gap-2 flex-1 py-6"
        >
          <FileText className="w-5 h-5" />
          PDF
        </Button>
      </div>
    </motion.div>
  );
}