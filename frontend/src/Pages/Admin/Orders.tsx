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
import { useEffect, useState } from "react";

export default function Orders() {
    const [earningData, setEarningData] = useState([]);
    const [totalAmount, setTotalAmount] = useState<number>(0);

    const fetchInstructorEarnings = async () => {
        const response = await fetch("https://course-management-system-il4f.onrender.com/admin/course/orders", {
            credentials: "include",
        });
        const data = await response.json();
        setEarningData(data.reverse());
        const total = data.reduce((sum: number, item: { coursePrice: { $numberDecimal: any }; }) => sum + parseFloat(item.coursePrice.$numberDecimal || 0), 0);
        setTotalAmount(total);
    };

    useEffect(() => {
        fetchInstructorEarnings();
    }, []);

    return (
        <div className="w-full h-full p-4 sm:p-10">
            <div className="w-full h-[20%] flex flex-col sm:flex-row justify-between sm:justify-around">
                <div className="justify-center items-center p-4 w-full sm:w-[30%] h-full rounded-lg flex border-2 mb-4 sm:mb-0">
                    <p className="font-bold text-lg">Total Earning<span className="pl-3">:</span></p>
                    <p className="font-medium text-primary pl-3">{totalAmount} /-</p>
                </div>
                <div className="justify-center items-center p-4 w-full sm:w-[30%] h-full rounded-lg flex border-2">
                    <p className="font-bold text-lg">Total Orders<span className="pl-3">:</span></p>
                    <p className="font-medium text-primary pl-3">{earningData.length}</p>
                </div>
            </div>

            <Separator className="mt-4 h-0.5 max-sm:mt-4" />

            <div className="w-full h-full mt-4">
                <Table>
                    <TableCaption>Earnings Details</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px] text-md text-primary">No</TableHead>
                            <TableHead className="text-md text-primary">Status</TableHead>
                            <TableHead className="text-md text-primary">Course Name</TableHead>
                            <TableHead className="text-md text-primary">User Email</TableHead>
                            <TableHead className="text-md text-primary">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {earningData.map((data: any, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell>{data.orderStatus}</TableCell>
                                <TableCell>{data.courseTitle}</TableCell>
                                <TableCell>{data.userEmail}</TableCell>
                                <TableCell>{data.coursePrice.$numberDecimal} /-</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
