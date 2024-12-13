import Loader from "@/components/Loading";
import { FindTeamMembers } from "@/components/store/slices/lead/teamSlice";
import { AppDispatch, RootState } from "@/components/store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"


export const LeadTeamMembers = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { isLoading, TeamInfo } = useSelector((state: RootState) => state.team)
    console.log(TeamInfo)
    useEffect(() => {
        dispatch(FindTeamMembers())
    }, [])
    if (isLoading) {
        return <Loader />
    }
    return (
        <div className="w-full h-full">
            <div className="w-full h-fit flex items-center  justify-between px-1 max-sm:px-2 max-sm:flex-col max-sm:gap-5">
                <h1 className="text-xl font-bold">Your Team Members</h1>
                <form className="w-[60%] flex gap-5 justify-end max-sm:w-full">
                    <Input
                        name="search"
                        className="w-[60%]  "
                        placeholder="Hinted search text"
                    />
                    <Button type="submit" className="p-5">Search</Button>
                </form>
            </div>
            <div className="w-full h-full py-10 flex justify-center max-sm:px-3">
                <div className="w-[100%] h-fit grid grid-cols-4 grid-flow-row gap-10 max-sm:grid-cols-1 pb-16 max-sm:w-[80%]">

                    {
                        TeamInfo.length > 0 ? (
                            TeamInfo.map((data, index) => {
                                return (
                                    <div key={index} className="w-[100%] h-[14.5rem] border-2 shadow-sm py-2 rounded-md flex flex-col items-center justify-center gap-y-3 overflow-hidden">
                                        <div className="w-[90%]">
                                            <h1 className="font-bold text-foreground text-center truncate">{data.name}</h1>

                                        </div>
                                        <div>
                                            <img
                                                src={data.profileImg}
                                                className="h-20 w-20 flex-shrink-0 rounded-full"
                                                width={10000}
                                                height={1000}
                                                alt="Avatar"
                                            />
                                        </div>
                                        <div className="w-[100%] flex flex-col items-center">
                                            <p className="font-medium text-foreground">{data.teamNum}</p>
                                        </div>

                                        <div className="w-[100%] justify-center flex px-5">
                                            <Dialog>
                                                <DialogTrigger asChild><Button variant="outline">View Profile</Button></DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle className="text-center text-primary">{data.name} <span className="text-foreground">from {data.teamNum}</span></DialogTitle>
                                                        <DialogDescription>
                                                        </DialogDescription>
                                                        {/* <p className="text-lg font-semibold mt-2 text-center">Purchased Courses : {data.courses.length}</p> */}
                                                        <div className="p-3">
                                                            {
                                                                data ?
                                                                data.courses.map((data : any , index)=>{
                                                                    return (
                                                                        <div key={index} className="">
                                                                            <ul className="list-outside flex gap-3 items-center py-2">
                                                                            <i className="fa-solid fa-hand-point-right"></i>
                                                                                <li>{data.course[0].courseId.title} -- <span className="font-bold">Pending</span></li>
                                                                            </ul>
                                                                        </div>
                                                                    )
                                                                }) : <p className="text-primary font-bold text-center animate-pulse">User not purchase any courses</p>
                                                            }
                                                        </div>
                                                    </DialogHeader>
                                                </DialogContent>
                                            </Dialog>

                                        </div>
                                    </div>
                                )
                            })
                        ) : (<div className="w-full h-[500px] col-span-4 row-auto text-center content-center">
                            <h1 className="text-lg font-bold text-primary animate-pulse">Not found your team members</h1>
                        </div>)
                    }

                </div>
            </div>
        </div>
    );
};
