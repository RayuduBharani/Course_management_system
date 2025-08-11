import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import {
    DollarSign,
    BookOpen,
    Users,
    BarChart,
    TrendingUp,
    Search,
} from "lucide-react";
import { Input } from "../ui/input";

interface EarningData {
    _id: string;
    orderStatus: "Pending" | "Approval" | "Rejected";
    courseTitle: string;
    userEmail: string;
    coursePrice: {
        $numberDecimal: string;
    };
    paymentMethod: string;
    orderDate: string;
}

interface InstructorProfile {
    name: string;
    email: string;
    profileImg: string;
    branch: string;
    college: string;
    gitHub: string;
    linkedIn: string;
    courseId: string[];
    rollNumber: string;
}

export default function InstructorDetails() {
    const navigate = useNavigate();
    const [earningData, setEarningData] = useState<EarningData[]>([]);
    const [filteredData, setFilteredData] = useState<EarningData[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [instructor, setInstructor] = useState<InstructorProfile | null>(null);
    const param = location.pathname.split("/")[3];    const fetchInstructorEarnings = useCallback(async () => {
        try {
            const response = await fetch(`https://course-management-system-2-2wm4.onrender.com/admin/instructor/oneuser/${param}`, {
                credentials: "include",
            });
            const data = await response.json();
            setEarningData(data);
            const total = data.reduce((sum: number, item: EarningData) => 
                sum + parseFloat(item.coursePrice.$numberDecimal || "0"), 0
            );
            setTotalAmount(total);
        } catch (error) {
            console.error("Error fetching earnings:", error);
        }
    }, [param]);

    const fetchInstructorProfile = useCallback(async () => {
        try {
            const response = await fetch(`https://course-management-system-2-2wm4.onrender.com/admin/instructor/profile/${param}`, {
                credentials: "include",
            });
            const data = await response.json();
            setInstructor(data);
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    }, [param]);    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([
                fetchInstructorEarnings(),
                fetchInstructorProfile()
            ]);
        };
        fetchData();
    }, [fetchInstructorEarnings, fetchInstructorProfile]);useEffect(() => {
        // Filter data based on search query
        const filtered = earningData.filter(data => {
            const query = searchQuery.toLowerCase();
            const courseTitle = data?.courseTitle?.toLowerCase() || '';
            const userEmail = data?.userEmail?.toLowerCase() || '';
            const orderStatus = data?.orderStatus?.toLowerCase() || '';
            
            return courseTitle.includes(query) ||
                   userEmail.includes(query) ||
                   orderStatus.includes(query);
        });
        setFilteredData(filtered);
    }, [searchQuery, earningData]);

    const stats = [
        {
            icon: <DollarSign className="h-5 w-5 text-green-600" />,
            value: `₹${totalAmount.toFixed(2)}`,
            label: "Total Earnings",
            color: "bg-green-100",
            textColor: "text-green-700"
        },
        {
            icon: <BookOpen className="h-5 w-5 text-blue-600" />,
            value: instructor?.courseId.length || 0,
            label: "Total Courses",
            color: "bg-blue-100",
            textColor: "text-blue-700"
        },
        {
            icon: <Users className="h-5 w-5 text-purple-600" />,
            value: earningData.length,
            label: "Total Orders",
            color: "bg-purple-100",
            textColor: "text-purple-700"
        },
        {
            icon: <TrendingUp className="h-5 w-5 text-orange-600" />,
            value: `₹${(totalAmount / (earningData.length || 1)).toFixed(2)}`,
            label: "Avg. Order Value",
            color: "bg-orange-100",
            textColor: "text-orange-700"
        }
    ];

    const orderStatusColors = {
        Pending: "bg-yellow-100 text-yellow-800",
        Approval: "bg-green-100 text-green-800",
        Rejected: "bg-red-100 text-red-800"
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Instructor Profile */}
                {instructor && (
                    <Card className="border-0 shadow-xl">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                    <img 
                                        src={instructor.profileImg} 
                                        alt={instructor.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{instructor.name}</h1>
                                    <p className="text-gray-500">{instructor.email}</p>
                                    <div className="flex gap-2 mt-2">
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                            {instructor.branch}
                                        </Badge>
                                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                                            {instructor.rollNumber}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <Card key={index} className="border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${stat.color}`}>
                                        {stat.icon}
                                    </div>
                                    <div>
                                        <p className={`text-2xl font-bold ${stat.textColor}`}>
                                            {stat.value}
                                        </p>
                                        <p className="text-sm text-gray-500">{stat.label}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Earnings Table */}
                <Card className="border-0 shadow-xl">
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Earnings History</h2>
                                    <p className="text-sm text-gray-500">Detailed view of all transactions</p>
                                </div>
                                <BarChart className="h-5 w-5 text-gray-400" />
                            </div>

                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="Search by course, student email, or status..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 w-full max-w-sm"
                                />
                            </div>
                        </div>
                        
                        <ScrollArea className="h-[400px] rounded-md mt-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[60px]">No</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Course</TableHead>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredData.map((data, index) => (
                                        <TableRow key={data._id}>
                                            <TableCell className="font-medium">{index + 1}</TableCell>
                                            <TableCell>
                                                <Badge 
                                                    variant="secondary"
                                                    className={orderStatusColors[data.orderStatus]}
                                                >
                                                    {data.orderStatus}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="max-w-[200px] truncate">
                                                {data.courseTitle}
                                            </TableCell>
                                            <TableCell className="max-w-[200px] truncate">
                                                {data.userEmail}
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                                ₹{parseFloat(data.coursePrice.$numberDecimal).toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(data.orderDate).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => navigate(`/admin/pay/${data._id}`)}
                                                >
                                                    Process Payment
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
