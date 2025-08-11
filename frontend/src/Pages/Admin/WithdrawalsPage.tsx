import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface WithdrawalRequest {
    _id: string;
    amount: number;
    status: 'pending' | 'approved' | 'rejected';
    remarks?: string;
    createdAt: string;
    instructorId: {
        name: string;
        email: string;
        UPI: string;
    };
}

export default function AdminWithdrawalsPage() {
    const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
    const [remarks, setRemarks] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    const fetchWithdrawalRequests = async () => {
        try {
            const response = await fetch("https://course-management-system-2-2wm4.onrender.com/admin/withdrawals", {
                credentials: "include"
            });
            const data = await response.json();
            if (data.success) {
                setWithdrawalRequests(data.withdrawals);
            }
        } catch (error) {
            console.error("Error fetching withdrawal requests:", error);
        }
    };

    useEffect(() => {
        fetchWithdrawalRequests();
    }, []);

    const handleProcessRequest = async (status: 'approved' | 'rejected') => {
        if (!selectedRequest) return;

        setIsLoading(true);
        try {
            const response = await fetch(`https://course-management-system-2-2wm4.onrender.com/admin/withdrawals/${selectedRequest._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    status,
                    remarks
                })
            });

            const data = await response.json();
            if (data.success) {
                toast({
                    title: "Success",
                    description: `Withdrawal request ${status} successfully`
                });
                setIsDialogOpen(false);
                setRemarks("");
                setSelectedRequest(null);
                fetchWithdrawalRequests();
            } else {
                toast({
                    title: "Error",
                    description: data.message,
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error("Error processing withdrawal request:", error);
            toast({
                title: "Error",
                description: "Failed to process withdrawal request",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'default'; // or 'secondary' if you want a different color
            case 'rejected':
                return 'destructive';
            default:
                return 'default';
        }
    };

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader>
                    <CardTitle>Withdrawal Requests</CardTitle>
                    <CardDescription>
                        Manage instructor withdrawal requests
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Instructor</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>UPI ID</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {withdrawalRequests.map((request) => (
                                <TableRow key={request._id}>
                                    <TableCell>
                                        {new Date(request.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{request.instructorId.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {request.instructorId.email}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>₹{request.amount.toFixed(2)}</TableCell>
                                    <TableCell>{request.instructorId.UPI}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusColor(request.status)}>
                                            {request.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {request.status === 'pending' && (
                                            <Dialog open={isDialogOpen && selectedRequest?._id === request._id} 
                                                   onOpenChange={(open) => {
                                                       setIsDialogOpen(open);
                                                       if (!open) setSelectedRequest(null);
                                                   }}>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setSelectedRequest(request)}
                                                    >
                                                        Process
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Process Withdrawal Request</DialogTitle>
                                                        <DialogDescription>
                                                            Amount: ₹{request.amount.toFixed(2)}
                                                            <br />
                                                            UPI ID: {request.instructorId.UPI}
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4 py-4">
                                                        <div className="space-y-2">
                                                            <label>Remarks</label>
                                                            <Textarea
                                                                placeholder="Add remarks..."
                                                                value={remarks}
                                                                onChange={(e) => setRemarks(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end space-x-2">
                                                        <Button
                                                            variant="destructive"
                                                            onClick={() => handleProcessRequest('rejected')}
                                                            disabled={isLoading}
                                                        >
                                                            Reject
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleProcessRequest('approved')}
                                                            disabled={isLoading}
                                                        >
                                                            Approve
                                                        </Button>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        )}
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
