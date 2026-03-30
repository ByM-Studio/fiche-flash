import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Check, RotateCcw, ArrowLeft, Trophy, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '@/hooks/useProgress';

function FlipCard({ question, answer, isFlipped, onFlip }) {
  return (
    <div 
      className="w-full max-w-lg mx-auto cursor-pointer" 
      style={{ perspective: '1000px' }}
      onClick={onFlip}
    >
      <motion.div
        className="relative w-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 25 }}
      >
        {/* Front */}
        <div
          className="w-full min-h-[280px] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border-2 border-primary/20 p-8 flex flex-col items-center justify-center text-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Question</span>
          <p className="text-xl md:text-2xl font-bold leading-relaxed">{question}</p>
          <span className="text-xs text-muted-foreground mt-6">Touche pour voir la réponse</span>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 w-full min-h-[280px] bg-gradient-to-br from-secondary/10 to-primary/10 rounded-2xl border-2 border-secondary/20 p-8 flex flex-col items-center justify-center text-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Réponse</span>
          <p className="text-lg md:text-xl leading-relaxed">{answer}</p>
        </div>
      </motion.div>
    </div>
  );
}

function ScoreScreen({ known, toReview, total, onRestart, onBack }) {
  const percentage = Math.round((known / total) * 100);
  const getMessage = () => {
    if (percentage === 100) return { text: "Parfait ! Tu maîtrises tout ! 🏆", emoji: "🔥" };
    if (percentage >= 75) return { text: "Excellent ! Tu es presque au top !", emoji: "💪" };
    if (percentage >= 50) return { text: "Bien joué ! Continue comme ça !", emoji: "👍" };
    return { text: "Pas grave, la répétition est la clé ! Recommence 💪", emoji: "📚" };
  };
  const msg = getMessage();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center max-w-md mx-auto py-8"
    >
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
        <Trophy className="w-10 h-10 text-primary" />
      </div>
      <h2 className="text-3xl font-bold mb-2">Quiz terminé !</h2>
      <p className="text-lg text-muted-foreground mb-8">{msg.text}</p>

      <div className="bg-card rounded-2xl border border-border/50 p-6 mb-8">
        <div className="text-5xl font-extrabold text-primary mb-2">{percentage}%</div>
        <p className="text-muted-foreground">de bonnes réponses</p>
        <div className="flex justify-center gap-8 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{known}</div>
            <div className="text-xs text-muted-foreground">Maîtrisées ✅</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">{toReview}</div>
            <div className="text-xs text-muted-foreground">À revoir 🔄</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {toReview > 0 && (
          <Button onClick={onRestart} size="lg" className="rounded-2xl gap-2">
            <RotateCcw className="w-5 h-5" />
            Réviser les cartes à revoir
          </Button>
        )}
        <Button onClick={onBack} variant="outline" size="lg" className="rounded-2xl gap-2">
          <ArrowLeft className="w-5 h-5" />
          Retour à la fiche
        </Button>
      </div>
    </motion.div>
  );
}

export default function FlashCardGame({ flashCards, onBack }) {
  const [cards, setCards] = useState(flashCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [known, setKnown] = useState([]);
  const [toReview, setToReview] = useState([]);
  const [finished, setFinished] = useState(false);
  const { awardFlashcardKnown, awardFlashcardSession } = useProgress();

  const currentCard = cards[currentIndex];
  const progress = ((known.length + toReview.length) / cards.length) * 100;

  const handleAnswer = (isKnown) => {
    if (isKnown) {
      setKnown([...known, currentCard]);
      awardFlashcardKnown();
    } else {
      setToReview([...toReview, currentCard]);
    }
    setIsFlipped(false);

    if (currentIndex + 1 >= cards.length) {
      awardFlashcardSession();
      setTimeout(() => setFinished(true), 300);
    } else {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 300);
    }
  };

  const handleRestart = () => {
    setCards(toReview);
    setCurrentIndex(0);
    setKnown([]);
    setToReview([]);
    setFinished(false);
    setIsFlipped(false);
  };

  if (finished) {
    return (
      <ScoreScreen
        known={known.length}
        toReview={toReview.length}
        total={cards.length}
        onRestart={handleRestart}
        onBack={onBack}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Carte {currentIndex + 1} / {cards.length}</span>
          <div className="flex gap-4">
            <span className="text-green-500">✅ {known.length}</span>
            <span className="text-orange-500">🔄 {toReview.length}</span>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <FlipCard
            question={currentCard.question}
            answer={currentCard.answer}
            isFlipped={isFlipped}
            onFlip={() => setIsFlipped(!isFlipped)}
          />
        </motion.div>
      </AnimatePresence>

      {/* Actions */}
      {isFlipped && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center gap-4"
        >
          <Button
            onClick={() => handleAnswer(false)}
            variant="outline"
            size="lg"
            className="rounded-2xl gap-2 px-8 border-orange-300 text-orange-600 hover:bg-orange-50"
          >
            <RotateCcw className="w-5 h-5" />
            À revoir
          </Button>
          <Button
            onClick={() => handleAnswer(true)}
            size="lg"
            className="rounded-2xl gap-2 px-8 bg-green-600 hover:bg-green-700"
          >
            <Check className="w-5 h-5" />
            Je savais
          </Button>
        </motion.div>
      )}
    </div>
  );
}