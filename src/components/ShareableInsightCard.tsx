import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check, Download, Sparkles, TrendingUp, Brain } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface InsightData {
  content: string;
  type: 'pattern' | 'growth' | 'reflection';
  timestamp: Date;
}

interface ShareableInsightCardProps {
  insight: InsightData;
  userName?: string;
}

const TYPE_CONFIG = {
  pattern: {
    icon: TrendingUp,
    label: 'Pattern Discovered',
    gradient: 'from-blue-500/20 via-cyan-500/10 to-teal-500/20',
    accent: 'text-blue-500',
    emoji: '🔍',
  },
  growth: {
    icon: Brain,
    label: 'Growth Moment',
    gradient: 'from-green-500/20 via-emerald-500/10 to-teal-500/20',
    accent: 'text-green-500',
    emoji: '🌱',
  },
  reflection: {
    icon: Sparkles,
    label: 'Deep Reflection',
    gradient: 'from-purple-500/20 via-pink-500/10 to-rose-500/20',
    accent: 'text-purple-500',
    emoji: '✨',
  },
};

export const ShareableInsightCard: React.FC<ShareableInsightCardProps> = ({
  insight,
  userName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const config = TYPE_CONFIG[insight.type];
  const Icon = config.icon;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const generateShareText = () => {
    const intro = userName ? `${userName}'s` : 'My';
    return `${config.emoji} ${intro} MoodMuse Insight\n\n"${insight.content}"\n\n— Discovered on ${formatDate(insight.timestamp)}\n\nUnderstand yourself better ✨`;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generateShareText());
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Your insight is ready to share",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${config.label} - MoodMuse`,
          text: generateShareText(),
          url: window.location.origin,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      handleCopy();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1 h-7 px-2">
          <Share2 className="h-3 w-3" />
          <span className="text-xs">Share</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${config.accent}`} />
            Share This Insight
          </DialogTitle>
        </DialogHeader>

        {/* Preview Card */}
        <div className={`
          relative rounded-xl p-6 overflow-hidden
          bg-gradient-to-br ${config.gradient}
          border border-border/50
        `}>
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl" />
          
          <div className="relative">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <div className={`p-2 rounded-lg bg-background/50 ${config.accent}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className={`text-xs font-semibold ${config.accent}`}>
                  {config.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(insight.timestamp)}
                </p>
              </div>
            </div>

            {/* Insight content */}
            <blockquote className="text-foreground font-medium leading-relaxed mb-4 italic">
              "{insight.content}"
            </blockquote>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <Brain className="h-3 w-3 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  MoodMuse
                </span>
              </div>
              {userName && (
                <span className="text-xs text-muted-foreground">
                  — {userName}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleCopy}
            className="flex-1 gap-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Text
              </>
            )}
          </Button>
          
          <Button
            onClick={handleShare}
            className="flex-1 gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
