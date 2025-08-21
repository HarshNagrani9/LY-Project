'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getPendingConnectionRequests, updateConnectionRequest } from '@/lib/actions';
import type { ConnectionRequest } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Check, X, BellOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ConnectionRequests() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [requests, setRequests] = useState<ConnectionRequest[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = useCallback(async () => {
        if (user?.uid) {
            setLoading(true);
            const pendingRequests = await getPendingConnectionRequests(user.uid);
            setRequests(pendingRequests);
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleUpdateRequest = async (requestId: string, status: 'approved' | 'denied') => {
        const result = await updateConnectionRequest(requestId, status);
        if (result.success) {
            toast({
                title: 'Success',
                description: `Request has been ${status}.`,
            });
            fetchRequests(); // Refresh the list
        } else {
            toast({
                title: 'Error',
                description: result.error,
                variant: 'destructive',
            });
        }
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Connection Requests</CardTitle>
                </CardHeader>
                <CardContent className='flex justify-center items-center py-10'>
                    <Loader2 className="animate-spin" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Connection Requests</CardTitle>
                <CardDescription>Doctors who want to view your records.</CardDescription>
            </CardHeader>
            <CardContent>
                {requests.length > 0 ? (
                    <ul className="space-y-3">
                        {requests.map((req) => (
                            <li key={req.id} className="flex items-center justify-between p-3 bg-secondary rounded-md">
                                <div>
                                    <p className="text-sm font-medium">{req.doctorEmail}</p>
                                    <p className="text-xs text-muted-foreground">Wants to connect</p>
                                </div>
                                <div className='flex gap-2'>
                                    <Button size="icon" variant="outline" className='h-8 w-8' onClick={() => handleUpdateRequest(req.id, 'denied')}>
                                        <X className="h-4 w-4 text-destructive" />
                                    </Button>
                                    <Button size="icon" className='h-8 w-8' onClick={() => handleUpdateRequest(req.id, 'approved')}>
                                        <Check className="h-4 w-4" />
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-6 border-2 border-dashed rounded-lg">
                        <BellOff className="mx-auto h-8 w-8 text-muted-foreground" />
                        <h3 className="text-base font-semibold mt-3">No Pending Requests</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                            You have no new connection requests.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
