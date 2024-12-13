import EditProfile from "@/components/Lead/EditProfile";
import Loader from "@/components/Loading";
import { RootState } from "@/components/store/store";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Label } from "@/components/ui/label";
import { useSelector } from "react-redux";

export default function LeadProfile() {
    const { profileInfo, isLoading } = useSelector((state: RootState) => state.profile)
    if (isLoading) {
        return <Loader />
    }
    return (
        <div className="p-2 w-full h-full max-sm:flex flex-col gap-y-10">
            <div className="w-full h-[30%] flex items-center max-sm:flex-col max-sm:gap-4">
                <div className="w-full h-full items-center flex max-sm:flex-col ">
                    <div className="w-[190px]">
                        <AspectRatio ratio={16 / 9}>
                            <img src={profileInfo?.data.profileImg} alt="Image" className="rounded-md object-cover" />
                        </AspectRatio>
                    </div>
                    <div className="max-sm:w-full max-sm:ml-14">
                        <p className="text-lg font-bold ">{profileInfo?.data.name}</p>
                        <p>{profileInfo?.data.email}</p>
                    </div>
                </div>

                <EditProfile />
            </div>
            <div className="w-full h-fit max-sm:pb-16 max-sm:ml-0">
                <form className="w-full flex flex-wrap gap-5">
                    <div className="w-[48%] flex flex-col gap-2 max-sm:w-[100%]">
                        <Label>Name</Label>
                        <p className="w-full h-fit bg-muted p-2.5 rounded-lg pl-5 shadow-md">{profileInfo?.data.name}</p>
                    </div>
                    <div className="w-[48%] flex flex-col gap-2 max-sm:w-[100%]">
                        <Label>Team Number</Label>
                        <p className="w-full bg-muted p-2.5 rounded-lg pl-5 shadow-md">{profileInfo?.data.teamNo}</p>
                    </div>
                    <div className="w-[48%] flex flex-col gap-2 max-sm:w-[100%]">
                        <Label>Branch</Label>
                        <p className="w-full bg-muted p-2.5 rounded-lg pl-5 shadow-md">{profileInfo?.data.branch}</p>
                    </div>
                    <div className="w-[48%] flex flex-col gap-2 max-sm:w-[100%]">
                        <Label>Roll Number</Label>
                        <p className="w-full bg-muted p-2.5 rounded-lg pl-5 shadow-md">{profileInfo?.data.rollNumber}</p>
                    </div>
                    <div className="w-[48%] flex flex-col gap-2 max-sm:w-[100%]">
                        <Label>Gender</Label>
                        <p className="w-full bg-muted p-2.5 rounded-lg pl-5 shadow-md">{profileInfo?.data.gender}</p>
                    </div>
                </form>
            </div>
        </div>
    )
}
