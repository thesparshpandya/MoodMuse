import React from 'react';
import { Loader2, Brain, Sparkles, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <Loader2 
      className={cn(
        'animate-spin text-muted-foreground',
        sizeClasses[size],
        className
      )} 
    />
  );
};

interface LoadingCardProps {
  title?: string;
  description?: string;
  icon?: 'brain' | 'sparkles' | 'message';
  className?: string;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({
  title = 'Loading...',
  description = 'Please wait while we process your request',
  icon = 'brain',
  className
}) => {
  const IconComponent = {
    brain: Brain,
    sparkles: Sparkles,
    message: MessageCircle
  }[icon];

  return (
    <Card className={cn('', className)}>
      <CardContent className="flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="relative">
              <IconComponent className="h-8 w-8 text-primary animate-pulse" />
              <div className="absolute -top-1 -right-1">
                <LoadingSpinner size="sm" className="text-primary" />
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface SkeletonProps {
  className?: string;
  animate?: boolean;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className, 
  animate = true,
  style
}) => {
  return (
    <div
      className={cn(
        'rounded-md bg-muted',
        animate && 'animate-pulse',
        className
      )}
      style={style}
    />
  );
};

interface MessageSkeletonProps {
  count?: number;
}

export const MessageSkeleton: React.FC<MessageSkeletonProps> = ({ 
  count = 3 
}) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

interface ChartSkeletonProps {
  bars?: number;
}

export const ChartSkeleton: React.FC<ChartSkeletonProps> = ({ 
  bars = 7 
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="flex items-end justify-between h-32 border-b border-border pb-2">
            {Array.from({ length: bars }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <Skeleton 
                  className="w-8 rounded-t-lg" 
                  style={{ height: `${20 + Math.random() * 60}%` }} 
                />
                <Skeleton className="h-4 w-6" />
                <Skeleton className="h-3 w-8" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface FullPageLoadingProps {
  title?: string;
  subtitle?: string;
}

export const FullPageLoading: React.FC<FullPageLoadingProps> = ({
  title = 'Loading MoodMuse',
  subtitle = 'Preparing your journaling experience...'
}) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="relative">
            <Brain className="h-16 w-16 text-primary animate-bounce" />
            <div className="absolute -top-2 -right-2">
              <Sparkles className="h-6 w-6 text-primary animate-spin" />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex justify-center">
          <LoadingSpinner size="lg" className="text-primary" />
        </div>
      </div>
    </div>
  );
};
