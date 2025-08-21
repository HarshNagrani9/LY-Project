'use server';

/**
 * @fileOverview A health record analysis AI agent.
 *
 * - analyzeHealthRecords - A function that handles the health record analysis process.
 * - AnalyzeHealthRecordsInput - The input type for the analyzeHealthRecords function.
 * - AnalyzeHealthRecordsOutput - The return type for the analyzeHealthRecords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeHealthRecordsInputSchema = z.object({
  medicalRecords: z.array(
    z.string().describe('A list of medical records as strings.')
  ).describe('The medical records to analyze.'),
});
export type AnalyzeHealthRecordsInput = z.infer<typeof AnalyzeHealthRecordsInputSchema>;

const AnalyzeHealthRecordsOutputSchema = z.object({
  insights: z.string().describe('General health insights and suggestions based on the analyzed medical records.'),
});
export type AnalyzeHealthRecordsOutput = z.infer<typeof AnalyzeHealthRecordsOutputSchema>;

export async function analyzeHealthRecords(input: AnalyzeHealthRecordsInput): Promise<AnalyzeHealthRecordsOutput> {
  return analyzeHealthRecordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeHealthRecordsPrompt',
  input: {schema: AnalyzeHealthRecordsInputSchema},
  output: {schema: AnalyzeHealthRecordsOutputSchema},
  prompt: `You are an AI health assistant that analyzes medical records and provides general health insights and suggestions.

  Analyze the following medical records and provide general health insights and suggestions:

  Medical Records:
  {{#each medicalRecords}}
  - {{{this}}}
  {{/each}}
  `,
});

const analyzeHealthRecordsFlow = ai.defineFlow(
  {
    name: 'analyzeHealthRecordsFlow',
    inputSchema: AnalyzeHealthRecordsInputSchema,
    outputSchema: AnalyzeHealthRecordsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
