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
  weight: z.number().optional().describe("Patient's current weight in kg."),
  height: z.number().optional().describe("Patient's current height in cm."),
  bmi: z.number().optional().describe("Patient's current Body Mass Index."),
});
export type AnalyzeHealthRecordsInput = z.infer<typeof AnalyzeHealthRecordsInputSchema>;

const AnalyzeHealthRecordsOutputSchema = z.object({
  summary: z.string().describe("A brief summary of the patient's current health status based on their stats and records."),
  recommendations: z.array(z.string()).describe("Two actionable recommendations for the patient's health."),
});
export type AnalyzeHealthRecordsOutput = z.infer<typeof AnalyzeHealthRecordsOutputSchema>;

export async function analyzeHealthRecords(input: AnalyzeHealthRecordsInput): Promise<AnalyzeHealthRecordsOutput> {
  return analyzeHealthRecordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeHealthRecordsPrompt',
  input: {schema: AnalyzeHealthRecordsInputSchema},
  output: {schema: AnalyzeHealthRecordsOutputSchema},
  prompt: `You are an AI health assistant. Analyze the provided health stats and medical records.
  
  First, provide a brief 'summary' of the patient's current health status.
  Then, provide exactly two distinct and actionable 'recommendations' to help them improve their health.
  Keep the language clear, encouraging, and easy to understand.

  Patient Stats:
  - Weight: {{{weight}}} kg
  - Height: {{{height}}} cm
  - BMI: {{{bmi}}}

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
