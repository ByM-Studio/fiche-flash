import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { History as HistoryIcon, BookOpen, Clock, ChevronRight, Inbox } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import RevisionCardDisplay from '../components/generator/RevisionCardDisplay';
import FlashCardGame from '../components/flashcards/FlashCardGame';
import UpgradeModal from '../components/UpgradeModal';

export default function History() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [showFlashCards, setShowFlashCards] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const { data: cards, isLoading } = useQuery({
    queryKey: ['revision-cards'],
    queryFn: () => base44.entities.RevisionCard.list('-created_date', 50),
    initialData: [],
  });

  if (showFlashCards && selectedCard?.flash_cards?.length > 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <FlashCardGame
          flashCards={selectedCard.flash_cards}
          onBack={() => setShowFlashCards(false)}
        />
      </div>
    );
  }

  if (selectedCard) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <Button variant="ghost" className="mb-4 gap-2" onClick={() => setSelectedCard(null)}>
          <ChevronRight className="w-4 h-4 rotate-180" />
          Retour à l'historique
        </Button>
        <RevisionCardDisplay
          card={selectedCard}
          onStartFlashCards={() => setShowFlashCards(true)}
          onExportPDF={() => setShowUpgrade(true)}
        />
        <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} reason="pdf" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <HistoryIcon className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Ton historique</h1>
        </div>
        <p className="text-muted-foreground">
          Retrouve toutes les fiches que tu as générées 📚
        </p>
      </motion.div>

      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="h-24 bg-muted rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : cards.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Aucune fiche pour le moment</h3>
          <p className="text-muted-foreground mb-6">Génère ta première fiche pour la retrouver ici !</p>
          <Link to="/generer">
            <Button className="rounded-xl gap-2">
              <BookOpen className="w-4 h-4" />
              Générer ma première fiche
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <button
                onClick={() => setSelectedCard(card)}
                className="w-full text-left bg-card rounded-2xl border border-border/50 p-5 hover:shadow-lg hover:shadow-primary/5 transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{card.title || 'Fiche sans titre'}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary" className="rounded-lg text-xs">{card.subject}</Badge>
                      <Badge variant="outline" className="rounded-lg text-xs">{card.level}</Badge>
                    </div>
                    {card.created_date && (
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {format(new Date(card.created_date), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}