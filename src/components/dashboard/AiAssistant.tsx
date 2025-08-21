'use client';

import { useState } from 'react';
import { analyzeHealthRecords } from '@/ai/flows/analyze-health-records';
import type { HealthRecord } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface AiAssistantProps {
  records: HealthRecord[];
}

export function AiAssistant({ records }: AiAssistantProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAnalysis = async () => {
    if (records.length === 0) {
        toast({
            title: "No Records Found",
            description: "Please add at least one health record to analyze.",
            variant: "destructive"
        });
        return;
    }

    setIsLoading(true);
    setInsights(null);

    try {
      const recordStrings = records.map(r => `[${r.type.replace('_', ' ')}] ${r.title}: ${r.content}`);
      const result = await analyzeHealthRecords({ medicalRecords: recordStrings });
      setInsights(result.insights);
    } catch (error) {
      console.error('AI analysis failed:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Could not generate health insights at this time.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Bot className="h-8 w-8 text-primary" />
        <div>
            <CardTitle>AI Health Assistant</CardTitle>
            <CardDescription>Get insights from your records.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleAnalysis} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
             <>
              <Sparkles className="mr-2 h-4 w-4" />
              Analyze My Records
            </>
          )}
        </Button>

        {insights && (
            <div className="space-y-4">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Disclaimer</AlertTitle>
                    <AlertDescription>
                        Its AI generated, consult a doctor for accurate predictions.
                    </AlertDescription>
                </Alert>
                <div className="p-4 bg-secondary rounded-lg text-sm text-secondary-foreground space-y-2">
                    <h4 className="font-semibold">Health Insights:</h4>
                    <p className="whitespace-pre-wrap">{insights}</p>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
