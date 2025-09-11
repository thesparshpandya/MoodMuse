import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ActivityType, MoodRating, ActivityCustomization } from '@/types/activity';
import { useActivityTracking } from '@/hooks/useActivityTracking';
import { BreathingTimer } from './activities/BreathingTimer';
import { GratitudePractice } from './activities/GratitudePractice';
import { GroundingTechnique } from './activities/GroundingTechnique';
import { PhysicalActivity } from './activities/PhysicalActivity';
import { ActivityTimer } from './activities/ActivityTimer';
import { Heart, Clock, Target, Settings, Focus, Star } from 'lucide-react';

interface ActivityModalProps {
  activity: ActivityType | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({ activity, isOpen, onClose }) => {
  const { startActivity, completeActivity } = useActivityTracking();
  const [currentPhase, setCurrentPhase] = useState<'setup' | 'activity' | 'completion'>('setup');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [beforeMood, setBeforeMood] = useState<number>(5);
  const [afterMood, setAfterMood] = useState<number>(5);
  const [notes, setNotes] = useState<string>('');
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [customDuration, setCustomDuration] = useState<number>(10);
  const [isStarting, setIsStarting] = useState<boolean>(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen && activity) {
      setCurrentPhase('setup');
      setSessionId(null);
      setBeforeMood(5);
      setAfterMood(5);
      setNotes('');
      setCustomDuration(activity.duration);
      setFocusMode(false);
      setIsStarting(false);
    }
  }, [isOpen, activity]);

  const handleStartActivity = async () => {
    if (!activity) return;
    
    setIsStarting(true);
    
    const customizations: ActivityCustomization = {
      duration: customDuration,
      focusMode
    };

    const newSessionId = startActivity(activity, beforeMood, customizations);
    setSessionId(newSessionId);
    setCurrentPhase('activity');
    
    // Short delay for smooth transition
    setTimeout(() => setIsStarting(false), 500);
  };

  const handleCompleteActivity = () => {
    if (!sessionId) return;
    
    completeActivity(sessionId, afterMood, notes || undefined);
    setCurrentPhase('completion');
  };

  const getMoodEmoji = (mood: number) => {
    if (mood <= 2) return '😔';
    if (mood <= 4) return '😐';
    if (mood <= 6) return '🙂';
    if (mood <= 8) return '😊';
    return '😄';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'mindfulness': return 'bg-blue-500/10 text-blue-700 dark:text-blue-300';
      case 'physical': return 'bg-green-500/10 text-green-700 dark:text-green-300';
      case 'social': return 'bg-purple-500/10 text-purple-700 dark:text-purple-300';
      case 'creative': return 'bg-orange-500/10 text-orange-700 dark:text-orange-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/10 text-green-700 dark:text-green-300';
      case 'medium': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300';
      case 'hard': return 'bg-red-500/10 text-red-700 dark:text-red-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const renderActivityContent = () => {
    if (!activity) return null;

    const commonProps = {
      duration: customDuration,
      onComplete: () => setCurrentPhase('completion')
    };

    switch (activity.id) {
      case 'breathing':
        return <BreathingTimer {...commonProps} />;
      case 'gratitude':
        return <GratitudePractice {...commonProps} />;
      case 'grounding':
        return <GroundingTechnique {...commonProps} />;
      case 'walk':
      case 'exercise':
      case 'movement':
        return <PhysicalActivity activity={activity} {...commonProps} />;
      default:
        return <ActivityTimer activity={activity} {...commonProps} />;
    }
  };

  const renderSetupPhase = () => (
    <div className="space-y-6">
      {/* Activity Overview */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{activity?.icon}</div>
          <div>
            <h3 className="text-lg font-semibold">{activity?.title}</h3>
            <div className="flex gap-2 mt-1">
              <Badge className={getCategoryColor(activity?.category || '')} variant="secondary">
                {activity?.category}
              </Badge>
              <Badge className={getDifficultyColor(activity?.difficulty || '')} variant="secondary">
                {activity?.difficulty}
              </Badge>
            </div>
          </div>
        </div>
        
        <p className="text-muted-foreground">{activity?.description}</p>
        
        {activity?.benefits && (
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              Benefits
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {activity.benefits.map((benefit, index) => (
                <li key={index}>• {benefit}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Separator />

      {/* Mood Rating */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              <h4 className="font-medium">How are you feeling right now?</h4>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Your current mood</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getMoodEmoji(beforeMood)}</span>
                  <span className="font-medium">{beforeMood}/10</span>
                </div>
              </div>
              
              <Slider
                value={[beforeMood]}
                onValueChange={(value) => setBeforeMood(value[0])}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Very Low</span>
                <span>Excellent</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Customization */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary" />
              <h4 className="font-medium">Customize Your Experience</h4>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Duration</span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{customDuration} min</span>
                  </div>
                </div>
                
                <Slider
                  value={[customDuration]}
                  onValueChange={(value) => setCustomDuration(value[0])}
                  min={5}
                  max={30}
                  step={5}
                  className="w-full"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Focus className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Focus Mode</span>
                </div>
                <Switch
                  checked={focusMode}
                  onCheckedChange={setFocusMode}
                />
              </div>
              
              {focusMode && (
                <p className="text-xs text-muted-foreground">
                  Focus mode will dim the background and minimize distractions
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={handleStartActivity} 
        className="w-full glass-button"
        disabled={isStarting}
      >
        {isStarting ? 'Starting...' : 'Begin Activity'}
      </Button>
    </div>
  );

  const renderCompletionPhase = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="text-4xl">🎉</div>
        <h3 className="text-lg font-semibold">Activity Completed!</h3>
        <p className="text-muted-foreground">Great job finishing your wellness activity.</p>
      </div>

      <Separator />

      {/* After Mood Rating */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              <h4 className="font-medium">How are you feeling now?</h4>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Your mood after the activity</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getMoodEmoji(afterMood)}</span>
                  <span className="font-medium">{afterMood}/10</span>
                </div>
              </div>
              
              <Slider
                value={[afterMood]}
                onValueChange={(value) => setAfterMood(value[0])}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />

              {/* Mood improvement indicator */}
              {afterMood !== beforeMood && (
                <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-muted/50">
                  <span className={`text-sm font-medium ${
                    afterMood > beforeMood ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'
                  }`}>
                    {afterMood > beforeMood ? '↗' : '↘'} 
                    {Math.abs(afterMood - beforeMood)} point{Math.abs(afterMood - beforeMood) !== 1 ? 's' : ''}
                    {afterMood > beforeMood ? ' improvement' : ' change'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optional Notes */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Reflection Notes (Optional)</label>
        <Textarea
          placeholder="How did this activity feel? Any insights or thoughts..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[80px]"
        />
      </div>

      <div className="flex gap-3">
        <Button onClick={handleCompleteActivity} className="flex-1 glass-button">
          Complete Activity
        </Button>
        <Button variant="outline" onClick={onClose} className="flex-1">
          Skip Rating
        </Button>
      </div>
    </div>
  );

  if (!activity) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={`max-w-2xl max-h-[90vh] overflow-y-auto ${
          focusMode && currentPhase === 'activity' ? 'fixed inset-0 z-[100] max-w-none max-h-none m-0 rounded-none' : ''
        }`}
      >
        <DialogHeader>
          <DialogTitle>
            {currentPhase === 'setup' && 'Prepare for Activity'}
            {currentPhase === 'activity' && `${activity.title} - In Progress`}
            {currentPhase === 'completion' && 'Activity Complete'}
          </DialogTitle>
        </DialogHeader>

        <div className={focusMode && currentPhase === 'activity' ? 'min-h-screen flex items-center justify-center p-8' : ''}>
          {currentPhase === 'setup' && renderSetupPhase()}
          {currentPhase === 'activity' && (
            <div className="space-y-6">
              {renderActivityContent()}
            </div>
          )}
          {currentPhase === 'completion' && renderCompletionPhase()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
