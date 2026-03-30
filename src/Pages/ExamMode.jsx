import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useProgress } from '@/hooks/useProgress';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Loader2, Clock, ChevronRight, ChevronLeft, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import ExamTimer from '../components/exam/ExamTimer';
import ExamQuestion from '../components/exam/ExamQuestion';
import ExamResults from '../components/exam/ExamResults';

const DURATIONS = [
  { label: '10 min (express)', value: 600 },
  { label: '20 min (standard)', value: 1200 },
  { label: '30 min (complet)', value: 1800 },
];

// --- Setup Screen ---
function ExamSetup({ cards, onStart }) {
  const [selectedCardId, setSelectedCardId] = useState('');
  const [duration, setDuration] = useState(1200);

  const selectedCard = cards.find(c => c.id === selectedCardId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto space-y-6"
    >
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Mode Examen</h2>
        <p className="text-muted-foreground mt-2">
          Simule les conditions du Bac avec des questions générées depuis ta fiche et une correction détaillée. ⏱
        </p>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium">Choisir une fiche</label>
          <Select value={selectedCardId} onValueChange={setSelectedCardId}>
            <SelectTrigger className="rounded-xl h-12">
              <SelectValue placeholder="Sélectionne une fiche..." />
            </SelectTrigger>
            <SelectContent>
              {cards.map(card => (
                <SelectItem key={card.id} value={card.id}>
                  {card.title} — {card.subject} {card.level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedCard && (
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary" className="rounded-lg text-xs">{selectedCard.subject}</Badge>
              <Badge variant="outline" className="rounded-lg text-xs">{selectedCard.level}</Badge>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Durée de l'examen</label>
          <Select value={String(duration)} onValueChange={v => setDuration(Number(v))}>
            <SelectTrigger className="rounded-xl h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DURATIONS.map(d => (
                <SelectItem key={d.value} value={String(d.value)}>{d.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-accent/50 rounded-xl p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Comment ça marche ?</p>
          <ul className="space-y-1">
            <li>• L'IA génère 5 questions depuis ta fiche</li>
            <li>• Tu réponds par écrit dans le temps imparti</li>
            <li>• Correction détaillée et note sur 20 à la fin</li>
          </ul>
        </div>

        <Button
          onClick={() => onStart(selectedCard, duration)}
          disabled={!selectedCard}
          size="lg"
          className="w-full rounded-2xl py-6 gap-2 shadow-lg shadow-primary/20"
        >
          <GraduationCap className="w-5 h-5" />
          Lancer l'examen
        </Button>
      </div>
    </motion.div>
  );
}

// --- Main Page ---
export default function ExamMode() {
  const [phase, setPhase] = useState('setup'); // setup | generating | exam | correcting | results
  const [selectedCard, setSelectedCard] = useState(null);
  const [duration, setDuration] = useState(1200);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(0);
  const [results, setResults] = useState(null);
  const [examStart, setExamStart] = useState(null);
  const [timeTaken, setTimeTaken] = useState(0);
  const { awardExamDone } = useProgress();

  const { data: cards, isLoading: cardsLoading } = useQuery({
    queryKey: ['revision-cards'],
    queryFn: () => base44.entities.RevisionCard.list('-created_date', 50),
    initialData: [],
  });

  const handleStart = async (card, dur) => {
    setSelectedCard(card);
    setDuration(dur);
    setPhase('generating');

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es un examinateur du Bac français. À partir de cette fiche de révision en ${card.subject} (${card.level}), génère exactement 5 questions d'examen de qualité Bac.

Fiche : "${card.title}"
Résumé : ${card.summary_points?.join(' | ')}
Définitions : ${card.definitions?.map(d => `${d.term}: ${d.definition}`).join(' | ')}
Formules/Dates : ${card.key_formulas?.join(' | ')}

Consignes :
- Questions variées : définition, application, analyse, comparaison
- Difficulté progressive (facile → difficile)
- Adapté au niveau ${card.level}
- Chaque question a un barème de points (1, 2 ou 3 pts)
- Fournis aussi un contexte court si nécessaire`,
      response_json_schema: {
        type: "object",
        properties: {
          questions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                question: { type: "string" },
                context: { type: "string" },
                points: { type: "number" }
              }
            }
          }
        }
      },
      model: "claude_sonnet_4_6"
    });

    setQuestions(result.questions || []);
    setAnswers({});
    setCurrentQ(0);
    setExamStart(Date.now());
    setPhase('exam');
  };

  const handleTimeUp = () => {
    toast.warning("⏰ Temps écoulé ! Correction en cours...");
    submitExam();
  };

  const submitExam = async () => {
    const elapsed = examStart ? Math.round((Date.now() - examStart) / 1000) : 0;
    setTimeTaken(elapsed);
    setPhase('correcting');

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es un correcteur du Bac. Corrige ces réponses d'élève pour un examen de ${selectedCard.subject} (${selectedCard.level}).

Questions et réponses :
${questions.map((q, i) => `Q${i+1} [${q.points} pts]: ${q.question}
Réponse élève: "${answers[i] || '(pas de réponse)'}"`).join('\n\n')}

Pour chaque question, donne :
- Un score (entre 0 et le barème)
- La réponse attendue complète
- Une explication pédagogique courte

Sois bienveillant mais honnête. Si la réponse est incomplète, donne des points partiels.`,
      response_json_schema: {
        type: "object",
        properties: {
          corrections: {
            type: "array",
            items: {
              type: "object",
              properties: {
                score: { type: "number" },
                expected_answer: { type: "string" },
                explanation: { type: "string" }
              }
            }
          }
        }
      },
      model: "claude_sonnet_4_6"
    });

    const combined = questions.map((q, i) => ({
      question: q,
      userAnswer: answers[i] || '',
      correction: result.corrections[i] || { score: 0, expected_answer: '', explanation: '' }
    }));

    setResults(combined);
    setPhase('results');

    // Award XP based on score
    const totalPts = combined.reduce((s, r) => s + r.question.points, 0);
    const earned = combined.reduce((s, r) => s + (r.correction?.score ?? 0), 0);
    const note = Math.round((earned / totalPts) * 20);
    await awardExamDone(note);
  };

  const handleRetry = async () => {
    setPhase('generating');
    setResults(null);
    await handleStart(selectedCard, duration);
  };

  const handleBack = () => {
    setPhase('setup');
    setSelectedCard(null);
    setQuestions([]);
    setAnswers({});
    setResults(null);
    setCurrentQ(0);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      {/* Page header */}
      {phase === 'setup' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">Mode Examen</h1>
          </div>
          <p className="text-muted-foreground">Entraîne-toi dans les conditions du Bac 🎓</p>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {(phase === 'setup') && (
          <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {cardsLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : cards.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-2xl border border-border/50 p-8">
                <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune fiche disponible</h3>
                <p className="text-muted-foreground">Génère d'abord une fiche pour pouvoir lancer un examen.</p>
              </div>
            ) : (
              <ExamSetup cards={cards} onStart={handleStart} />
            )}
          </motion.div>
        )}

        {(phase === 'generating' || phase === 'correcting') && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center py-24 gap-4"
          >
            <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <p className="text-lg font-medium text-muted-foreground animate-pulse">
              {phase === 'generating' ? "L'IA prépare tes questions d'examen... 📝" : "L'IA corrige tes réponses... 🔍"}
            </p>
          </motion.div>
        )}

        {phase === 'exam' && questions.length > 0 && (
          <motion.div key="exam" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Exam header */}
            <div className="flex items-center justify-between bg-card rounded-2xl border border-border/50 p-4">
              <div>
                <p className="text-sm font-semibold">{selectedCard.title}</p>
                <p className="text-xs text-muted-foreground">{selectedCard.subject} · {selectedCard.level}</p>
              </div>
              <ExamTimer totalSeconds={duration} onTimeUp={handleTimeUp} />
            </div>

            {/* Question */}
            <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8">
              <ExamQuestion
                question={questions[currentQ]}
                index={currentQ}
                total={questions.length}
                answer={answers[currentQ] || ''}
                onAnswerChange={val => setAnswers(prev => ({ ...prev, [currentQ]: val }))}
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentQ(q => q - 1)}
                disabled={currentQ === 0}
                className="rounded-xl gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Précédente
              </Button>

              <div className="flex gap-2">
                {questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentQ(i)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                      i === currentQ
                        ? 'bg-primary text-primary-foreground'
                        : answers[i]
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              {currentQ < questions.length - 1 ? (
                <Button
                  onClick={() => setCurrentQ(q => q + 1)}
                  className="rounded-xl gap-2"
                >
                  Suivante <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={submitExam}
                  className="rounded-xl gap-2 bg-green-600 hover:bg-green-700"
                >
                  <Send className="w-4 h-4" /> Remettre la copie
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {phase === 'results' && results && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ExamResults
              results={results}
              timeTaken={timeTaken}
              onRetry={handleRetry}
              onBack={handleBack}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}