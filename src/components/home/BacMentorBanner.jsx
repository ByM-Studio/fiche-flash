import React from 'react';
import { ExternalLink, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BacMentorBanner() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/5 rounded-2xl border border-primary/20 p-8 md:p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-5">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            Tu mémorises avec FicheFlash, tu t'entraînes avec BacMentor 💪
          </h3>
          <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
            BacMentor est ton coach IA personnel pour t'entraîner aux épreuves du Bac 
            avec des exercices et corrections personnalisés.
          </p>
          <a href="https://bac-mentor.vercel.app" target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="outline" className="gap-2 rounded-xl">
              <GraduationCap className="w-5 h-5" />
              Découvrir BacMentor
              <ExternalLink className="w-4 h-4" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}