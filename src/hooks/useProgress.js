import { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { XP_REWARDS, getLevelInfo, checkNewBadges } from '@/lib/progressConfig';
import { toast } from 'sonner';

const DEFAULT_STATS = {
  flashcards_done: 0,
  flashcards_known: 0,
  exams_done: 0,
  fiches_generated: 0,
  perfect_exams: 0,
  maths_fiches: 0,
  philo_fiches: 0,
  histoire_fiches: 0,
  streak_days: 0,
  last_activity_date: '',
};

export function useProgress() {
  const [progressRecord, setProgressRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const records = await base44.entities.UserProgress.list('-created_date', 1);
    if (records.length > 0) {
      setProgressRecord(records[0]);
    }
    setLoading(false);
  };

  const getOrCreate = async () => {
    if (progressRecord) return progressRecord;
    const records = await base44.entities.UserProgress.list('-created_date', 1);
    if (records.length > 0) return records[0];
    const created = await base44.entities.UserProgress.create({
      xp: 0,
      level: 1,
      badges: [],
      stats: DEFAULT_STATS,
    });
    setProgressRecord(created);
    return created;
  };

  const addXP = useCallback(async (amount, statsUpdate = {}) => {
    const record = await getOrCreate();
    const currentXP = record.xp || 0;
    const currentStats = { ...DEFAULT_STATS, ...(record.stats || {}) };
    const newStats = { ...currentStats, ...statsUpdate };

    // Update numeric stats (accumulate)
    Object.keys(statsUpdate).forEach(key => {
      if (typeof statsUpdate[key] === 'number') {
        newStats[key] = (currentStats[key] || 0) + statsUpdate[key];
      }
    });

    newStats.last_activity_date = new Date().toISOString().slice(0, 10);

    const newXP = currentXP + amount;
    const newBadges = checkNewBadges(newStats, newXP, record.badges || []);
    const allBadges = [...(record.badges || []), ...newBadges.map(b => b.id)];

    const { current: newLevel } = getLevelInfo(newXP);

    const updated = await base44.entities.UserProgress.update(record.id, {
      xp: newXP,
      level: newLevel.level,
      badges: allBadges,
      stats: newStats,
    });

    setProgressRecord(updated);

    // Toast XP
    toast.success(`+${amount} XP 🚀`, { duration: 2000 });

    // Toast new badges
    newBadges.forEach(badge => {
      setTimeout(() => {
        toast(`🏅 Badge débloqué : ${badge.emoji} ${badge.name}`, {
          description: badge.description,
          duration: 4000,
        });
      }, 1000);
    });

    return updated;
  }, [progressRecord]);

  const awardFicheGenerated = useCallback(async (subject) => {
    const statsUpdate = { fiches_generated: 1 };
    if (subject === 'Maths') statsUpdate.maths_fiches = 1;
    if (subject === 'Philo') statsUpdate.philo_fiches = 1;
    if (subject === 'Histoire-Géo') statsUpdate.histoire_fiches = 1;
    return addXP(XP_REWARDS.FICHE_GENERATED, statsUpdate);
  }, [addXP]);

  const awardFlashcardKnown = useCallback(async () => {
    return addXP(XP_REWARDS.FLASHCARD_KNOWN, { flashcards_known: 1, flashcards_done: 1 });
  }, [addXP]);

  const awardFlashcardSession = useCallback(async () => {
    return addXP(XP_REWARDS.FLASHCARD_SESSION_COMPLETE, {});
  }, [addXP]);

  const awardExamDone = useCallback(async (note) => {
    const isPerfect = note >= 16;
    const xp = isPerfect ? XP_REWARDS.EXAM_PERFECT : XP_REWARDS.EXAM_DONE;
    const statsUpdate = { exams_done: 1, ...(isPerfect ? { perfect_exams: 1 } : {}) };
    return addXP(xp, statsUpdate);
  }, [addXP]);

  return {
    progressRecord,
    loading,
    xp: progressRecord?.xp || 0,
    level: progressRecord?.level || 1,
    badges: progressRecord?.badges || [],
    stats: { ...DEFAULT_STATS, ...(progressRecord?.stats || {}) },
    levelInfo: getLevelInfo(progressRecord?.xp || 0),
    awardFicheGenerated,
    awardFlashcardKnown,
    awardFlashcardSession,
    awardExamDone,
    reload: loadProgress,
  };
}