import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, RotateCcw, ArrowLeft, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

function ScoreCircle({ score, total }) {
  const percent = Math.round((score / total) * 20);
  const color = percent >= 14 ? 'text-green-500' : percent >= 10 ? 'text-orange-500' : 'text-red-500';
  return (
    <div className="flex flex-col items-center">
      <div className={`text-6xl font-extrabold ${color}`}>{percent}/20</div>
      <p className="text-muted-foreground mt-1 text-sm">{score} pts sur {total} pts</p>
    </div>
  );
}

function QuestionReview({ item, index }) {
  const { question, userAnswer, correction } = item;
  const scorePercent = correction.score / question.points;
  const icon = scorePercent === 1
    ? <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
    : scorePercent >= 0.5
      ? <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
      : <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />;

  const bg = scorePercent === 1
    ? 'border-green-200 bg-green-50/50'
    : scorePercent >= 0.5
      ? 'border-orange-200 bg-orange-50/50'
      : 'border-red-200 bg-red-50/50';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`rounded-2xl border p-5 space-y-3 ${bg}`}
    >
      <div className="flex items-start gap-3">
        {icon}
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className="font-semibold text-sm">Q{index + 1}. {question.question}</p>
            <Badge variant="outline" className="text-xs flex-shrink-0">
              {correction.score}/{question.points} pt{question.points > 1 ? 's' : ''}
            </Badge>
          </div>

          {userAnswer && (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground mb-1">Ta réponse :</p>
              <p className="text-sm bg-white/60 rounded-lg p-2 italic">{userAnswer || '—'}</p>
            </div>
          )}

          <div className="mt-2">
            <p className="text-xs text-muted-foreground mb-1">Correction :</p>
            <p className="text-sm font-medium">{correction.expected_answer}</p>
          </div>

          {correction.explanation && (
            <p className="text-xs text-muted-foreground mt-2 border-t border-border/40 pt-2">
              💡 {correction.explanation}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ExamResults({ results, timeTaken, onRetry, onBack }) {
  const totalPoints = results.reduce((s, r) => s + r.question.points, 0);
  const earnedPoints = results.reduce((s, r) => s + (r.correction?.score ?? 0), 0);
  const note = Math.round((earnedPoints / totalPoints) * 20);

  const getMessage = () => {
    if (note >= 16) return { text: "Excellent ! Tu maîtrises le sujet ! 🏆", color: "text-green-500" };
    if (note >= 14) return { text: "Très bien ! Tu es au-dessus de la moyenne ! 💪", color: "text-green-500" };
    if (note >= 10) return { text: "Bien joué ! Quelques points à consolider. 📚", color: "text-orange-500" };
    return { text: "Courage ! Relis les corrections et recommence. 🔄", color: "text-red-500" };
  };

  const msg = getMessage();
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;

  return (
    <div className="space-y-6">
      {/* Score header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl border border-border/50 p-8 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Résultats du Mode Examen</h2>
        <ScoreCircle score={earnedPoints} total={totalPoints} />
        <p className={`mt-3 font-semibold ${msg.color}`}>{msg.text}</p>
        <p className="text-xs text-muted-foreground mt-2">
          ⏱ Temps utilisé : {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </p>
      </motion.div>

      {/* Detailed corrections */}
      <div>
        <h3 className="text-lg font-bold mb-4">Correction détaillée</h3>
        <div className="space-y-3">
          {results.map((item, i) => (
            <QuestionReview key={i} item={item} index={i} />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button onClick={onRetry} size="lg" className="rounded-2xl gap-2 flex-1 py-6">
          <RotateCcw className="w-5 h-5" />
          Recommencer l'examen
        </Button>
        <Button onClick={onBack} variant="outline" size="lg" className="rounded-2xl gap-2 flex-1 py-6">
          <ArrowLeft className="w-5 h-5" />
          Changer de fiche
        </Button>
      </div>
    </div>
  );
}