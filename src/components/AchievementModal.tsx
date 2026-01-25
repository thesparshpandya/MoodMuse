import React, { useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share2, X, Sparkles } from 'lucide-react';
import { CelebrationConfetti } from './CelebrationConfetti';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: 'streak' | 'entries' | 'wellness' | 'growth';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementModalProps {
  achievement: Achievement | null;
  isOpen: boolean;
  onClose: () => void;
  onShare?: () => void;
}

const RARITY_STYLES = {
  common: {
    bg: 'from-slate-400/20 to-slate-500/20',
    border: 'border-slate-400/30',
    glow: 'shadow-slate-400/20',
    text: 'text-slate-600 dark:text-slate-300',
  },
  rare: {
    bg: 'from-blue-400/20 to-cyan-500/20',
    border: 'border-blue-400/30',
    glow: 'shadow-blue-400/30',
    text: 'text-blue-600 dark:text-blue-300',
  },
  epic: {
    bg: 'from-purple-400/20 to-pink-500/20',
    border: 'border-purple-400/30',
    glow: 'shadow-purple-400/40',
    text: 'text-purple-600 dark:text-purple-300',
  },
  legendary: {
    bg: 'from-amber-400/20 to-orange-500/20',
    border: 'border-amber-400/40',
    glow: 'shadow-amber-400/50',
    text: 'text-amber-600 dark:text-amber-300',
  },
};

const CATEGORY_MESSAGES = {
  streak: "You're building something beautiful",
  entries: "Your words have power",
  wellness: "Taking care of yourself matters",
  growth: "Every step forward counts",
};

export const AchievementModal: React.FC<AchievementModalProps> = ({
  achievement,
  isOpen,
  onClose,
  onShare,
}) => {
  const [showConfetti, setShowConfetti] = React.useState(false);

  useEffect(() => {
    if (isOpen && achievement) {
      setShowConfetti(true);
    }
  }, [isOpen, achievement]);

  if (!achievement) return null;

  const styles = RARITY_STYLES[achievement.rarity];

  const handleShare = async () => {
    const shareText = `🏆 I just unlocked "${achievement.title}" on MoodMuse!\n\n${achievement.description}\n\nStart your emotional wellness journey ✨`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Achievement Unlocked: ${achievement.title}`,
          text: shareText,
          url: window.location.origin,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      onShare?.();
    }
  };

  return (
    <>
      <CelebrationConfetti 
        isActive={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />
      
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md border-0 bg-transparent shadow-none p-0 overflow-visible">
          <div className={`
            relative rounded-2xl p-8 text-center
            bg-gradient-to-br ${styles.bg}
            border-2 ${styles.border}
            backdrop-blur-xl
            shadow-2xl ${styles.glow}
            animate-scale-in
          `}>
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full bg-background/50 hover:bg-background/80 transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>

            {/* Sparkle decorations */}
            <div className="absolute -top-3 -left-3 animate-pulse">
              <Sparkles className="h-6 w-6 text-primary/60" />
            </div>
            <div className="absolute -bottom-2 -right-2 animate-pulse delay-75">
              <Sparkles className="h-5 w-5 text-accent/60" />
            </div>

            {/* Achievement content */}
            <div className="mb-6">
              <div className="text-7xl mb-4 animate-bounce">
                {achievement.emoji}
              </div>
              
              <p className={`text-xs uppercase tracking-wider font-semibold mb-2 ${styles.text}`}>
                {achievement.rarity} Achievement
              </p>
              
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {achievement.title}
              </h2>
              
              <p className="text-muted-foreground text-sm mb-4">
                {achievement.description}
              </p>
              
              <p className="text-xs text-primary/80 italic">
                {CATEGORY_MESSAGES[achievement.category]}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={handleShare}
                className="gap-2 bg-background/50 hover:bg-background/80"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              
              <Button
                onClick={onClose}
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                Keep Going!
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
