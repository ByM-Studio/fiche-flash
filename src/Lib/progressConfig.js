// XP rewards
export const XP_REWARDS = {
  FLASHCARD_KNOWN: 10,
  FLASHCARD_SESSION_COMPLETE: 25,
  EXAM_DONE: 50,
  EXAM_PERFECT: 150,
  FICHE_GENERATED: 20,
};

// Levels config: level => XP needed to reach this level
export const LEVELS = [
  { level: 1, xpRequired: 0,    title: 'Débutant',       emoji: '🌱' },
  { level: 2, xpRequired: 100,  title: 'Apprenti',       emoji: '📖' },
  { level: 3, xpRequired: 300,  title: 'Étudiant',       emoji: '✏️' },
  { level: 4, xpRequired: 600,  title: 'Réviseur',       emoji: '📚' },
  { level: 5, xpRequired: 1000, title: 'Assidu',         emoji: '🔥' },
  { level: 6, xpRequired: 1500, title: 'Sérieux',        emoji: '⚡' },
  { level: 7, xpRequired: 2200, title: 'Expert',         emoji: '🏆' },
  { level: 8, xpRequired: 3000, title: 'Maître du Bac',  emoji: '🎓' },
];

export function getLevelInfo(xp) {
  let current = LEVELS[0];
  let next = LEVELS[1];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) {
      current = LEVELS[i];
      next = LEVELS[i + 1] || null;
      break;
    }
  }
  const xpIntoLevel = xp - current.xpRequired;
  const xpNeeded = next ? next.xpRequired - current.xpRequired : 1;
  const progress = next ? Math.min(100, Math.round((xpIntoLevel / xpNeeded) * 100)) : 100;
  return { current, next, xpIntoLevel, xpNeeded, progress };
}

// Badges config
export const BADGES = [
  {
    id: 'first_fiche',
    name: 'Premier pas',
    description: 'Génère ta première fiche',
    emoji: '🌟',
    condition: (stats) => stats.fiches_generated >= 1,
  },
  {
    id: 'fiche_5',
    name: 'Réviseur assidu',
    description: 'Génère 5 fiches de révision',
    emoji: '📚',
    condition: (stats) => stats.fiches_generated >= 5,
  },
  {
    id: 'flashcard_50',
    name: 'Maître des cartes',
    description: 'Réussis 50 flash cards',
    emoji: '🃏',
    condition: (stats) => stats.flashcards_known >= 50,
  },
  {
    id: 'flashcard_200',
    name: 'Mémoire d\'acier',
    description: 'Réussis 200 flash cards',
    emoji: '🧠',
    condition: (stats) => stats.flashcards_known >= 200,
  },
  {
    id: 'first_exam',
    name: 'Sous pression',
    description: 'Termine ton premier examen blanc',
    emoji: '✍️',
    condition: (stats) => stats.exams_done >= 1,
  },
  {
    id: 'exam_5',
    name: 'Candidat au Bac',
    description: 'Termine 5 examens blancs',
    emoji: '🎯',
    condition: (stats) => stats.exams_done >= 5,
  },
  {
    id: 'perfect_exam',
    name: 'Sans faute',
    description: 'Obtiens 16/20 ou plus à un examen',
    emoji: '💎',
    condition: (stats) => stats.perfect_exams >= 1,
  },
  {
    id: 'maths_expert',
    name: 'Expert en Maths',
    description: 'Génère 3 fiches de Maths',
    emoji: '📐',
    condition: (stats) => stats.maths_fiches >= 3,
  },
  {
    id: 'philo_expert',
    name: 'Philosophe en herbe',
    description: 'Génère 3 fiches de Philo',
    emoji: '🦉',
    condition: (stats) => stats.philo_fiches >= 3,
  },
  {
    id: 'histoire_expert',
    name: 'Historien confirmé',
    description: 'Génère 3 fiches d\'Histoire-Géo',
    emoji: '🗺️',
    condition: (stats) => stats.histoire_fiches >= 3,
  },
  {
    id: 'level_5',
    name: 'On s\'échauffe !',
    description: 'Atteins le niveau 5',
    emoji: '🔥',
    condition: (stats, xp) => xp >= 1000,
  },
  {
    id: 'level_max',
    name: 'Maître du Bac',
    description: 'Atteins le niveau maximum',
    emoji: '🎓',
    condition: (stats, xp) => xp >= 3000,
  },
];

export function checkNewBadges(stats, xp, currentBadges = []) {
  return BADGES.filter(
    badge => !currentBadges.includes(badge.id) && badge.condition(stats, xp)
  );
}