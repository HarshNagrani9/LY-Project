'use client';

import type { HealthRecord } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Stethoscope, TestTube2, AlertTriangle, HeartPulse } from 'lucide-react';
import { format } from 'date-fns';

interface HealthTimelineProps {
  records: HealthRecord[];
}

const recordIcons: Record<HealthRecord['type'], React.ReactElement> = {
  prescription: <Stethoscope className="h-6 w-6 text-blue-500" />,
  lab_report: <TestTube2 className="h-6 w-6 text-green-500" />,
  allergy: <AlertTriangle className="h-6 w-6 text-red-500" />,
  note: <FileText className="h-6 w-6 text-gray-500" />,
};

const recordLabels: Record<HealthRecord['type'], string> = {
  prescription: 'Prescription',
  lab_report: 'Lab Report',
  allergy: 'Allergy',
  note: 'Note',
};

export function HealthTimeline({ records }: HealthTimelineProps) {
  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 px-4 border-2 border-dashed rounded-lg">
        <HeartPulse className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No Health Records Yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Click &quot;Add Record&quot; to start building your health timeline.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4">
      {records.map((record) => (
        <Card key={record.id}>
          <CardHeader className="flex flex-row items-start gap-4">
            <div className="p-2 bg-secondary rounded-full mt-1">
              {recordIcons[record.type]}
            </div>
            <div className='flex-1'>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{record.title}</CardTitle>
                <Badge variant="outline">{recordLabels[record.type]}</Badge>
              </div>
              <CardDescription>
                {format(new Date(record.date), 'MMMM d, yyyy')}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {record.content}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
