import { Button } from "@/components/ui/button";
import Img from "../../assets/Img.png"
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/components/store/store";
import { useEffect } from "react";
import { FetchInstructorCourses } from "@/components/store/slices/Instructor/courses";
import Loader from "@/components/Loading";

export default function InstructorAllCourses() {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        dispatch(FetchInstructorCourses())
    }, [])
    const { courses, isLoading } = useSelector((state: RootState) => state.Instuctor)
    if (isLoading) {
        return <Loader />
    }
    return (
        <div className="w-full h-screen p-10 ">
            <div className="w-full h-[20%] border border-foreground rounded-lg flex max-sm:hidden">
                <div className="p-2 w-[30%] h-full flex justify-center">
                    <img className="w-fit h-[95%]" src={Img} alt="" />
                </div>
                <div className="w-fit h-full flex flex-col justify-center">
                    <p className="font-bold text-lg">Welcome to <span className="text-primary">GCC Academy</span></p>
                    <p className="text-sm mt-3 font-medium mb-3">Explore ,Learn and Build All Real Life Projects</p>
                </div>
            </div>
            <div className="w-full h-fit flex items-center mt-10">
                <h1 className="w-[50%] font-bold text-xl">All Courses</h1>
                <div className="w-full h-full flex justify-end gap-2">
                    <Button className="w-[40%]  max-sm:w-[60%]" onClick={() => navigate("/instructor/new")}>Add Courses</Button>
                </div>
            </div>
            <Separator className="mt-3" />

            <div className="grid grid-cols-4 gap-8 justify-center w-[100%] h-fit mt-5 max-md:grid-cols-2 max-lg:grid-cols-3 max-sm:grid-cols-1 max-sm:pb-16 relative">
                {
                    courses.length == 0 ? 
                    <div className="w-full h-full flex justify-center items-center absolute mt-48">
                        <p className="text-lg text-primary font-bold ">No courses found</p>
                    </div> :
                    courses.map((course , index) => {
                        return (
                            <div key={index} className="w-[100%] rounded-xl bg-muted h-fit flex-col flex overflow-hidden px-2 py-1 pb-5">
                                <div className="w-[100%] h-[50%] mt-2 rounded-lg flex justify-center">
                                    <img className="w-full object-contain h-full rounded-lg" src={course.thumbnail} alt="" />
                                </div>
                                <p className="font-bold text-lg truncate text-start mt-1 ml-1">{course.title}</p>
                                <p className="text-neutral-400 text-sm font-medium trun mt-1 ml-1">{course.instructor.name}</p>
                                <Link to={`/instructor/courses/view/${course._id}`}><div className="w-full h-fit flex justify-end mt-4 items-center gap-2">
                                    <p className="text-sm font-semibold cursor-pointer">Start</p>
                                    <ArrowRight size={17} />
                                </div>
                                </Link>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
