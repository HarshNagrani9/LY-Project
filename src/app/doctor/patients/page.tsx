'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { searchPatientsByEmail, connectDoctorToPatient } from '@/lib/firebase/firestore';
import type { UserDocument } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, UserPlus, CheckCircle, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function FindPatientsPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<UserDocument[]>([]);
    const [loading, setLoading] = useState(false);
    const [connected, setConnected] = useState<string[]>([]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;
        setLoading(true);
        const foundPatients = await searchPatientsByEmail(searchTerm.trim());
        setResults(foundPatients);
        setLoading(false);
    };

    const handleConnect = async (patientId: string) => {
        if (!user?.uid) return;
        const result = await connectDoctorToPatient(user.uid, patientId);
        if (result.success) {
            toast({
                title: 'Success',
                description: 'Patient connected successfully!',
            });
            setConnected(prev => [...prev, patientId]);
        } else {
            toast({
                title: 'Error',
                description: result.error,
                variant: 'destructive',
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Find Patients</CardTitle>
                <CardDescription>Search for patients by their email address to connect with them.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSearch} className="flex items-center gap-2 mb-6">
                    <Input
                        placeholder="patient@example.com"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1"
                    />
                    <Button type="submit" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : <Search />}
                        <span className="ml-2 hidden sm:inline">Search</span>
                    </Button>
                </form>

                <div className="space-y-4">
                    {loading && <div className="flex justify-center"><Loader2 className="animate-spin" /></div>}
                    {!loading && results.length > 0 && (
                        <ul className="divide-y border rounded-md">
                            {results.map((patient) => (
                                <li key={patient.uid} className="flex items-center justify-between p-4">
                                    <span className="font-medium">{patient.email}</span>
                                    <Button
                                        size="sm"
                                        onClick={() => handleConnect(patient.uid)}
                                        disabled={connected.includes(patient.uid)}
                                    >
                                        {connected.includes(patient.uid) ? (
                                            <>
                                                <CheckCircle className="mr-2" /> Connected
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="mr-2" /> Connect
                                            </>
                                        )}
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )}
                     {!loading && results.length === 0 && searchTerm && (
                         <div className="text-center py-10 border-2 border-dashed rounded-lg">
                            <h3 className="text-lg font-semibold">No Patients Found</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                No patient found with that email. Please check the spelling and try again.
                            </p>
                        </div>
                    )}
                     {!loading && results.length === 0 && !searchTerm && (
                         <div className="text-center py-10 border-2 border-dashed rounded-lg">
                            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="text-lg font-semibold mt-4">Search for a patient</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Enter a patient's email address above to get started.
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}