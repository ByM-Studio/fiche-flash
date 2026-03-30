import React from 'react';
import { useProgress } from '@/hooks/useProgress';
import { BADGES, LEVELS, getLevelInfo } from '@/lib/progressConfig';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Zap, BookOpen, GraduationCap, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

function StatCard({ icon: Icon, label, value, color = 'primary' }) {
  return (
    <div className="bg-card rounded-2xl border border-border/50 p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="text-2xl font-extrabold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function BadgeCard({ badge, unlocked }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-2xl border p-5 text-center transition-all ${
        unlocked
          ? 'bg-card border-primary/20 shadow-md shadow-primary/5'
          : 'bg-muted/30 border-border/30 opacity-50'
      }`}
    >
      <div className={`text-4xl mb-3 ${unlocked ? '' : 'grayscale'}`}>{badge.emoji}</div>
      <p className="font-semibold text-sm">{badge.name}</p>
      <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
      {unlocked && (
        <Badge className="mt-3 rounded-lg text-xs bg-primary/10 text-primary border-primary/20">Débloqué ✓</Badge>
      )}
    </motion.div>
  );
}

export default function ProgressPage() {
  const { xp, level, badges, stats, levelInfo, loading } = useProgress();
  const { current, next, xpIntoLevel, xpNeeded, progress } = levelInfo;

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Ma progression</h1>
        </div>
        <p className="text-muted-foreground">Tes XP, badges et statistiques 🏆</p>
      </motion.div>

      {/* Level card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 p-6 md:p-8 mb-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="text-5xl">{current.emoji}</div>
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-1">
              <div>
                <span className="text-xl font-extrabold">Niveau {current.level}</span>
                <span className="ml-2 text-lg font-semibold text-muted-foreground">{current.title}</span>
              </div>
              <span className="text-sm font-bold text-primary">{xp} XP</span>
            </div>
            <Progress value={progress} className="h-3 rounded-full" />
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>{xpIntoLevel} XP</span>
              {next ? (
                <span>→ {next.title} ({xpNeeded} XP)</span>
              ) : (
                <span>🎓 Niveau max !</span>
              )}
            </div>
          </div>
        </div>

        {/* Level roadmap */}
        <div className="mt-6 flex items-center gap-1 overflow-x-auto pb-1">
          {LEVELS.map((lvl, i) => (
            <React.Fragment key={lvl.level}>
              <div className={`flex flex-col items-center flex-shrink-0 ${lvl.level <= level ? 'opacity-100' : 'opacity-30'}`}>
                <span className="text-lg">{lvl.emoji}</span>
                <span className="text-xs font-medium">{lvl.level}</span>
              </div>
              {i < LEVELS.length - 1 && (
                <div className={`h-0.5 flex-1 min-w-[16px] rounded-full ${lvl.level < level ? 'bg-primary' : 'bg-border'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard icon={BookOpen}    label="Fiches générées"  value={stats.fiches_generated} />
        <StatCard icon={CreditCard}  label="Flash cards réussies" value={stats.flashcards_known} />
        <StatCard icon={GraduationCap} label="Examens passés" value={stats.exams_done} />
        <StatCard icon={Zap}         label="XP total"         value={xp} />
      </div>

      {/* Badges */}
      <div>
        <h2 className="text-xl font-bold mb-4">
          Badges <span className="text-muted-foreground text-base font-normal">({badges.length}/{BADGES.length} débloqués)</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {BADGES.map((badge, i) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <BadgeCard badge={badge} unlocked={badges.includes(badge.id)} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}