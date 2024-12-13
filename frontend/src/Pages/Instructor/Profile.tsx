import Loader from "@/components/Loading";
import { FetchProfileInfo } from "@/components/store/slices/Instructor/profile";
import { AppDispatch, RootState } from "@/components/store/store";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function InstructorProfile() {
    const dispatch = useDispatch<AppDispatch>()
    const { isLoading, profileInfo } = useSelector((state: RootState) => state.InstructorProfile)
    useEffect(() => {
        dispatch(FetchProfileInfo())
    }, [])
    if (isLoading) {
        return <Loader />
    }
    console.log(profileInfo)
    return (
        <div className="px-10 w-full h-full max-sm:flex flex-col gap-y-10 max-sm:px-0">
            <div className="w-full h-[30%] flex items-center ">
                <div className="w-full h-full items-center flex max-sm:flex-col ">
                <div className="w-[190px] max-sm:mt-3">
                        <AspectRatio ratio={16 / 9}>
                            <img src={profileInfo?.profileImg} alt="Image" className="rounded-md object-cover" />
                        </AspectRatio>
                    </div>
                    <div className="max-sm:w-full max-sm:ml-14 ml-10 max-sm:mt-5">
                        <p className="text-lg font-bold ">{profileInfo.name}</p>
                        <p>{profileInfo.email}</p>
                    </div>
                </div>

                <Link to='update'><div className="bg-muted p-2 rounded-full cursor-pointer mr-8 flex justify-end items-end max-sm:mt-44">
                    <Pencil size={20} />
                </div></Link>
            </div>
            <div className="w-full h-fit max-sm:ml-6 max-sm:pb-16">
                <form className="w-full flex flex-wrap gap-5">
                    <div className="w-[48%] flex flex-col gap-2 max-sm:w-[90%]">
                        <Label>GitHub</Label>
                        <p className="w-full bg-muted p-2.5 rounded-lg pl-5 shadow-md">{profileInfo.gitHub}</p>
                    </div>
                    <div className="w-[48%] flex flex-col gap-2 max-sm:w-[90%]">
                        <Label>LinkedIn</Label>
                        <p className="w-full bg-muted p-2.5 rounded-lg pl-5 shadow-md">{profileInfo.linkedIn}</p>
                    </div>
                    <div className="w-[48%] flex flex-col gap-2 max-sm:w-[90%]">
                        <Label>Branch</Label>
                        <p className="w-full bg-muted p-2.5 rounded-lg pl-5 shadow-md">{profileInfo.branch}</p>
                    </div>
                    <div className="w-[48%] flex flex-col gap-2 max-sm:w-[90%]">
                        <Label>Roll Number</Label>
                        <p className="w-full bg-muted p-2.5 rounded-lg pl-5 shadow-md">{profileInfo.rollNumber}</p>
                    </div>
                    <div className="w-[48%] flex flex-col gap-2 max-sm:w-[90%]">
                        <Label>Gender</Label>
                        <p className="w-full bg-muted p-2.5 rounded-lg pl-5 shadow-md">{profileInfo.gender}</p>
                    </div>
                    <div className="w-[48%] flex flex-col gap-2 max-sm:w-[90%]">
                        <Label>College</Label>
                        <p className="w-full bg-muted p-2.5 rounded-lg pl-5 shadow-md">{profileInfo.college}</p>
                    </div>
                    <div className="w-[48%] flex flex-col gap-2 max-sm:w-[90%]">
                        <Label>UPI id</Label>
                        <p className="w-full bg-muted p-2.5 rounded-lg pl-5 shadow-md">{profileInfo.UPI}</p>
                    </div>
                </form>
            </div>
        </div>
    )
}
