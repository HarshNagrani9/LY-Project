'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

const placeholderPatients = [
  { id: '1', name: 'John Doe', lastVisit: '2023-10-26', status: 'Active' },
  { id: '2', name: 'Jane Smith', lastVisit: '2023-09-15', status: 'Active' },
  { id: '3', name: 'Sam Wilson', lastVisit: '2023-11-01', status: 'New' },
  { id: '4', name: 'Alice Johnson', lastVisit: '2023-08-05', status: 'Discharged' },
];

export default function DoctorDashboardPage() {
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>My Patients</CardTitle>
                    <CardDescription>A list of patients currently under your care.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Last Visit</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {placeholderPatients.map((patient) => (
                                <TableRow key={patient.id}>
                                    <TableCell className="font-medium">{patient.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={patient.status === 'Active' ? 'default' : patient.status === 'New' ? 'secondary' : 'outline'}>
                                            {patient.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{patient.lastVisit}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Patient options</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
