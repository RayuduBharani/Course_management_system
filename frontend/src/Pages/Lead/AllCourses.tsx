import { Button } from "@/components/ui/button";
import Img from "../../assets/Img.png"
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/components/store/store";
import { fetchAllCourses } from "@/components/store/slices/CommonSlice";
import Loader from "@/components/Loading";
import { Link } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function LeadAllcourses() {
    const dispatch = useDispatch<AppDispatch>()
    // const [isPurchased , setIsPurchased] = useState<string[] | undefined>()
    // console.log(isPurchased?.reverse())
    const { isLoading, courses } = useSelector((state: RootState) => state.course)
    // console.log(courses)
    // const FetchMyCourses = async () => {
    //     const response = await fetch("http://localhost:8000/lead/mycourse/all",{
    //             credentials: "include"
    //         });
    //     const data = await response.json();
    //     console.log(data.leadCourses)
    //     if (data.success) {
    //         const courses = data.leadCourses.map((leadCourse : any) => leadCourse._id);
    //         setIsPurchased(courses)           
    //     } 
    //     else {
    //         console.log(data.message);
    //     }
    // };
    // useEffect(()=>{
    //     FetchMyCourses()
    // }  , [])
    useEffect(() => {
        dispatch(fetchAllCourses())
    }, [])
    return (
        <div className="w-full h-fit ">
            <div className="w-full h-[20%] border border-foreground rounded-lg flex ">
                <div className="p-2 w-[30%] h-full flex justify-center">
                    <img className="w-fit h-[95%]" src={Img} alt="" />
                </div>
                <div className="w-fit h-full my-auto">
                    <p className="font-bold text-lg">Welcome to <span className="text-primary">GCC Academy</span></p>
                    <p className="text-sm mt-3 font-medium mb-3">Explore ,Learn and Build All Real Life Projects</p>
                </div>
            </div>
            <div className="w-full h-fit flex items-center mt-10">
                <h1 className="w-[50%] font-bold text-xl">All Courses</h1>
                <div className="w-full h-full flex justify-end gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant={"outline"}>Sort By</Button></DropdownMenuTrigger>
                        <DropdownMenuContent className="p-2">
                            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Price -- Low to High</DropdownMenuItem>
                            <DropdownMenuItem>Price -- High to Low</DropdownMenuItem>
                            <DropdownMenuItem>a to z</DropdownMenuItem>
                            <DropdownMenuItem>z to a</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button>Filter</Button></DropdownMenuTrigger>
                        <DropdownMenuContent className="">
                            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Price -- Low to High</DropdownMenuItem>
                            <DropdownMenuItem>Price -- High to Low</DropdownMenuItem>
                            <DropdownMenuItem>a to z</DropdownMenuItem>
                            <DropdownMenuItem>z to a</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <Separator className="mt-3" />

            {
                isLoading ? <div className="w-full h-fit mt-24">
                    <Loader />
                </div> :
                    <div className="grid grid-cols-4 gap-8 justify-center w-[100%] h-fit mt-5 max-md:grid-cols-2 max-lg:grid-cols-3 max-sm:grid-cols-1 pb-8 max-sm:pb-16">
                        {
                            (courses && courses.length > 0 ? [...courses].reverse() : []).map((course, index) => {
                                return (
                                    <div key={index} className="w-[100%] rounded-xl bg-muted h-fit flex-col flex overflow-hidden px-2 py-1 pb-5">
                                        <div className="w-[100%] h-fit mt-2 rounded-lg flex justify-center">
                                            <AspectRatio ratio={16 / 9}>
                                                <img src={course.thumbnail} alt="" className="w-full h-full rounded-lg" />
                                            </AspectRatio>
                                        </div>

                                        <p className="font-bold text-lg truncate text-start mt-1 ml-1">{course.title}</p>
                                        <p className="text-neutral-400 text-sm font-medium trun mt-1 ml-1">{course.instructor.name}</p>

                                        <div className="w-full h-fit flex justify-between px-2 mt-2 items-center">
                                            <p className="text-sm font-bold text-primary">{course.price} /-</p>
                                            <Link to={`${course._id}`}>
                                                <div className="flex justify-center items-center cursor-pointer gap-2">
                                                    <p className="text-sm font-semibold">Start</p>
                                                    <ArrowRight size={17} />
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
            }
        </div>
    )
}
