import { FetchStudent } from "@/components/store/slices/authSlice";
import { AppDispatch } from "@/components/store/store";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "@/hooks/use-toast";
import app from "@/lib/firebase";
import { Progress } from "@radix-ui/react-progress";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
export default function StudentForm() {
    const dispatch = useDispatch<AppDispatch>();
    const [progress, setProgress] = useState<number>();
    const [loading, setLoading] = useState<boolean>(false);
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)
        const formData = new FormData(event.currentTarget)
        const rollNumber = formData.get("rollNumber") as string
        const branch = formData.get("branch") as string
        const teamNum = formData.get("team") as string
        const gender = formData.get("gender") as string
        const profile = formData.get("profile") as File

        const rollNumberVerify = /^[A-Z0-9]{10}$/;
        if (!rollNumberVerify.test(rollNumber)) {
            toast({
                title: "invalid rollNumber",
                variant: "destructive"
            });
            setLoading(false);
            return;
        }


        const storage = getStorage(app)
        const storageRef = ref(storage, `Profiles/${Date.now()}_${profile.name}`)
        const uploadTask = uploadBytesResumable(storageRef, profile)
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(prog);
            },
            (err) => {
                console.error("Upload failed", err)
                setLoading(false)
            },
            async () => {
                const ImgUrl: string = await getDownloadURL(uploadTask.snapshot.ref)
                const newStudentData = {
                    rollNumber: rollNumber,
                    branch: branch,
                    teamNum: teamNum,
                    profileImg: ImgUrl,
                    gender: gender
                }
                dispatch(FetchStudent(newStudentData))
                    .then((data) => {
                        setLoading(false)
                        if(data.payload){
                            toast({
                                title : data.payload.message
                            })
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                        setLoading(false)
                    });
            }
        )
    }
    return (
        <form onSubmit={handleSubmit} className="w-full h-full px-10 py-5 flex flex-col items-center gap-3">
            <FileUpload />
            <div className="flex gap-3 w-full">
                <div className="gap-3 mt-5 w-[50%]">
                    <Label htmlFor="rollnumber">Roll Number</Label>
                    <Input name="rollNumber" minLength={10} maxLength={10} id="rollnumber" className="bg-background" />
                </div>

                <div className="gap-3 w-[50%] mt-5">
                    <Label htmlFor="gender">Gender</Label>
                    <Select required name="gender">
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
            <div className="w-[100%]">
                <Label htmlFor="branch">Brach</Label>
                <Select required name="branch">
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

            <div className="w-[100%]">
                <Label htmlFor="team">Your Team</Label>
                <Select required name="team">
                    <SelectTrigger id="team" className="w-full p-5 bg-background">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
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

            {
                progress && progress < 100 ? <Progress value={progress} /> : null
            }
            <Button className="w-full p-5 mt-1">{loading ? "Uploading Profile ..." : "Create Your Profile"}</Button>
        </form>
    )
}
