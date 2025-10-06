'use client';

import { useState } from 'react';
import { analyzeHealthRecords, type AnalyzeHealthRecordsOutput } from '@/ai/flows/analyze-health-records';
import type { HealthRecord, User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Bot, Loader2, Sparkles, AlertTriangle, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface RecordAiAnalysisProps {
  record: HealthRecord;
  user: User | null;
}

export function RecordAiAnalysis({ record, user }: RecordAiAnalysisProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalyzeHealthRecordsOutput | null>(null);
  const { toast } = useToast();

  const handleAnalysis = async () => {
    setIsLoading(true);
    setAnalysis(null);

    try {
      const recordString = `[${record.type.replace('_', ' ')}] ${record.title}: ${record.content}`;
      const result = await analyzeHealthRecords({ 
        medicalRecords: [recordString],
        weight: user?.weight,
        height: user?.height,
        bmi: user?.bmi
      });
      setAnalysis(result);
    } catch (error) {
      console.error('AI analysis failed:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Could not generate health insights for this record.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full space-y-4'>
        {!analysis && (
            <Button onClick={handleAnalysis} disabled={isLoading} className="w-full" variant="ghost">
            {isLoading ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
                </>
            ) : (
                <>
                <Sparkles className="mr-2 h-4 w-4" />
                Analyze with AI
                </>
            )}
            </Button>
        )}

        {analysis && (
            <div className="space-y-4 pt-4 border-t">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Disclaimer</AlertTitle>
                    <AlertDescription>
                        AI-generated suggestions are not medical advice. Consult a doctor for accurate guidance.
                    </AlertDescription>
                </Alert>
                
                <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertTitle>AI Health Summary for this Record</AlertTitle>
                    <AlertDescription>
                        {analysis.summary}
                    </AlertDescription>
                </Alert>
                
                <div className="p-4 bg-secondary rounded-lg space-y-3">
                    <h4 className="font-semibold text-secondary-foreground">Recommendations</h4>
                    <ul className="space-y-2 text-sm text-secondary-foreground list-disc list-inside">
                        {analysis.recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                        ))}
                    </ul>
                </div>

                 <Button onClick={() => setAnalysis(null)} variant="ghost" size="sm" className="w-full">
                    Clear Analysis
                </Button>
            </div>
        )}
    </div>
  );
}
