'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { searchPatientsByEmail, connectDoctorToPatient } from '@/lib/actions';
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
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        const debounceSearch = setTimeout(async () => {
            if (searchTerm.trim().length > 2) {
                setLoading(true);
                setHasSearched(true);
                const foundPatients = await searchPatientsByEmail(searchTerm.trim());
                setResults(foundPatients);
                setLoading(false);
            } else {
                setResults([]);
                if (hasSearched) {
                    setHasSearched(false);
                }
            }
        }, 500); // 500ms delay

        return () => clearTimeout(debounceSearch);
    }, [searchTerm, hasSearched]);

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
                <div className="flex items-center gap-2 mb-6">
                     <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="patient@example.com"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 pl-10"
                        />
                    </div>
                </div>

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

                     {!loading && results.length === 0 && hasSearched && (
                         <div className="text-center py-10 border-2 border-dashed rounded-lg">
                            <h3 className="text-lg font-semibold">No Patients Found</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                No patient found with that email. Please check the spelling and try again.
                            </p>
                        </div>
                    )}

                     {!loading && !hasSearched && (
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
