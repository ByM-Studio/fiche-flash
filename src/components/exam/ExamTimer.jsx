import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

export default function ExamTimer({ totalSeconds, onTimeUp }) {
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    if (remaining <= 0) {
      onTimeUp();
      return;
    }
    const interval = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) { onTimeUp(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const percent = (remaining / totalSeconds) * 100;
  const isUrgent = remaining < 60;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono text-sm font-semibold transition-colors ${
      isUrgent
        ? 'bg-red-50 border-red-200 text-red-600 animate-pulse'
        : 'bg-card border-border text-foreground'
    }`}>
      {isUrgent ? <AlertTriangle className="w-4 h-4" /> : <Clock className="w-4 h-4 text-muted-foreground" />}
      <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
    </div>
  );
}