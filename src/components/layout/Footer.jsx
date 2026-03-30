import React from 'react';
import { Zap, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50 mt-auto">
      {/* BacMentor banner */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            🎯 Besoin d'un coach IA pour t'entraîner aux épreuves du Bac ?
          </p>
          <a
            href="https://bac-mentor.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Essaie BacMentor <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground">FicheFlash</span>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          © 2026 FicheFlash — Révise malin, mémorise pour de vrai. 🚀
        </p>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <Link to="/generer" className="hover:text-foreground transition-colors">Générer</Link>
          <Link to="/fiches-pretes" className="hover:text-foreground transition-colors">Fiches prêtes</Link>
        </div>
      </div>
    </footer>
  );
}