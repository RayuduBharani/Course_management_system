import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Loader from "../Loading"
import { Button } from "../ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Videoplayer from "../Common/VideoPlayer/Videoplayer"

export default function AdminCourseDetailesView() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [courseInfo, setCourseInfo] = useState<ICourse>()

    const FetchCourseInfo = async () => {
        const response = await fetch(`http://localhost:8000/courses/get/${id}`)
        const data = await response.json()
        setCourseInfo(data)
    }

    useEffect(() => {
        FetchCourseInfo()
    }, [id])

    const [open, setOpen] = useState(false)
    const handleDailog = () => {
        setOpen(!open)
    }

    const handleDelete = async (id: string) => {
        const response = await fetch(`http://localhost:8000/admin/course/delete/${id}`, {
            method: "PUT"
        })
        const data = await response.json();
        if (data.success) {
            navigate("/Admin/courses")
        }
    }

    if (courseInfo == undefined) {
        return <Loader />
    }

    return (
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 overflow-y-scroll">
            <div className="w-full flex justify-between col-span-1 md:col-span-2 lg:col-span-3">
                <Button onClick={() => navigate(-1)} variant="link" className="flex gap-2 mb-5"><i className="fa-solid fa-arrow-left"></i> Back</Button>
                <Button variant='destructive' onClick={() => handleDelete(courseInfo._id)}>Delete this Course</Button>
            </div>

            <div className="w-full h-fit bg-black col-span-1 dark:bg-background text-background dark:text-white border shadow-md px-5 py-4 rounded-lg md:col-span-2 lg:col-span-3">
                <p className="font-bold text-xl">{courseInfo.title}</p>
                <p className="mt-4 text-gray-400 text-sm">{courseInfo?.subtitle}</p>
                <div className="mt-4 flex gap-8 font-semibold">
                    <p className="text-sm text-gray-400">created by {courseInfo?.instructor.name}</p>
                    <p className="text-sm text-gray-400">created on  {courseInfo?.updatedAt
                        ? new Date(courseInfo.updatedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })
                        : new Date().toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}</p>
                    <p className="text-sm text-gray-400">students : {courseInfo.students.length}</p>
                    <p className="text-sm text-gray-400">leads : {courseInfo.leads.length}</p>
                </div>
            </div>

            <div className="shadow-sm w-full h-fit px-5 py-4 border-2 rounded-lg col-span-1 md:col-span-2 lg:col-span-2">
                <p className="font-bold">Course Description</p>
                <p className="mt-2">{courseInfo.description}</p>
            </div>

            <div className="w-full h-full col-span-1 md:col-span-2 lg:col-span-1">
                <div className="w-full h-fit rounded-lg px-5 py-4">
                    <div className="w-full h-full">
                        <Videoplayer width="100%" height="250px" thumbnail={courseInfo.thumbnail} videoUrl="https://firebasestorage.googleapis.com/v0/b/coursemanagementsystem-ca033.appspot.com/o/52%20-%20Project%20Overview.mp4?alt=media&token=326d2820-70ca-4a4a-b4db-e165a282b234" />
                    </div>
                    <div className="mt-1.5 flex flex-col gap-3">
                        <p className="font-bold text-lg pl-3"> ₹ {courseInfo.price} </p>
                        <Button className="w-full" onClick={() => {
                            navigate(`/Admin/courses/coureview/${courseInfo._id}`)
                        }}>View this Course</Button>
                    </div>
                </div>
            </div>

            <div className="shadow-sm w-full h-fit px-5 py-4 border-2 rounded-lg col-span-1 md:col-span-2 lg:col-span-3">
                <p className="font-bold">What you'll learn</p>
                {
                    courseInfo.objectives.split(',').map((object, index) => {
                        return <li key={index} className="mt-2">{object}</li>
                    })
                }
            </div>

            <div className="shadow-sm w-full h-fit px-5 py-4 border-2 rounded-lg col-span-1 md:col-span-2 lg:col-span-3">
                <p className="font-bold mb-2">Course Curriculum</p>
                {
                    courseInfo.files.map((video, index) => {
                        return (
                            <div key={index} className="h-full w-full flex gap-5">
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <div className={`flex gap-5 mt-3 items-center h-full ${video.freePreview ? "cursor-pointer" : "cursor-not-allowed"}`}>
                                        {video.freePreview ? (
                                            <DialogTrigger asChild>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <i className="fa-regular fa-circle-play"></i>
                                                    <p className="text-gray-600">{video.title}</p>
                                                </div>
                                            </DialogTrigger>
                                        ) : (
                                            <div className="flex items-center gap-3 mt-1">
                                                <i className="fa-solid fa-lock"></i>
                                                <p className="text-gray-500">{video.title}</p>
                                            </div>
                                        )}
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle className="mb-6 text-center">{video.title}</DialogTitle>
                                                <Videoplayer width={"100%"} height={"250px"} videoUrl={video.videoUrl} />
                                                <DialogDescription>
                                                </DialogDescription>
                                            </DialogHeader>
                                            <Button onClick={handleDailog} variant="secondary">close</Button>
                                        </DialogContent>
                                    </div>
                                </Dialog>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
