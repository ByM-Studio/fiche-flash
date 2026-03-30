import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Library, BookOpen, Search, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import UpgradeModal from '../components/UpgradeModal';

const SUBJECTS = ['Toutes', 'Maths', 'Physique', 'SVT', 'Histoire-Géo', 'Français', 'Philo', 'SES', 'NSI', 'Anglais'];
const LEVELS = ['Tous', 'Seconde', 'Première', 'Terminale'];

export default function ReadyCards() {
  const [subjectFilter, setSubjectFilter] = useState('Toutes');
  const [levelFilter, setLevelFilter] = useState('Tous');
  const [search, setSearch] = useState('');
  const [showUpgrade, setShowUpgrade] = useState(false);

  const { data: packs, isLoading } = useQuery({
    queryKey: ['ready-card-packs'],
    queryFn: () => base44.entities.ReadyCardPack.list('-created_date', 100),
    initialData: [],
  });

  const filtered = packs.filter(p => {
    const matchSubject = subjectFilter === 'Toutes' || p.subject === subjectFilter;
    const matchLevel = levelFilter === 'Tous' || p.level === levelFilter;
    const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase());
    return matchSubject && matchLevel && matchSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Library className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Fiches prêtes à l'emploi</h1>
        </div>
        <p className="text-muted-foreground">
          Des fiches de révision déjà préparées par chapitre et matière 📖
        </p>
      </motion.div>

      {/* Filters */}
      <div className="bg-card rounded-2xl border border-border/50 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une fiche..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-full sm:w-40 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-full sm:w-36 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-40 bg-muted rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {packs.length === 0 ? 'Bientôt disponible !' : 'Aucun résultat'}
          </h3>
          <p className="text-muted-foreground">
            {packs.length === 0
              ? 'Les fiches prêtes à l\'emploi arrivent très bientôt. Reste connecté(e) ! 🚀'
              : 'Essaie avec d\'autres filtres.'
            }
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((pack, i) => (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="bg-card rounded-2xl border border-border/50 p-6 hover:shadow-lg hover:shadow-primary/5 transition-all hover:-translate-y-0.5">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary" className="rounded-lg text-xs">{pack.subject}</Badge>
                  <Badge variant="outline" className="rounded-lg text-xs">{pack.level}</Badge>
                  {pack.is_free && (
                    <Badge className="rounded-lg text-xs bg-green-100 text-green-700 border-green-200">Gratuit</Badge>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-2">{pack.title}</h3>
                {pack.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{pack.description}</p>
                )}
                <Button
                  className="w-full rounded-xl gap-2"
                  onClick={() => {
                    if (!pack.is_free) {
                      setShowUpgrade(true);
                    }
                  }}
                  variant={pack.is_free ? 'default' : 'outline'}
                >
                  <BookOpen className="w-4 h-4" />
                  {pack.is_free ? 'Voir la fiche' : '🔒 Premium'}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} reason="ready" />
    </div>
  );
}