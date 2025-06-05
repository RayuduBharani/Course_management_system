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
import { useEffect, useState, useMemo } from "react";
import { DollarSign, Users, TrendingUp, Search, LineChart } from "lucide-react";

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

    const calculateStats = (data: EarningItem[]): EarningStats => {
        const successfulPayments = data.filter(item => 
            item.paymentStatus === "success" && item.orderStatus === "completed"
        );

        const totalSuccessfulAmount = successfulPayments.reduce((sum, item) => 
            sum + parseFloat(item.coursePrice.$numberDecimal || "0"), 0
        );

        const pendingPayments = data.filter(item => 
            item.paymentStatus !== "success" || item.orderStatus !== "completed"
        );

        const pendingAmount = pendingPayments.reduce((sum, item) => 
            sum + parseFloat(item.coursePrice.$numberDecimal || "0"), 0
        );

        // Calculate monthly growth
        const currentMonth = new Date().getMonth();
        const currentYearPayments = successfulPayments.filter(item => {
            const paymentDate = new Date(item.createdAt);
            return paymentDate.getMonth() === currentMonth;
        });

        const lastMonthPayments = successfulPayments.filter(item => {
            const paymentDate = new Date(item.createdAt);
            return paymentDate.getMonth() === (currentMonth - 1);
        });

        const currentMonthTotal = currentYearPayments.reduce((sum, item) => 
            sum + parseFloat(item.coursePrice.$numberDecimal || "0"), 0
        );

        const lastMonthTotal = lastMonthPayments.reduce((sum, item) => 
            sum + parseFloat(item.coursePrice.$numberDecimal || "0"), 0
        );

        const monthlyGrowth = lastMonthTotal === 0 ? 100 : 
            ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;

        return {
            totalAmount: totalSuccessfulAmount,
            successfulOrders: successfulPayments.length,
            pendingAmount: pendingAmount,
            averageOrderValue: successfulPayments.length ? 
                totalSuccessfulAmount / successfulPayments.length : 0,
            monthlyGrowth: monthlyGrowth
        };
    };

    const stats = useMemo(() => calculateStats(earningData), [earningData]);

    const fetchInstructorEarnings = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("http://localhost:8000/instructor/earning/orders", {
                credentials: "include",
            });
            const data: EarningItem[] = await response.json();
            setEarningData(data);
            setFilteredData(data);
        } catch (error) {
            console.error("Error fetching earnings:", error);
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
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                default:
                    return 0;
            }
        });
        setFilteredData(sorted);
    }, [sortBy, filteredData]);

    const getStatusColor = (status: string, paymentStatus: string) => {
        if (paymentStatus !== "success") return "destructive";
        return status === "completed" ? "default" : "secondary";
    };

    return (
        <div className="w-full h-full p-4 md:p-10 space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
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
                        <CardTitle className="text-sm font-medium">Average Order</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹ {stats.averageOrderValue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            Per successful order
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
                        <LineChart className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹ {stats.pendingAmount.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            From incomplete orders
                        </p>
                    </CardContent>
                </Card>
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
                            filteredData.map((data: EarningItem, index) => (
                                <TableRow key={index} className={data.paymentStatus !== "success" ? "opacity-60" : ""}>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusColor(data.orderStatus, data.paymentStatus)}>
                                            {data.orderStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">{data.courseTitle}</TableCell>
                                    <TableCell>{data.userEmail}</TableCell>
                                    <TableCell className="text-right">₹ {data.coursePrice.$numberDecimal}</TableCell>
                                    <TableCell>
                                        <Badge variant={data.paymentStatus === "success" ? "default" : "destructive"}>
                                            {data.paymentStatus}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
