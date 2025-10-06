'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { getPatientRecordsForDoctor, getUserDocument } from '@/lib/actions';
import type { HealthRecord, UserDocument } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Logo from '@/components/icons/Logo';
import { AlertCircle, FileText, Stethoscope, TestTube2, AlertTriangle, Loader2, Heart, Activity, Droplets, Ruler, Weight, Link as LinkIcon, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';


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

export default function ViewPatientRecordsPage() {
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const patientId = params.patientId as string;
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [patient, setPatient] = useState<UserDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
        if (!patientId || !user?.uid) return;
      try {
        setLoading(true);
        setError(null);
        // Fetch patient document and records in parallel
        const [patientRecords, patientDoc] = await Promise.all([
            getPatientRecordsForDoctor(user.uid, patientId),
            getUserDocument(patientId)
        ]);

        setRecords(patientRecords);
        setPatient(patientDoc);

      } catch (err: any) {
        setError(err.message || "Failed to fetch records.");
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading) {
        fetchRecords();
    }
  }, [patientId, user, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <AlertCircle className="w-12 h-12 mx-auto text-destructive mb-4" />
            <CardTitle className="text-2xl text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-secondary p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <header className="flex flex-col sm:flex-row items-center justify-between mb-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-0">
              <Logo className="w-10 h-10" />
              <h1 className="text-2xl font-bold font-headline">MediVault</h1>
            </div>
            <div className="text-center sm:text-right">
              <h2 className="text-xl font-semibold">Patient Health Record</h2>
              <p className="text-sm text-muted-foreground">For professional review only.</p>
            </div>
          </header>

          {patient && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Patient Summary</CardTitle>
                <CardDescription>{patient.email}</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-background rounded-lg">
                  <Weight className="mx-auto mb-1 h-6 w-6 text-primary" />
                  <p className="text-xs text-muted-foreground">Weight</p>
                  <p className="font-bold">{patient.weight || 'N/A'} kg</p>
                </div>
                <div className="p-3 bg-background rounded-lg">
                  <Ruler className="mx-auto mb-1 h-6 w-6 text-primary" />
                  <p className="text-xs text-muted-foreground">Height</p>
                  <p className="font-bold">{patient.height || 'N/A'} cm</p>
                </div>
                <div className="p-3 bg-background rounded-lg">
                  <p className="font-bold text-2xl">{patient.bmi || 'N/A'}</p>
                  <p className="text-xs text-muted-foreground">BMI</p>
                </div>
                <div className="p-3 bg-background rounded-lg">
                  <Droplets className="mx-auto mb-1 h-6 w-6 text-destructive" />
                  <p className="text-xs text-muted-foreground">Blood Group</p>
                  <p className="font-bold">{patient.bloodGroup || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>
          )}


          <main className="space-y-6">
            {records.map((record) => (
              <Link href={`/doctor/diagnose/${record.id}`} key={record.id} className="block group">
                <Card className="transition-all duration-200 group-hover:shadow-lg group-hover:border-primary">
                    <CardHeader className="flex flex-row items-start gap-4">
                    <div className="p-2 bg-background rounded-full mt-1">{recordIcons[record.type]}</div>
                    <div className='flex-1'>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{record.title}</CardTitle>
                            <Badge variant={record.diagnosis ? 'default' : 'outline'}>{record.diagnosis ? 'Diagnosed' : recordLabels[record.type]}</Badge>
                        </div>
                        <CardDescription>
                            {format(new Date(record.date), 'MMMM d, yyyy')}
                        </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                    {(record.bloodPressure || record.pulseRate) && (
                        <div className="mb-4 grid grid-cols-2 gap-4">
                            {record.bloodPressure && (
                            <div className="flex items-center gap-2 p-2 bg-background rounded-lg">
                                <Heart className="h-5 w-5 text-red-500" />
                                <div>
                                <p className="text-xs text-muted-foreground">Blood Pressure</p>
                                <p className="font-semibold text-sm">{record.bloodPressure}</p>
                                </div>
                            </div>
                            )}
                            {record.pulseRate && (
                            <div className="flex items-center gap-2 p-2 bg-background rounded-lg">
                                <Activity className="h-5 w-5 text-blue-500" />
                                <div>
                                <p className="text-xs text-muted-foreground">Pulse Rate</p>
                                <p className="font-semibold text-sm">{record.pulseRate} <span className='text-xs'>BPM</span></p>
                                </div>
                            </div>
                            )}
                        </div>
                        )}
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{record.content}</p>
                    {record.attachmentUrl && (
                        <div className="mt-4">
                            <Button asChild variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                            <a href={record.attachmentUrl} target="_blank" rel="noopener noreferrer">
                                <LinkIcon className="mr-2 h-4 w-4" />
                                View Attachment
                            </a>
                            </Button>
                        </div>
                        )}
                    </CardContent>
                    <CardFooter>
                       <Button variant="outline" className="w-full">
                         <Pencil className="mr-2" />
                         {record.diagnosis ? 'Edit Diagnosis' : 'Add Diagnosis'}
                       </Button>
                    </CardFooter>
                </Card>
              </Link>
            ))}
             {records.length === 0 && (
                <Card>
                    <CardContent className="p-10 flex flex-col items-center justify-center text-center">
                        <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold">No Records Available</h3>
                        <p className="text-muted-foreground">This patient has not added any health records yet.</p>
                    </CardContent>
                </Card>
            )}
          </main>
          <footer className="text-center mt-8 text-xs text-muted-foreground">
             &copy; {new Date().getFullYear()} MediVault. Secure Health Sharing.
          </footer>
        </div>
      </div>
  );
}
