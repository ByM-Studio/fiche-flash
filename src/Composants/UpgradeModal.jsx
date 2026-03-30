import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Check, Sparkles } from 'lucide-react';

const features = [
  'Générations illimitées',
  'Export PDF de tes fiches',
  'Historique complet',
  'Accès aux fiches prêtes à l\'emploi',
  'Priorité sur la génération IA',
];

export default function UpgradeModal({ open, onClose, reason }) {
  const messages = {
    limit: 'Tu as atteint ta limite de 3 fiches gratuites aujourd\'hui.',
    pdf: 'L\'export PDF est réservé aux membres Premium.',
    history: 'L\'historique complet est réservé aux membres Premium.',
    ready: 'Les fiches prêtes à l\'emploi sont réservées aux membres Premium.',
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl">Passe en Premium ✨</DialogTitle>
          <DialogDescription className="text-base mt-2">
            {messages[reason] || 'Débloque toutes les fonctionnalités de FicheFlash.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 my-4">
          {features.map(f => (
            <div key={f} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-primary" />
              </div>
              <span className="text-sm">{f}</span>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-4 text-center">
          <div className="text-3xl font-extrabold">
            1,99€<span className="text-base font-normal text-muted-foreground">/mois</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Sans engagement, annulable à tout moment</p>
        </div>

        <Button size="lg" className="w-full rounded-2xl gap-2 py-6 mt-2 shadow-lg shadow-primary/20">
          <Sparkles className="w-5 h-5" />
          Devenir Premium
        </Button>
        <Button variant="ghost" className="w-full" onClick={onClose}>
          Non merci, je reste en gratuit
        </Button>
      </DialogContent>
    </Dialog>
  );
}