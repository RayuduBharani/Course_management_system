import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
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

export default function AdminAllcourses() {
    const dispatch = useDispatch<AppDispatch>()
    const { isLoading, courses } = useSelector((state: RootState) => state.course)

    useEffect(() => {
        dispatch(fetchAllCourses())
    }, [])
    return (
        <div className="w-full h-fit ">
            <div className="w-full h-fit flex items-center">
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
                                                    <p className="text-sm font-semibold">View this course</p>
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
