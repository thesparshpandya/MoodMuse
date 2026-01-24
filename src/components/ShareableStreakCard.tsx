import React, { useRef, useState } from 'react';
import { Share2, Download, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ShareableStreakCardProps {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  userName?: string;
}

const MOTIVATIONAL_QUOTES = [
  "Every day you show up, you grow stronger.",
  "Consistency is the mother of mastery.",
  "Your emotions matter. You matter.",
  "Small steps lead to big transformations.",
  "You're writing your own story, one day at a time.",
  "Self-reflection is the ultimate superpower.",
  "Progress, not perfection.",
  "You're building something beautiful here."
];

export const ShareableStreakCard: React.FC<ShareableStreakCardProps> = ({
  currentStreak,
  longestStreak,
  totalDays,
  userName
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const getStreakEmoji = (streak: number) => {
    if (streak === 0) return '🌱';
    if (streak < 7) return '🔥';
    if (streak < 30) return '⭐';
    if (streak < 100) return '💎';
    return '🌟';
  };

  const getRandomQuote = () => {
    return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
  };

  const handleCopyToClipboard = async () => {
    const text = `🔥 I'm on a ${currentStreak}-day journaling streak with MoodMuse!\n\n"${getRandomQuote()}"\n\nStart your emotional wellness journey too!`;
    
    try {
      await navigator.clipboard.writeText(text);
      // Show a brief success state
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'My MoodMuse Streak',
      text: `🔥 I'm on a ${currentStreak}-day journaling streak with MoodMuse! "${getRandomQuote()}"`,
      url: window.location.origin
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or share failed
        handleCopyToClipboard();
      }
    } else {
      handleCopyToClipboard();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 hover:bg-primary/10 transition-all"
        >
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Share</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Share Your Progress
          </DialogTitle>
        </DialogHeader>
        
        {/* Shareable Card Preview */}
        <div 
          ref={cardRef}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-accent p-6 text-white shadow-xl"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-white blur-2xl" />
          </div>
          
          <div className="relative z-10 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">MoodMuse</span>
              </div>
              <span className="text-5xl">{getStreakEmoji(currentStreak)}</span>
            </div>
            
            {/* Streak Display */}
            <div className="text-center py-4">
              <div className="text-6xl font-bold mb-2">{currentStreak}</div>
              <div className="text-lg opacity-90">Day Journaling Streak</div>
            </div>
            
            {/* Quote */}
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-sm italic opacity-95">"{getRandomQuote()}"</p>
            </div>
            
            {/* Stats */}
            <div className="flex justify-center gap-6 text-center pt-2">
              <div>
                <div className="text-2xl font-semibold">{longestStreak}</div>
                <div className="text-xs opacity-80">Best Streak</div>
              </div>
              <div className="h-10 w-px bg-white/30" />
              <div>
                <div className="text-2xl font-semibold">{totalDays}</div>
                <div className="text-xs opacity-80">Total Days</div>
              </div>
            </div>
            
            {/* User name */}
            {userName && (
              <div className="text-center text-sm opacity-80 pt-2">
                by {userName}
              </div>
            )}
          </div>
        </div>
        
        {/* Share Actions */}
        <div className="flex gap-3 pt-4">
          <Button 
            onClick={handleCopyToClipboard}
            variant="outline"
            className="flex-1"
          >
            Copy Text
          </Button>
          <Button 
            onClick={handleShare}
            className="flex-1 gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
        
        <p className="text-xs text-center text-muted-foreground">
          Share your progress and inspire others to start their journey!
        </p>
      </DialogContent>
    </Dialog>
  );
};
