import EditProfile from "@/components/Lead/EditProfile";
import Loader from "@/components/Loading";
import { RootState } from "@/components/store/store";
import { Label } from "@/components/ui/label";
import { useSelector } from "react-redux";

export default function LeadProfile() {
    const { profileInfo, isLoading } = useSelector((state: RootState) => state.profile)
    if (isLoading) {
        return <Loader />
    }
    return (
        <div className="p-2 w-full h-full max-sm:flex flex-col gap-y-10">
            <div className="w-full h-[30%] flex items-center ">
                <div className="w-full h-full items-center flex max-sm:flex-col ">
                    <div className="w-[15%] h-full flex items-center max-sm:w-[50%]">
                        <img className="rounded-full w-[80%] h-[70%] max-sm:h-[60%]  " src={profileInfo?.data.profileImg} alt="" />
                    </div>
                    <div className="max-sm:w-full max-sm:ml-14">
                        <p className="text-lg font-bold ">{profileInfo?.data.name}</p>
                        <p>{profileInfo?.data.email}</p>
                    </div>
                </div>

                <EditProfile />
            </div>
            <div className="w-full h-fit max-sm:ml-6 max-sm:pb-16">
                <form className="w-full flex flex-wrap gap-5">
                    <div className="w-[48%] flex flex-col gap-2 max-sm:w-[90%]">
                        <Label>Name</Label>
                        <p className="w-full h-fit bg-muted p-2.5 rounded-lg pl-5 shadow-md">{profileInfo?.data.name}</p>
                    </div>
                    <div className="w-[48%] flex flex-col gap-2 max-sm:w-[90%]">
                        <Label>Team Number</Label>
                        <p className="w-full bg-muted p-2.5 rounded-lg pl-5 shadow-md">{profileInfo?.data.teamNo}</p>
                    </div>
                    <div className="w-[48%] flex flex-col gap-2 max-sm:w-[90%]">
                        <Label>Branch</Label>
                        <p className="w-full bg-muted p-2.5 rounded-lg pl-5 shadow-md">{profileInfo?.data.branch}</p>
                    </div>
                    <div className="w-[48%] flex flex-col gap-2 max-sm:w-[90%]">
                        <Label>Roll Number</Label>
                        <p className="w-full bg-muted p-2.5 rounded-lg pl-5 shadow-md">{profileInfo?.data.rollNumber}</p>
                    </div>
                    <div className="w-[48%] flex flex-col gap-2 max-sm:w-[90%]">
                        <Label>Gender</Label>
                        <p className="w-full bg-muted p-2.5 rounded-lg pl-5 shadow-md">{profileInfo?.data.gender}</p>
                    </div>
                </form>
            </div>
        </div>
    )
}
