import React, { useState } from 'react';
import { Heart, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface OnboardingData {
  name: string;
  preferredTone: 'gentle' | 'neutral' | 'direct';
  journalingFrequency: 'daily' | 'weekly' | 'custom';
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    name: '',
    preferredTone: 'gentle',
    journalingFrequency: 'daily',
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(formData);
    }
  };

  const canProceed = () => {
    switch (step) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-card border-border shadow-elegant">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Welcome to MoodMuse
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Let's personalize your journaling experience
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress indicators */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  i <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

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
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {step === 3 ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Start Journaling
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
          
          {step > 1 && (
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
