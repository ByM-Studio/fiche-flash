import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

export default function ExamQuestion({ question, index, total, answer, onAnswerChange }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="rounded-lg px-3 py-1 text-sm font-semibold">
          Question {index + 1}/{total}
        </Badge>
        <span className="text-xs text-muted-foreground">{question.points} point{question.points > 1 ? 's' : ''}</span>
      </div>

      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl border border-primary/15 p-6">
        <p className="text-lg font-semibold leading-relaxed">{question.question}</p>
        {question.context && (
          <p className="mt-3 text-sm text-muted-foreground italic border-t border-border/50 pt-3">
            💡 {question.context}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Ta réponse</label>
        <Textarea
          placeholder="Rédige ta réponse ici..."
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          className="min-h-[120px] rounded-xl resize-none text-base"
        />
      </div>
    </div>
  );
}