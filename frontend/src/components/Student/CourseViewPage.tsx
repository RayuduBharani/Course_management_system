import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Loader from "../Loading"
import { Button } from "../ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedVideo, setSelectedVideo] = useState<any>(null)

    const FetchCourseInfo = async () => {
        const response = await fetch(`http://localhost:8000/courses/get/${id}`)
        const data = await response.json()
        setCourseInfo(data)
    }

    useEffect(() => {
        FetchCourseInfo()
    }, [id])

    const { user } = useSelector((state: RootState) => state.auth)

    if (approvalUrl != "") {
        window.location.href = approvalUrl
    }

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
            
            if (data.success) {
                sessionStorage.setItem("currentOrderId", data.orderId)
                setApprovalUrl(data.approvalUrl)
                setIsProcessing(false)
            } else {
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleVideoClick = (video: any) => {
        if (video.freePreview) {
            setSelectedVideo(video)
        }
    }

    const closeVideoDialog = () => {
        setSelectedVideo(null)
    }

    if (courseInfo == undefined) {
        return (
            <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
                <Loader />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header */}
            <div className="">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Button 
                        onClick={() => navigate(-1)} 
                        variant="outline" 
                        className="flex items-center gap-2 hover:bg-primary hover:text-white transition-colors"
                    >
                        <i className="fa-solid fa-arrow-left text-sm"></i>
                        <span>Back to Courses</span>
                    </Button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-primary/90 to-primary text-white rounded-2xl p-8 mb-8 shadow-lg">
                    <div className="max-w-4xl">
                        <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                            {courseInfo.title}
                        </h1>
                        <p className="text-primary-foreground/80 text-lg mb-6 leading-relaxed">
                            {courseInfo?.subtitle}
                        </p>
                        
                        <div className="flex flex-wrap gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                    <i className="fa-solid fa-user text-xs"></i>
                                </div>
                                <span>By {courseInfo?.instructor.name}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                    <i className="fa-solid fa-calendar text-xs"></i>
                                </div>
                                <span>
                                    {courseInfo?.updatedAt
                                        ? new Date(courseInfo.updatedAt).toLocaleDateString("en-US", {
                                              year: "numeric",
                                              month: "short",
                                              day: "numeric",
                                          })
                                        : new Date().toLocaleDateString("en-US")}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                    <i className="fa-solid fa-users text-xs"></i>
                                </div>
                                <span>{courseInfo.students.length} Students</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                    <i className="fa-solid fa-chart-line text-xs"></i>
                                </div>
                                <span>{courseInfo.leads.length} Leads</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Course Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Course Description */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <i className="fa-solid fa-info-circle text-primary text-sm"></i>
                                Course Description
                            </h2>
                            <p className="text-gray-700 leading-relaxed">{courseInfo.description}</p>
                        </div>

                        {/* Learning Objectives */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <i className="fa-solid fa-bullseye text-primary text-sm"></i>
                                What You'll Learn
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {courseInfo.objectives.split(",").map((objective, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                            <i className="fa-solid fa-check text-primary text-xs"></i>
                                        </div>
                                        <span className="text-gray-700 text-sm leading-relaxed">{objective.trim()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Course Curriculum */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <i className="fa-solid fa-play-circle text-primary text-sm"></i>
                                Course Curriculum
                            </h2>
                            <div className="space-y-3">
                                {courseInfo.files.map((video, index) => (
                                    <div 
                                        key={index} 
                                        className={`
                                            flex items-center justify-between p-4 rounded-lg border border-gray-200 
                                            transition-all duration-200 
                                            ${video.freePreview 
                                                ? "cursor-pointer hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm" 
                                                : "cursor-not-allowed bg-gray-50"
                                            }
                                        `}
                                        onClick={() => handleVideoClick(video)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`
                                                w-10 h-10 rounded-full flex items-center justify-center text-sm
                                                ${video.freePreview 
                                                    ? "bg-primary/10 text-primary hover:bg-primary hover:text-white" 
                                                    : "bg-gray-200 text-gray-400"
                                                }
                                            `}>
                                                {video.freePreview ? (
                                                    <i className="fa-solid fa-play"></i>
                                                ) : (
                                                    <i className="fa-solid fa-lock"></i>
                                                )}
                                            </div>
                                            
                                            <div>
                                                <h3 className={`
                                                    font-medium 
                                                    ${video.freePreview 
                                                        ? "text-gray-900 hover:text-primary" 
                                                        : "text-gray-500"
                                                    }
                                                `}>
                                                    {video.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-0.5">
                                                    {video.freePreview ? "Free Preview" : "Premium Content"}
                                                </p>
                                            </div>
                                        </div>

                                        {video.freePreview && (
                                            <div className="text-primary">
                                                <i className="fa-solid fa-external-link-alt text-sm"></i>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Sticky Purchase Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                                {/* Video Preview */}
                                <div className="aspect-video bg-gray-100">
                                    <Videoplayer
                                        width="100%"
                                        height="100%"
                                        thumbnail={courseInfo.thumbnail}
                                        videoUrl="https://firebasestorage.googleapis.com/v0/b/coursemanagementsystem-ca033.appspot.com/o/52%20-%20Project%20Overview.mp4?alt=media&token=326d2820-70ca-4a4a-b4db-e165a282b234"
                                    />
                                </div>

                                {/* Pricing and Purchase */}
                                <div className="p-6">
                                    <div className="text-center mb-6">
                                        <div className="text-2xl font-bold text-gray-900 mb-2">
                                            ₹{courseInfo.price.toLocaleString()}
                                        </div>
                                        <p className="text-xs text-gray-500">One-time purchase</p>
                                    </div>

                                    <Button
                                        disabled={isProcessing}
                                        onClick={handleCreatePayment}
                                        className="w-full h-10 text-sm font-semibold"
                                        size="default"
                                    >
                                        {isProcessing ? (
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Processing Payment...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5">
                                                <i className="fa-solid fa-shopping-cart text-xs"></i>
                                                Buy Now
                                            </div>
                                        )}
                                    </Button>

                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <h3 className="font-semibold text-gray-900 mb-2 text-sm">This course includes:</h3>
                                        <div className="space-y-1.5 text-xs text-gray-600">
                                            <div className="flex items-center gap-1.5">
                                                <i className="fa-solid fa-video text-primary text-[10px] w-3"></i>
                                                <span>{courseInfo.files.length} video lectures</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <i className="fa-solid fa-infinity text-primary text-[10px] w-3"></i>
                                                <span>Lifetime access</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <i className="fa-solid fa-mobile-alt text-primary text-[10px] w-3"></i>
                                                <span>Mobile and desktop access</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <i className="fa-solid fa-certificate text-primary text-[10px] w-3"></i>
                                                <span>Certificate of completion</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Video Dialog */}
            <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl mb-6 text-center">
                            {selectedVideo?.title}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="aspect-video rounded-lg overflow-hidden">
                        <Videoplayer
                            width="100%"
                            height="100%"
                            videoUrl={selectedVideo?.videoUrl}
                        />
                    </div>
                    <div className="flex justify-center mt-6">
                        <Button
                            onClick={closeVideoDialog}
                            variant="outline"
                            className="px-8"
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}