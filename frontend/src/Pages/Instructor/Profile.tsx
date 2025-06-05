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
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, profileInfo } = useSelector((state: RootState) => state.InstructorProfile);
    
    useEffect(() => {
        dispatch(FetchProfileInfo());
    }, [dispatch]);

    if (isLoading) {
        return <Loader />;
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-6 px-4 md:px-6">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                {/* Profile Header */}
                <div className="relative p-6 flex flex-col sm:flex-row items-start gap-6 border-b">
                    <div className="w-32 h-32 rounded-lg overflow-hidden shadow-md">
                        <AspectRatio ratio={1}>
                            <img 
                                src={profileInfo?.profileImg} 
                                alt={profileInfo?.name} 
                                className="object-cover w-full h-full"
                            />
                        </AspectRatio>
                    </div>

                    <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-900">{profileInfo.name}</h2>
                        <p className="text-sm text-gray-500 mt-1">{profileInfo.email}</p>
                        <div className="flex gap-3 mt-3">
                            {profileInfo.gitHub && (
                                <a href={profileInfo.gitHub} target="_blank" rel="noopener noreferrer" 
                                   className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 py-1 px-3 rounded-full transition-colors">
                                    GitHub
                                </a>
                            )}
                            {profileInfo.linkedIn && (
                                <a href={profileInfo.linkedIn} target="_blank" rel="noopener noreferrer"
                                   className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 py-1 px-3 rounded-full transition-colors">
                                    LinkedIn
                                </a>
                            )}
                        </div>
                    </div>

                    <Link to='update' className="absolute top-6 right-6">
                        <div className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <Pencil size={16} className="text-gray-500" />
                        </div>
                    </Link>
                </div>

                {/* Profile Details */}
                <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label className="text-xs text-gray-500">Branch</Label>
                            <p className="text-sm bg-gray-50 p-2 rounded">{profileInfo.branch}</p>
                        </div>
                        
                        <div className="space-y-1">
                            <Label className="text-xs text-gray-500">Roll Number</Label>
                            <p className="text-sm bg-gray-50 p-2 rounded">{profileInfo.rollNumber}</p>
                        </div>
                        
                        <div className="space-y-1">
                            <Label className="text-xs text-gray-500">Gender</Label>
                            <p className="text-sm bg-gray-50 p-2 rounded capitalize">{profileInfo.gender}</p>
                        </div>
                        
                        <div className="space-y-1">
                            <Label className="text-xs text-gray-500">College</Label>
                            <p className="text-sm bg-gray-50 p-2 rounded">{profileInfo.college}</p>
                        </div>

                        <div className="space-y-1">
                            <Label className="text-xs text-gray-500">UPI ID</Label>
                            <p className="text-sm bg-gray-50 p-2 rounded font-mono">{profileInfo.UPI}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
