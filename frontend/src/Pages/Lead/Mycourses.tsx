import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function LeadMyCourses() {
    const [myCourseInfo, setMyCourseInfo] = useState<ICompleateCourseInfo[] | null>(null);
    const [search, setSearch] = useState<string>('');
    const FetchMyCourses = async () => {
        const url = search
            ? `http://localhost:8000/lead/mycourse/search/${search}`
            : "http://localhost:8000/lead/mycourse/all";

        const response = await fetch(url,{
                credentials: "include"
            });
        const data = await response.json();

        if (data.success) {
            setMyCourseInfo(data.leadCourses);
            console.log(data.leadCourses)
        } 
        else {
            console.log(data.message);
            setMyCourseInfo([]);
        }
    };

    useEffect(() => {
        FetchMyCourses();
    }, [search]);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        FetchMyCourses();
    };

    return (
        <div className="w-full h-full">
            <div className="w-full h-fit flex justify-between max-sm:flex-col max-sm:gap-3">
                <p className="font-bold text-xl max-sm:text-center max-sm:mb-2">My Journey</p>
                <form onSubmit={handleSearch} className="w-[60%] flex gap-5 justify-end max-sm:w-full">
                    <Input
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                        name="search"
                        className="w-[60%] bg-muted"
                        placeholder="Hinted search text"
                    />
                    <Button type="submit" className="p-5">Search</Button>
                </form>
            </div>

            <div className="grid grid-cols-4 gap-8 justify-center w-[100%] h-fit mt-12 max-md:grid-cols-2 max-lg:grid-cols-3 max-sm:grid-cols-1 pb-8 max-sm:pb-16">
                {
                    myCourseInfo && myCourseInfo.length === 0 ?
                        <div className="w-[90vw] h-[500px] flex justify-center items-center">
                            <h1 className="font-bold text-lg text-primary animate-pulse">No courses found. Start your journey today!</h1>
                        </div> :
                        myCourseInfo && myCourseInfo.map((course, index) => (
                            <div key={index} className="w-[100%] rounded-xl bg-muted h-fit flex-col flex overflow-hidden px-2 py-1 pb-5">
                                <div className="w-[100%] h-fit mt-2 rounded-lg flex justify-center">
                                    <AspectRatio ratio={16 / 9}>
                                        <img src={course.course[0].courseId.thumbnail} alt={course.course[0].courseId.title} className="w-full h-full rounded-lg" />
                                    </AspectRatio>
                                </div>
                                <p className="font-bold text-lg truncate text-start mt-1 ml-1">{course.course[0].courseId.title}</p>
                                <p className="text-neutral-400 text-sm font-medium truncate mt-1 ml-1">{course.course[0].courseId.title}</p>
                                <div className="w-full h-fit flex justify-between px-2 mt-2 items-center">
                                    <p className="text-sm font-bold text-primary">20%</p>
                                    <Link to={`view-page/${course._id}`}>
                                        <div className="flex justify-center items-center cursor-pointer gap-2">
                                            <p className="text-sm font-semibold">Continue</p>
                                            <ArrowRight size={17} />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))
                }
            </div>
        </div>
    )
}
