import Loader from "@/components/Loading";
import { StudentProfileInfo } from "@/components/store/slices/student/profileSlice";
import { AppDispatch, RootState } from "@/components/store/store";
import StudentEditProfile from "@/components/Student/Editprofile";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function StudentProfile() {

    const dispatch = useDispatch<AppDispatch>()

    const { isLoading, profileInfo } = useSelector((state: RootState) => state.studentProfile)

    useEffect(() => {
        dispatch(StudentProfileInfo())
    }, [dispatch])

    if (isLoading) {
        return <Loader />
    }
    return (
        <div className="p-2 w-full h-full max-sm:flex flex-col gap-y-10">
            <div className="w-full h-[30%] flex items-center max-sm:flex-col ">
                <div className="w-full h-full items-center flex max-sm:flex-col max-sm:gap-5">
                    <div className="w-[190px]">
                        <AspectRatio ratio={16 / 9}>
                            <img src={profileInfo?.profileImg} alt="Image" className="rounded-md object-cover" />
                        </AspectRatio>
                    </div>

                    <div className="ml-10">
                        <p className="text-lg font-bold ">{profileInfo?.name}</p>
                        <p>{profileInfo?.email}</p>
                    </div>
                </div>

                <StudentEditProfile />

            </div>
            <div className="w-full h-fit max-sm:pb-16 max-sm:mt-5">
                <form className="w-full flex flex-wrap gap-5">
                    <div className="w-[48%] flex flex-col gap-2 max-sm:w-[100%]">
                        <Label>Name</Label>
                        <p className="w-full bg-muted p-2.5 rounded-lg pl-5 shadow-md">{profileInfo?.name}</p>
                    </div>
                    <div className="w-[48%] flex flex-col gap-2 max-sm:w-[100%]">
                        <Label>Team Number</Label>
                        <p className="w-full bg-muted p-2.5 rounded-lg pl-5 shadow-md">{profileInfo?.teamNum}</p>
                    </div>
                    <div className="w-[48%] flex flex-col gap-2 max-sm:w-[100%]">
                        <Label>Branch</Label>
                        <p className="w-full bg-muted p-2.5 rounded-lg pl-5 shadow-md">{profileInfo?.branch}</p>
                    </div>
                    <div className="w-[48%] flex flex-col gap-2 max-sm:w-[100%]">
                        <Label>Roll Number</Label>
                        <p className="w-full bg-muted p-2.5 rounded-lg pl-5 shadow-md">{profileInfo?.rollNumber}</p>
                    </div>
                    <div className="w-[48%] flex flex-col gap-2 max-sm:w-[100%]">
                        <Label>Gender</Label>
                        <p className="w-full bg-muted p-2.5 rounded-lg pl-5 shadow-md">{profileInfo?.gender}</p>
                    </div>
                    {/* <div className="w-[48%] flex flex-col gap-2 max-sm:w-[100%]">
                        <Label>College</Label>
                        <p className="w-full bg-muted p-2.5 rounded-lg pl-5 shadow-md">{profileInfo?.college}</p>
                    </div> */}
                </form>
            </div>
        </div>
    )
}
