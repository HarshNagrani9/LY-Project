'use client';

import type { HealthRecord } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Stethoscope, TestTube2, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface HealthTimelineProps {
  records: HealthRecord[];
}

const recordIcons = {
  prescription: <Stethoscope className="h-6 w-6 text-blue-500" />,
  lab_report: <TestTube2 className="h-6 w-6 text-green-500" />,
  allergy: <AlertTriangle className="h-6 w-6 text-red-500" />,
  note: <FileText className="h-6 w-6 text-gray-500" />,
};

const recordLabels = {
  prescription: 'Prescription',
  lab_report: 'Lab Report',
  allergy: 'Allergy',
  note: 'Note',
};

export function HealthTimeline({ records }: HealthTimelineProps) {
  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 px-4 border-2 border-dashed rounded-lg">
        <HeartPulseIcon className="h-12 w-12 text-muted-foreground" />
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
            <div className="p-2 bg-secondary rounded-full">
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

function HeartPulseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
    </svg>
  );
}
