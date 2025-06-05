import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState, useMemo, useCallback } from "react";
import { DollarSign, Users, TrendingUp, Search, ArrowRight, Wallet, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface EarningItem {
    courseTitle: string;
    userEmail: string;
    orderStatus: string;
    coursePrice: {
        $numberDecimal: string;
    };
    paymentStatus: string;
    createdAt: string;
}

interface EarningStats {
    totalAmount: number;
    successfulOrders: number;
    pendingAmount: number;
    averageOrderValue: number;
    monthlyGrowth: number;
}

export default function EarningPage() {
    const [earningData, setEarningData] = useState<EarningItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("date");
    const [filteredData, setFilteredData] = useState<EarningItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [availableBalance, setAvailableBalance] = useState(0);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [withdrawalRequests, setWithdrawalRequests] = useState([]);

    const calculateStats = useCallback((data: EarningItem[]): EarningStats => {
        // Handle invalid input
        if (!Array.isArray(data)) {
            return {
                totalAmount: 0,
                successfulOrders: 0,
                pendingAmount: 0,
                averageOrderValue: 0,
                monthlyGrowth: 0
            };
        }        // Filter successful payments, ensuring all required fields exist
        const successfulPayments = data.filter(item => 
            item && 
            item.orderStatus === "Approval" &&  // Only check orderStatus since Approval means success
            item.coursePrice &&
            typeof item.coursePrice.$numberDecimal === 'string'
        );

        // Calculate total amount from successful payments
        const totalSuccessfulAmount = successfulPayments.reduce((sum, item) => 
            sum + parseFloat(item.coursePrice.$numberDecimal || "0"), 0
        );        // Calculate pending amount (only count orders with Pending status)
        const pendingAmount = data.reduce((sum, item) => {
            if (item && item.coursePrice && item.orderStatus === "Pending") {
                return sum + parseFloat(item.coursePrice.$numberDecimal || "0");
            }
            return sum;
        }, 0);

        // Calculate monthly statistics
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const currentMonthPayments = successfulPayments.filter(item => 
            new Date(item.createdAt) >= currentMonthStart
        );
        
        const lastMonthPayments = successfulPayments.filter(item => 
            new Date(item.createdAt) >= lastMonthStart && 
            new Date(item.createdAt) < currentMonthStart
        );

        const currentMonthTotal = currentMonthPayments.reduce((sum, item) => 
            sum + parseFloat(item.coursePrice.$numberDecimal || "0"), 0
        );

        const lastMonthTotal = lastMonthPayments.reduce((sum, item) => 
            sum + parseFloat(item.coursePrice.$numberDecimal || "0"), 0
        );

        // Calculate monthly growth percentage
        const monthlyGrowth = lastMonthTotal === 0 ? 
            (currentMonthTotal > 0 ? 100 : 0) : 
            ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;

        return {
            totalAmount: totalSuccessfulAmount,
            successfulOrders: successfulPayments.length,
            pendingAmount: pendingAmount,
            averageOrderValue: successfulPayments.length ? 
                totalSuccessfulAmount / successfulPayments.length : 0,
            monthlyGrowth: monthlyGrowth
        };
    }, []);

    const stats = useMemo(() => calculateStats(earningData), [calculateStats, earningData]);

    const fetchInstructorEarnings = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetch("http://localhost:8000/instructor/earning/orders", {
                credentials: "include",
            });
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch earnings');
            }

            // The backend always sends orders, even if empty
            const orders = result.orders || [];
            setEarningData(orders);
            setFilteredData(orders);
            setAvailableBalance(result.availableBalance || 0);
            setWithdrawalRequests(result.withdrawalRequests || []);
        } catch (error) {
            console.error("Error fetching earnings:", error);
            setError(error instanceof Error ? error.message : 'Failed to fetch earnings');
            setEarningData([]);
            setFilteredData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInstructorEarnings();
    }, []);

    useEffect(() => {
        const filtered = earningData.filter((item: EarningItem) => 
            item.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchTerm, earningData]);

    useEffect(() => {
        const sorted = [...filteredData].sort((a: EarningItem, b: EarningItem) => {
            switch (sortBy) {
                case "amount":
                    return parseFloat(b.coursePrice.$numberDecimal) - parseFloat(a.coursePrice.$numberDecimal);
                case "status":
                    return a.orderStatus.localeCompare(b.orderStatus);
                case "date":
                default:
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
        });
        setFilteredData(sorted);
    }, [sortBy, filteredData]);    const getStatusColor = (orderStatus: string) => {
        if (orderStatus === "Approval") return "default";
        if (orderStatus === "Pending") return "secondary";
        return "destructive";
    };

    return (
        <div className="w-full h-full p-4 md:p-10 space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹ {stats.totalAmount.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.monthlyGrowth > 0 ? "+" : ""}{stats.monthlyGrowth.toFixed(1)}% from last month
                        </p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Successful Orders</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.successfulOrders}</div>
                        <p className="text-xs text-muted-foreground">
                            From {earningData.length} total orders
                        </p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹ {availableBalance.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            Ready for withdrawal
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹ {stats.averageOrderValue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            Per successful order
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end mb-4">
                <Button asChild>
                    <Link to="/instructor/withdrawals">
                        Request Withdrawal <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search courses or emails..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="date">Sort by Date</SelectItem>
                        <SelectItem value="amount">Sort by Amount</SelectItem>
                        <SelectItem value="status">Sort by Status</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {isLoading ? (
                <div className="flex justify-center items-center h-[200px]">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableCaption>Earnings Details</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">No</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Course Name</TableHead>
                                <TableHead>User Email</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead>Payment Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                filteredData.map((data: EarningItem, index) => (                                    <TableRow key={index} className={data.orderStatus !== "Approval" ? "opacity-60" : ""}>
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusColor(data.orderStatus)}>
                                                {data.orderStatus}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-medium">{data.courseTitle}</TableCell>
                                        <TableCell>{data.userEmail}</TableCell>
                                        <TableCell className="text-right">₹ {data.coursePrice.$numberDecimal}</TableCell>
                                        <TableCell>
                                            <Badge variant={data.orderStatus === "Approval" ? "default" : "secondary"}>
                                                {data.orderStatus === "Approval" ? "Success" : "Pending"}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
