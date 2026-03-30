import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, Loader2 } from 'lucide-react';

const SUBJECTS = ['Maths', 'Physique', 'SVT', 'Histoire-Géo', 'Français', 'Philo', 'SES', 'NSI', 'Anglais', 'Spé autres'];
const LEVELS = ['Seconde', 'Première', 'Terminale'];

export default function GeneratorForm({ onGenerate, isLoading, remainingGenerations }) {
  const [subject, setSubject] = useState('');
  const [level, setLevel] = useState('');
  const [text, setText] = useState('');

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const canGenerate = subject && level && text.trim().length > 50 && remainingGenerations > 0 && !isLoading;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canGenerate) return;
    onGenerate({ subject, level, text });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Matière</label>
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger className="rounded-xl h-12">
              <SelectValue placeholder="Choisis ta matière" />
            </SelectTrigger>
            <SelectContent>
              {SUBJECTS.map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Niveau</label>
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger className="rounded-xl h-12">
              <SelectValue placeholder="Choisis ton niveau" />
            </SelectTrigger>
            <SelectContent>
              {LEVELS.map(l => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Ton cours</label>
        <Textarea
          placeholder="Colle ton cours ici... (min. 50 caractères, max. 3000 mots)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[200px] rounded-xl resize-none text-base"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{text.length} caractères</span>
          <span className={wordCount > 3000 ? 'text-destructive font-medium' : ''}>
            {wordCount}/3000 mots
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Button
          type="submit"
          size="lg"
          disabled={!canGenerate}
          className="w-full sm:w-auto px-8 py-6 rounded-2xl gap-2 text-base shadow-lg shadow-primary/20"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Générer mes fiches
            </>
          )}
        </Button>
        <div className="flex items-center gap-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${remainingGenerations > 0 ? 'bg-green-500' : 'bg-destructive'}`} />
          <span className="text-muted-foreground">
            {remainingGenerations > 0 
              ? `${remainingGenerations} génération${remainingGenerations > 1 ? 's' : ''} restante${remainingGenerations > 1 ? 's' : ''} aujourd'hui`
              : 'Limite atteinte pour aujourd\'hui'
            }
          </span>
        </div>
      </div>
    </form>
  );
}