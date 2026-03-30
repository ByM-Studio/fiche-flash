import React from 'react';
import { Link } from 'react-router-dom';
import { getLevelInfo } from '@/lib/progressConfig';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function XPBar({ xp }) {
  const { current, next, xpIntoLevel, xpNeeded, progress } = getLevelInfo(xp);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to="/progression" className="hidden sm:flex items-center gap-2 group">
            <span className="text-base leading-none">{current.emoji}</span>
            <div className="flex flex-col gap-0.5 min-w-[80px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground leading-none">Niv.{current.level}</span>
                <span className="text-xs text-muted-foreground leading-none">{xp} XP</span>
              </div>
              <div className="h-1.5 w-20 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          <p className="font-semibold">{current.title}</p>
          {next ? (
            <p className="text-muted-foreground">{xpIntoLevel}/{xpNeeded} XP → {next.title}</p>
          ) : (
            <p className="text-muted-foreground">Niveau maximum atteint ! 🎓</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}