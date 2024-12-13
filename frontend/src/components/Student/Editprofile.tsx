import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { FileUpload } from "../ui/file-upload";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { ChangeEvent, FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import app from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";
import { StudentUpdateProfileInfo } from "../store/slices/student/profileSlice";

export default function StudentEditProfile() {
    const [open, setOpen] = useState(false);
    const [progress, setProgress] = useState<number>()
    const dispatch = useDispatch<AppDispatch>();
    const { profileInfo, isLoading } = useSelector((state: RootState) => state.studentProfile)
    const [updateData, setUpdateData] = useState({
        _id: profileInfo?._id,
        name: profileInfo?.name,
        rollNumber: profileInfo?.rollNumber,
        gender: profileInfo?.gender,
        branch: profileInfo?.branch,
        profileImg: profileInfo?.profileImg,
        teamNum : profileInfo?.teamNum,
    });

    const handleDialog = () => {
        setOpen(!open);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUpdateData((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setUpdateData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const [profileImg, setProfileImg] = useState<File | null>(null)

    const handleProfileImg = (event: File[]) => {
        console.log(event[0])
        setProfileImg(event[0])
    }

    const handleProfileSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (profileImg) {
            const storage = getStorage(app)
            const storageRef = ref(storage, `Profiles/${Date.now()}_${profileImg.name}`)
            const uploadTask = uploadBytesResumable(storageRef, profileImg)
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    setProgress(prog)
                },
                (err) => {
                    console.error("Upload failed", err)
                },
                async () => {
                    const imgUrl: string = await getDownloadURL(uploadTask.snapshot.ref)
                    const NewData = {
                        _id: updateData._id,
                        rollNumber: updateData.rollNumber,
                        branch: updateData.branch,
                        profileImg: imgUrl,
                        gender: updateData.gender,
                        name: updateData.name,
                        teamNum : updateData.teamNum
                    }
                    console.log(NewData)
                    dispatch(StudentUpdateProfileInfo(NewData))
                        .then((data) => {
                            console.log(data.payload)
                            setOpen(false)
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            )
        }
        else {
            dispatch(StudentUpdateProfileInfo(updateData))
                .then((data) => {
                    console.log(data.payload)
                    toast({
                        title: "Profile Updated"
                    })
                    setProgress(100)
                    setOpen(false)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    return (
        <div className="max-sm:mt-5">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                    <i className="fa-solid fa-pen-to-square bg-muted p-3 rounded-full mr-8"></i>
                </DialogTrigger>
                <DialogContent className="overflow-y-scroll h-[600px] no-scrollbar">
                    <DialogHeader>
                        <DialogTitle className="text-center text-primary">Edit your Profile</DialogTitle>
                        <DialogDescription>
                        </DialogDescription>
                        <form onSubmit={handleProfileSubmit} className="w-full h-full px-10 py-5 flex flex-col items-center gap-3 max-sm:px-0">
                            <FileUpload onChange={handleProfileImg} />
                            <div className="w-full flex gap-5 mt-6"></div>
                            <div className="gap-3 w-full flex">
                                <div className="w-[50%]">
                                    <Label htmlFor="rollnumber">Roll Number</Label>
                                    <Input
                                        onChange={handleChange}
                                        name="rollNumber"
                                        id="rollnumber"
                                        className="bg-background"
                                        value={updateData.rollNumber}
                                    />
                                </div>
                                <div className="w-[50%]">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select defaultValue={updateData.gender} onValueChange={(value) => handleSelectChange("gender", value)} name="gender">
                                        <SelectTrigger id="gender" className="w-full p-5 bg-background">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Male">Male</SelectItem>
                                            <SelectItem value="Female">Female</SelectItem>
                                            <SelectItem value="Others">Others</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="w-full">
                                <Label htmlFor="branch">Branch</Label>
                                <Select defaultValue={updateData.branch} onValueChange={(value) => handleSelectChange("branch", value)} name="branch">
                                    <SelectTrigger id="branch" className="w-full p-5 bg-background">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CSD">CSD</SelectItem>
                                        <SelectItem value="AID">AID</SelectItem>
                                        <SelectItem value="CAI">CAI</SelectItem>
                                        <SelectItem value="Cyber">Cyber</SelectItem>
                                        <SelectItem value="CSM">CSM</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-full">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    onChange={handleChange}
                                    name="name"
                                    id="name"
                                    className="bg-background"
                                    value={updateData.name}
                                />

                                <div className="w-[100%]">
                                    <Label htmlFor="team">Your Team</Label>
                                    <Select required  value={updateData.teamNum} onValueChange={(value) => handleSelectChange("teamNum", value)} name="teamNum">
                                        <SelectTrigger id="team" className="w-full p-5 bg-background">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent onChange={handleChange}>
                                            <SelectItem value="Team-1">Team - 1</SelectItem>
                                            <SelectItem value="Team-2">Team - 2</SelectItem>
                                            <SelectItem value="Team-3">Team - 3</SelectItem>
                                            <SelectItem value="Team-4">Team - 4</SelectItem>
                                            <SelectItem value="Team-5">Team - 5</SelectItem>
                                            <SelectItem value="Team-6">Team - 6</SelectItem>
                                            <SelectItem value="Team-7">Team - 7</SelectItem>
                                            <SelectItem value="Team-8">Team - 8</SelectItem>
                                            <SelectItem value="Team-9">Team - 9</SelectItem>
                                            <SelectItem value="Team-10">Team - 10</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button onClick={() => {
                                progress &&
                                    progress == 100 ?
                                    handleDialog()
                                    : null
                            }} type="submit" className="w-full p-5 mt-1">
                                {
                                    isLoading ? "updating profile ..." : "Update Your Profile"
                                }
                            </Button>
                        </form>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}
