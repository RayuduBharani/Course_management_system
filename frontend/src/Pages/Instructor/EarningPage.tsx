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

export default function EarningPage() {
    const [earningData, setEarningData] = useState([]);
    const [totalAmount, setTotalAmount] = useState<number>(0);

    const fetchInstructorEarnings = async () => {
        const response = await fetch("https://cms-nij0.onrender.com/instructor/earning/orders", {
            credentials: "include",
        });
        const data = await response.json();
        setEarningData(data);
        const total = data.reduce((sum: number, item: { coursePrice: { $numberDecimal: any }; }) => sum + parseFloat(item.coursePrice.$numberDecimal || 0), 0);
        setTotalAmount(total);
    };

    useEffect(() => {
        fetchInstructorEarnings();
    }, []);

    return (
        <div className="w-full h-full p-4 md:p-10">
            <div className="w-full h-[20%] flex flex-wrap justify-around gap-4 md:gap-8">
                <div className="p-4 w-full md:w-[30%] h-full rounded-lg flex border-2 justify-center items-center">
                    <p className="font-bold text-lg">
                        Total Earning<span className="pl-3">:</span>
                    </p>
                    <p className="font-medium text-primary pl-3">{totalAmount} /-</p>
                </div>
                <div className="p-4 w-full md:w-[30%] h-full rounded-lg flex border-2 justify-center items-center">
                    <p className="font-bold text-lg">
                        Total Orders<span className="pl-3">:</span>
                    </p>
                    <p className="font-medium text-primary pl-3">{earningData.length}</p>
                </div>
            </div>
            <Separator className="mt-4 h-0.5 max-md:mt-40 max-sm:mt-52" />
            <div className="w-full h-full mt-6">
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
