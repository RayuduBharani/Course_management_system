import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Loader from "../Loading"
import { Button } from "../ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Videoplayer from "../Common/VideoPlayer/Videoplayer"
import { useSelector } from "react-redux"
import { RootState } from "../store/store"
import { toast } from "@/hooks/use-toast"


export default function StudentCourseDetailesView() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [courseInfo, setCourseInfo] = useState<ICourse>()
    const [approvalUrl, setApprovalUrl] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)
    const FetchCourseInfo = async () => {
        const response = await fetch(`http://localhost:8000/courses/get/${id}`)
        const data = await response.json()
        setCourseInfo(data)
    }
    console.log(courseInfo)
    useEffect(() => {
        FetchCourseInfo()
    }, [id])

    const { user } = useSelector((state: RootState) => state.auth)

    if (approvalUrl != "") {
        window.location.href = approvalUrl
    }

    console.log(approvalUrl)
    const handleCreatePayment = async () => {
        setIsProcessing(true)
        const paymentPayload = {
            userId: user.userId,
            userEmail: user.email,
            orderStatus: "Pending",
            paymentMethod: "paypal",
            orderDate: Date.now(),
            paymentId: "",
            payerId: "",
            instructorId: courseInfo?.instructor._id,
            courseId: courseInfo?._id,
            coursePrice: courseInfo?.price,
            courseTitle: courseInfo?.title
        }
        try {
            const response = await fetch("http://localhost:8000/lead/order/create/stu", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(paymentPayload)
            })
            const data = await response.json()
            console.log(data)
            if (data.success) {
                sessionStorage.setItem("currentOrderId", data.orderId)
                setApprovalUrl(data.approvalUrl)
                setIsProcessing(false)
            }
            else {
                toast({
                    title: "Payment method failed please try again",
                    variant: "destructive"
                })
                setIsProcessing(false)
            }
        } catch (err) {
            console.log(err)
            setIsProcessing(false)
        }
    }

    const [open, setOpen] = useState(false)
    const handleDailog = () => {
        setOpen(!open)
    }
    return (
        <div className="w-full h-full max-sm:h-fit max-sm:mb-20">
    <Button onClick={() => navigate(-1)} variant="link" className="flex gap-2 mb-5">
        <i className="fa-solid fa-arrow-left"></i> Back
    </Button>
    {courseInfo == undefined ? (
        <Loader />
    ) : (
        <div className="w-full h-[94%]">
            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Course Info */}
                <div className="w-full h-fit bg-black text-background dark:text-white border shadow-md px-5 py-4 rounded-lg md:col-span-2 lg:col-span-3">
                    <p className="font-bold text-xl">{courseInfo.title}</p>
                    <p className="mt-4 text-gray-400 text-sm">{courseInfo?.subtitle}</p>
                    <div className="mt-4 flex flex-wrap gap-4 font-semibold text-sm text-gray-400">
                        <p>Created by {courseInfo?.instructor.name}</p>
                        <p>
                            Created on{" "}
                            {courseInfo?.updatedAt
                                ? new Date(courseInfo.updatedAt).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                  })
                                : new Date().toLocaleDateString("en-US")}
                        </p>
                        <p>Students: {courseInfo.students.length}</p>
                        <p>Leads: {courseInfo.leads.length}</p>
                    </div>
                </div>

                {/* Course Description */}
                <div className="shadow-sm px-5 py-4 border-2 rounded-lg">
                    <p className="font-bold">Course Description</p>
                    <p className="mt-2">{courseInfo.description}</p>
                </div>

                {/* Video & Pricing */}
                <div className="shadow-sm row-span-4">
                    <div className="w-full h-fit border-2 rounded-lg px-5 py-4">
                        <Videoplayer
                            width="100%"
                            height="250px"
                            thumbnail={courseInfo.thumbnail}
                            videoUrl="https://firebasestorage.googleapis.com/v0/b/coursemanagementsystem-ca033.appspot.com/o/52%20-%20Project%20Overview.mp4?alt=media&token=326d2820-70ca-4a4a-b4db-e165a282b234"
                        />
                        <div className="mt-1.5 flex flex-col gap-3">
                            <p className="font-bold text-lg pl-3">₹ {courseInfo.price}</p>
                            <Button
                                disabled={isProcessing}
                                onClick={handleCreatePayment}
                                className="w-full"
                            >
                                {isProcessing ? "Processing payment ..." : "Buy Now"}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Course Objectives */}
                <div className="shadow-sm px-5 py-4 border-2 rounded-lg">
                    <p className="font-bold">What you'll learn</p>
                    {courseInfo.objectives.split(",").map((object, index) => (
                        <li key={index} className="mt-2">
                            {object}
                        </li>
                    ))}
                </div>

                {/* Curriculum */}
                <div className="shadow-sm px-5 py-4 border-2 rounded-lg md:col-span-2">
                    <p className="font-bold mb-2">Course Curriculum</p>
                    {courseInfo.files.map((video, index) => (
                        <div key={index} className="h-fit w-full flex gap-5">
                            <Dialog open={open} onOpenChange={setOpen}>
                                <div
                                    className={`flex gap-5 mt-3 items-center h-full ${
                                        video.freePreview
                                            ? "cursor-pointer"
                                            : "cursor-not-allowed"
                                    }`}
                                >
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
                                            <DialogTitle className="mb-6 text-center">
                                                {video.title}
                                            </DialogTitle>
                                            <Videoplayer
                                                width={"100%"}
                                                height={"250px"}
                                                videoUrl={video.videoUrl}
                                            />
                                        </DialogHeader>
                                        <Button
                                            onClick={handleDailog}
                                            variant="secondary"
                                        >
                                            Close
                                        </Button>
                                    </DialogContent>
                                </div>
                            </Dialog>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )}
</div>

    )
}
