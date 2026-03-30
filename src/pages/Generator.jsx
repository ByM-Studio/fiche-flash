import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import GeneratorForm from '../components/generator/GeneratorForm';
import RevisionCardDisplay from '../components/generator/RevisionCardDisplay';
import FlashCardGame from '../components/flashcards/FlashCardGame';
import UpgradeModal from '../components/UpgradeModal';
import { useProgress } from '@/hooks/useProgress';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { toast } from 'sonner';

const MAX_FREE_GENERATIONS = 3;

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getGenerationsToday() {
  const stored = localStorage.getItem('ficheflash_generations');
  if (!stored) return 0;
  const parsed = JSON.parse(stored);
  if (parsed.date !== getTodayKey()) return 0;
  return parsed.count;
}

function incrementGenerations() {
  const current = getGenerationsToday();
  localStorage.setItem('ficheflash_generations', JSON.stringify({
    date: getTodayKey(),
    count: current + 1,
  }));
}

export default function Generator() {
  const [generatedCard, setGeneratedCard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFlashCards, setShowFlashCards] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState('limit');
  const [generationsToday, setGenerationsToday] = useState(getGenerationsToday());
  const { awardFicheGenerated } = useProgress();

  const remaining = MAX_FREE_GENERATIONS - generationsToday;

  const handleGenerate = async ({ subject, level, text }) => {
    if (remaining <= 0) {
      setUpgradeReason('limit');
      setShowUpgrade(true);
      return;
    }

    setIsLoading(true);
    setGeneratedCard(null);
    setShowFlashCards(false);

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es un assistant pédagogique expert pour les lycéens français préparant le Bac.
      
Matière : ${subject}
Niveau : ${level}

À partir du cours suivant, génère une fiche de révision structurée :

---
${text.slice(0, 15000)}
---

Génère une fiche avec :
1. Un titre de chapitre pertinent (détecté du contenu)
2. Exactement 5 points clés de résumé (concis, percutants)
3. Les définitions importantes (terme + définition, max 8)
4. Les formules, dates ou chiffres clés selon la matière (max 6)
5. 2-3 points à ne pas confondre (pièges classiques du Bac)
6. Un moyen mnémotechnique créatif pour retenir l'essentiel
7. 8-12 flash cards (question/réponse) couvrant tout le contenu

Adapte le langage pour un lycéen. Sois précis et utile.`,
      response_json_schema: {
        type: "object",
        properties: {
          title: { type: "string" },
          summary_points: { type: "array", items: { type: "string" } },
          definitions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                term: { type: "string" },
                definition: { type: "string" }
              }
            }
          },
          key_formulas: { type: "array", items: { type: "string" } },
          traps: { type: "array", items: { type: "string" } },
          mnemonic: { type: "string" },
          flash_cards: {
            type: "array",
            items: {
              type: "object",
              properties: {
                question: { type: "string" },
                answer: { type: "string" }
              }
            }
          }
        }
      },
      model: "claude_sonnet_4_6"
    });

    const cardData = {
      ...result,
      title: result.title || `${subject} — ${level}`,
      subject,
      level,
      source_text_preview: text.slice(0, 200),
    };

    // Save to DB
    await base44.entities.RevisionCard.create(cardData);

    setGeneratedCard(cardData);
    incrementGenerations();
    setGenerationsToday(getGenerationsToday());
    setIsLoading(false);

    await awardFicheGenerated(subject);
    toast.success('🎉 Ta fiche est prête ! Bravo, tu progresses !');
  };

  const handleExportPDF = () => {
    setUpgradeReason('pdf');
    setShowUpgrade(true);
  };

  if (showFlashCards && generatedCard?.flash_cards?.length > 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <FlashCardGame
          flashCards={generatedCard.flash_cards}
          onBack={() => setShowFlashCards(false)}
        />
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
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Générer une fiche</h1>
        </div>
        <p className="text-muted-foreground">
          Colle ton cours, choisis ta matière et laisse l'IA faire le travail ! ⚡
        </p>
      </motion.div>

      {!generatedCard && (
        <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8">
          <GeneratorForm
            onGenerate={handleGenerate}
            isLoading={isLoading}
            remainingGenerations={remaining}
          />
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center py-16 gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <p className="text-lg font-medium text-muted-foreground animate-pulse">
            L'IA analyse ton cours... ✨
          </p>
        </div>
      )}

      {generatedCard && !isLoading && (
        <RevisionCardDisplay
          card={generatedCard}
          onStartFlashCards={() => setShowFlashCards(true)}
          onExportPDF={handleExportPDF}
        />
      )}

      <UpgradeModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        reason={upgradeReason}
      />
    </div>
  );
}