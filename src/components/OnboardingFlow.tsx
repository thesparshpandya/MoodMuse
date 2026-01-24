import React, { useState } from 'react';
import { Heart, ArrowRight, Check, Sparkles, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

interface OnboardingData {
  name: string;
  preferredTone: 'gentle' | 'neutral' | 'direct';
  journalingFrequency: 'daily' | 'weekly' | 'custom';
  initialMood?: string;
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

const MOOD_OPTIONS = [
  { id: 'great', emoji: '😊', label: 'Great', color: 'from-green-400 to-emerald-500' },
  { id: 'good', emoji: '🙂', label: 'Good', color: 'from-blue-400 to-cyan-500' },
  { id: 'okay', emoji: '😐', label: 'Okay', color: 'from-yellow-400 to-orange-400' },
  { id: 'low', emoji: '😔', label: 'Low', color: 'from-purple-400 to-pink-500' },
  { id: 'stressed', emoji: '😰', label: 'Stressed', color: 'from-red-400 to-rose-500' },
];

const SAMPLE_INSIGHTS = {
  great: "It sounds like you're in a wonderful headspace! Joy is meant to be savored. What sparked this lightness in you today?",
  good: "A steady, positive energy is something to appreciate. Sometimes \"good\" is exactly where we need to be.",
  okay: "It's okay to be okay. Not every day needs to be extraordinary — these neutral moments are part of the journey.",
  low: "I hear you. Some days are harder than others, and acknowledging that takes courage. You're not alone in this.",
  stressed: "Stress can feel overwhelming, but recognizing it is already a step toward managing it. Let's work through this together."
};

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0); // Start at 0 for mood check-in
  const [formData, setFormData] = useState<OnboardingData>({
    name: '',
    preferredTone: 'gentle',
    journalingFrequency: 'daily',
    initialMood: undefined,
  });
  const [showMagicPreview, setShowMagicPreview] = useState(false);

  const handleMoodSelect = (moodId: string) => {
    setFormData({ ...formData, initialMood: moodId });
    setShowMagicPreview(true);
  };

  const handleNext = () => {
    if (step === 0) {
      setShowMagicPreview(false);
      setStep(1);
    } else if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete(formData);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return formData.initialMood !== undefined;
      case 1:
        return formData.name.trim().length > 0;
      case 2:
        return formData.preferredTone !== undefined;
      case 3:
        return formData.journalingFrequency !== undefined;
      default:
        return false;
    }
  };

  const totalSteps = 4;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md bg-card border-border shadow-elegant overflow-hidden">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit animate-pulse">
            <Brain className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            {step === 0 ? 'How are you feeling?' : 'Welcome to MoodMuse'}
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            {step === 0 
              ? "Let's start with a quick check-in" 
              : "Let's understand you better, so we can support you better"}
          </p>
          {step === 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Built thoughtfully for people who want to understand themselves better.
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress indicators */}
          <div className="flex justify-center gap-2 mb-6">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i <= step ? 'bg-primary w-8' : 'bg-muted w-2'
                )}
              />
            ))}
          </div>

          {/* Step 0: Mood Check-in */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-5 gap-2">
                {MOOD_OPTIONS.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => handleMoodSelect(mood.id)}
                    className={cn(
                      "flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 hover:scale-105",
                      formData.initialMood === mood.id
                        ? "border-primary bg-primary/10 shadow-lg"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <span className="text-2xl mb-1">{mood.emoji}</span>
                    <span className="text-xs text-muted-foreground">{mood.label}</span>
                  </button>
                ))}
              </div>

              {/* Magic Preview - AI Insight Teaser */}
              {showMagicPreview && formData.initialMood && (
                <div className="animate-fade-in mt-6">
                  <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 border border-primary/20">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/20 rounded-lg">
                        <Sparkles className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-primary font-medium mb-1">AI Insight Preview</p>
                        <p className="text-sm text-foreground leading-relaxed">
                          {SAMPLE_INSIGHTS[formData.initialMood as keyof typeof SAMPLE_INSIGHTS]}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    ✨ This is just a preview of what MoodMuse can do for you
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 1: Name */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  What should I call you?
                </h3>
                <p className="text-sm text-muted-foreground">
                  I'd love to make our conversations feel more personal
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Your name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="text-center"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Step 2: Tone Preference */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  How would you like me to respond?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Choose the tone that feels most comfortable for you
                </p>
              </div>

              <RadioGroup
                value={formData.preferredTone}
                onValueChange={(value) => 
                  setFormData({ ...formData, preferredTone: value as OnboardingData['preferredTone'] })
                }
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="gentle" id="gentle" />
                  <div className="flex-1">
                    <Label htmlFor="gentle" className="font-medium">Gentle & Nurturing</Label>
                    <p className="text-xs text-muted-foreground">Soft, caring responses with extra empathy</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="neutral" id="neutral" />
                  <div className="flex-1">
                    <Label htmlFor="neutral" className="font-medium">Balanced & Thoughtful</Label>
                    <p className="text-xs text-muted-foreground">Supportive yet realistic insights</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="direct" id="direct" />
                  <div className="flex-1">
                    <Label htmlFor="direct" className="font-medium">Direct & Honest</Label>
                    <p className="text-xs text-muted-foreground">Straightforward feedback with compassion</p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 3: Frequency */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  How often would you like to journal?
                </h3>
                <p className="text-sm text-muted-foreground">
                  This helps me understand your journaling rhythm
                </p>
              </div>

              <RadioGroup
                value={formData.journalingFrequency}
                onValueChange={(value) => 
                  setFormData({ ...formData, journalingFrequency: value as OnboardingData['journalingFrequency'] })
                }
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="daily" id="daily" />
                  <div className="flex-1">
                    <Label htmlFor="daily" className="font-medium">Daily</Label>
                    <p className="text-xs text-muted-foreground">I want to check in every day</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="weekly" id="weekly" />
                  <div className="flex-1">
                    <Label htmlFor="weekly" className="font-medium">Weekly</Label>
                    <p className="text-xs text-muted-foreground">A few times per week works for me</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="custom" id="custom" />
                  <div className="flex-1">
                    <Label htmlFor="custom" className="font-medium">As I Feel</Label>
                    <p className="text-xs text-muted-foreground">I'll journal when I need to</p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          )}

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-[1.02]"
          >
            {step === 3 ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Begin Your Journey
              </>
            ) : step === 0 ? (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Continue
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
          
          {step > 0 && (
            <Button
              variant="ghost"
              onClick={() => setStep(step - 1)}
              className="w-full text-muted-foreground"
            >
              Back
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
