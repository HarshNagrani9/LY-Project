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
  description: z.string().describe('The main description/content of the health record.'),
  recordType: z.string().describe('Type of health record (prescription, lab_report, allergy, note).'),
  weight: z.number().optional().describe("Patient's current weight in kg."),
  height: z.number().optional().describe("Patient's current height in cm."),
  bmi: z.number().optional().describe("Patient's current Body Mass Index."),
});

const AnalyzeAttachmentInputSchema = z.object({
  attachmentText: z.string().describe('Text content extracted from PDF attachment.'),
  recordType: z.string().describe('Type of health record (prescription, lab_report, allergy, note).'),
  weight: z.number().optional().describe("Patient's current weight in kg."),
  height: z.number().optional().describe("Patient's current height in cm."),
  bmi: z.number().optional().describe("Patient's current Body Mass Index."),
});
export type AnalyzeHealthRecordsInput = z.infer<typeof AnalyzeHealthRecordsInputSchema>;
export type AnalyzeAttachmentInput = z.infer<typeof AnalyzeAttachmentInputSchema>;

const AnalysisOutputSchema = z.object({
  summary: z.string().describe("Health analysis summary."),
  recommendations: z.array(z.string()).describe("Actionable health recommendations."),
});

export type AnalysisOutput = z.infer<typeof AnalysisOutputSchema>;

export async function analyzeHealthRecords(input: AnalyzeHealthRecordsInput): Promise<AnalysisOutput> {
  return analyzeHealthRecordsFlow(input);
}

export async function analyzeAttachment(input: AnalyzeAttachmentInput): Promise<AnalysisOutput> {
  return analyzeAttachmentFlow(input);
}

const descriptionPrompt = ai.definePrompt({
  name: 'analyzeDescriptionPrompt',
  input: {schema: AnalyzeHealthRecordsInputSchema},
  output: {schema: AnalysisOutputSchema},
  prompt: `You are an AI health assistant. Analyze the provided health record description.

  Patient Stats:
  - Weight: {{{weight}}} kg
  - Height: {{{height}}} cm
  - BMI: {{{bmi}}}

  Record Type: {{{recordType}}}

  Description:
  {{{description}}}

  Provide:
  1. A detailed health analysis based on the description provided
  2. 3-4 actionable health recommendations
  3. Keep language clear, encouraging, and medically appropriate
  `,
});

const attachmentPrompt = ai.definePrompt({
  name: 'analyzeAttachmentPrompt',
  input: {schema: AnalyzeAttachmentInputSchema},
  output: {schema: AnalysisOutputSchema},
  prompt: `You are an AI health assistant. Analyze the provided health record attachment content.

  Patient Stats:
  - Weight: {{{weight}}} kg
  - Height: {{{height}}} cm
  - BMI: {{{bmi}}}

  Record Type: {{{recordType}}}

  Attachment Content:
  {{{attachmentText}}}

  Provide:
  1. A detailed health analysis based on the attachment content
  2. 3-4 actionable health recommendations specific to the attachment
  3. Keep language clear, encouraging, and medically appropriate
  4. Focus specifically on the medical information found in the attachment
  `,
});

const analyzeHealthRecordsFlow = ai.defineFlow(
  {
    name: 'analyzeHealthRecordsFlow',
    inputSchema: AnalyzeHealthRecordsInputSchema,
    outputSchema: AnalysisOutputSchema,
  },
  async input => {
    const {output} = await descriptionPrompt(input);
    return output!;
  }
);

const analyzeAttachmentFlow = ai.defineFlow(
  {
    name: 'analyzeAttachmentFlow',
    inputSchema: AnalyzeAttachmentInputSchema,
    outputSchema: AnalysisOutputSchema,
  },
  async input => {
    const {output} = await attachmentPrompt(input);
    return output!;
  }
);
