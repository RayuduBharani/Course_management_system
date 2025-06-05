import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { IndianRupee, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface WithdrawalRequest {
    _id: string;
    amount: number;
    status: 'pending' | 'approved' | 'rejected';
    remarks?: string;
    createdAt: string;
}

export default function WithdrawalPage() {
    const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalRequest[]>([]);
    const [amount, setAmount] = useState("");
    const [remarks, setRemarks] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const { toast } = useToast();

    const fetchWithdrawalHistory = async () => {
        try {
            const response = await fetch("http://localhost:8000/instructor/withdrawal/history", {
                credentials: "include"
            });
            const data = await response.json();
            if (data.success) {
                setWithdrawalHistory(data.withdrawals);
            }
        } catch (error) {
            console.error("Error fetching withdrawal history:", error);
        }
    };

    const fetchTotalEarnings = useCallback(async () => {
        try {
            const ordersResponse = await fetch("http://localhost:8000/instructor/earning/orders", {
                credentials: "include"
            });
            const orders = await ordersResponse.json();
              interface Order {
                orderStatus: string;
                coursePrice: {
                    $numberDecimal: string;
                };
            }
            
            const totalEarned = orders.orders.reduce((sum: number, order: Order) => 
                sum + (order.orderStatus === "Approval"
                    ? parseFloat(order.coursePrice.$numberDecimal) 
                    : 0), 0
            );

            const totalWithdrawn = withdrawalHistory.reduce((sum: number, request: WithdrawalRequest) => 
                sum + (request.status === 'approved' ? request.amount : 0), 0
            );

            setTotalEarnings(totalEarned - totalWithdrawn);
        } catch (error) {
            console.error("Error fetching earnings:", error);
        }
    }, [withdrawalHistory]);

    useEffect(() => {
        fetchWithdrawalHistory();
    }, []);

    useEffect(() => {
        fetchTotalEarnings();
    }, [withdrawalHistory, fetchTotalEarnings]);

    const handleSubmit = async () => {
        const amountNum = parseFloat(amount);
        if (!amount || amountNum <= 0) {
            toast({
                title: "Invalid amount",
                description: "Please enter a valid amount",
                variant: "destructive"
            });
            return;
        }

        if (amountNum > totalEarnings) {
            toast({
                title: "Invalid amount",
                description: "Withdrawal amount cannot be greater than available balance",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:8000/instructor/withdrawal/request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    remarks
                })
            });

            const data = await response.json();
            if (data.success) {
                toast({
                    title: "Success",
                    description: "Withdrawal request submitted successfully"
                });
                setIsDialogOpen(false);
                setAmount("");
                setRemarks("");
                fetchWithdrawalHistory();
            } else {
                toast({
                    title: "Error",
                    description: data.message,
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error("Error submitting withdrawal request:", error);
            toast({
                title: "Error",
                description: "Failed to submit withdrawal request",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'secondary';
            case 'rejected':
                return 'destructive';
            default:
                return 'default';
        }
    };

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Withdrawals</h1>
                    <p className="text-muted-foreground">
                        Manage your earnings and withdrawal requests
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>Request Withdrawal</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Request Withdrawal</DialogTitle>
                            <DialogDescription>
                                Available balance: ₹{totalEarnings.toFixed(2)}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label>Amount</label>
                                <Input
                                    type="number"
                                    placeholder="Enter amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label>Remarks (optional)</label>
                                <Textarea
                                    placeholder="Add any remarks..."
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit} disabled={isLoading}>
                                {isLoading ? "Submitting..." : "Submit Request"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Available Balance
                        </CardTitle>
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{totalEarnings.toFixed(2)}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Pending Requests
                        </CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {withdrawalHistory.filter(w => w.status === 'pending').length}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Approved Withdrawals
                        </CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ₹{withdrawalHistory
                                .filter(w => w.status === 'approved')
                                .reduce((sum, w) => sum + w.amount, 0)
                                .toFixed(2)}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Rejected Requests
                        </CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {withdrawalHistory.filter(w => w.status === 'rejected').length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Withdrawal History</CardTitle>
                    <CardDescription>
                        View all your withdrawal requests and their status
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Remarks</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {withdrawalHistory.map((request) => (
                                <TableRow key={request._id}>
                                    <TableCell>
                                        {new Date(request.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>₹{request.amount.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusColor(request.status)}>
                                            {request.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{request.remarks || "-"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}


