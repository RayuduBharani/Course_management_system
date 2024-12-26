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
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

export default function InstructorDetails() {
    const navigate = useNavigate();
    const [earningData, setEarningData] = useState([]);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const param = location.pathname.split("/")[3];

    const fetchInstructorEarnings = async () => {
        const response = await fetch(`https://cms-nij0.onrender.com/admin/instructor/oneuser/${param}`, {
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

            <Separator className="mt-4 h-0.5" />

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
                            <TableHead className="text-md text-primary"> </TableHead>
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
                                <TableCell>
                                    <Button
                                        onClick={() => {
                                            navigate(`/admin/pay/${data._id}`);
                                        }}
                                    >
                                        Pay
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
