import { getSharedRecords } from '@/lib/firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Logo from '@/components/icons/Logo';
import { AlertCircle, FileText, Stethoscope, TestTube2, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

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

export default async function SharePage({ params }: { params: { shareId: string } }) {
  try {
    const { records } = await getSharedRecords(params.shareId);

    return (
      <div className="min-h-screen bg-secondary p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <header className="flex flex-col sm:flex-row items-center justify-between mb-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-0">
              <Logo className="w-10 h-10" />
              <h1 className="text-2xl font-bold font-headline">MediSafe</h1>
            </div>
            <div className="text-center sm:text-right">
              <h2 className="text-xl font-semibold">Shared Health Record</h2>
              <p className="text-sm text-muted-foreground">For professional review only.</p>
            </div>
          </header>

          <main className="space-y-6">
            {records.map((record) => (
              <Card key={record.id}>
                <CardHeader className="flex flex-row items-start gap-4">
                  <div className="p-2 bg-background rounded-full mt-1">{recordIcons[record.type]}</div>
                   <div className='flex-1'>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{record.title}</CardTitle>
                        <Badge variant="default">{recordLabels[record.type]}</Badge>
                    </div>
                    <CardDescription>
                        {format(new Date(record.date), 'MMMM d, yyyy')}
                    </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{record.content}</p>
                </CardContent>
              </Card>
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
             &copy; {new Date().getFullYear()} MediSafe. Secure Health Sharing.
          </footer>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="flex h-screen items-center justify-center text-center p-4">
        <Card className="max-w-md">
            <CardHeader>
                <AlertCircle className="w-12 h-12 mx-auto text-destructive mb-4" />
                <CardTitle className="text-2xl text-destructive">Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
                <p>This share link is invalid, has expired, or you do not have permission to view these records.</p>
            </CardContent>
        </Card>
      </div>
    );
  }
}
