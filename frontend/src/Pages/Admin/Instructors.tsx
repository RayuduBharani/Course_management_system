import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminInstructors() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);

    async function fetchinstructors() {
        const response = await fetch('https://course-management-system-il4f.onrender.com/admin/instructor/all');
        const data = await response.json();
        console.log(data);
        setData(data);
    }

    useEffect(() => {
        fetchinstructors();
    }, []);

    return (
        <div className="w-full h-full">
            <div className="w-full h-[10%] px-2 flex justify-between">
                <p className="font-bold text-xl">Instructors</p>
            </div>

            <div className="w-full h-[97%] pb-10 overflow-hidden overflow-y-scroll grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {data.map((d: any, index) => (
                    <div
                        key={index}
                        className="border-2 h-fit rounded-lg p-3 flex flex-col items-center gap-3"
                    >
                        <p className="text-center font-bold text-lg truncate">{d.name}</p>
                        <div className="rounded-full bg-black w-[6rem] h-[6rem]">
                            <img className="w-full h-full rounded-full" src={d.profileImg} alt="" />
                        </div>
                        <Button
                            onClick={() => {
                                navigate(`/Admin/courseProviders/${d._id}`);
                            }}
                            className="w-full"
                        >
                            View Profile
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
