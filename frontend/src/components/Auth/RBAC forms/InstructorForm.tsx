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
} from "@/components/ui/select";
import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import app from "@/lib/firebase";
import { Progress } from "@/components/ui/progress";
import { FetchInstructor } from "@/components/store/slices/authSlice";
import { toast } from "@/hooks/use-toast";

export default function InstructorForm() {
    const dispatch = useDispatch<AppDispatch>();
    const [progress, setProgress] = useState<number>();
    const [loading, setLoading] = useState<boolean>(false);
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true)
        const formData = new FormData(event.currentTarget);
        const linkedIn = formData.get("linkedIn") as string;
        const gitHub = formData.get("gitHub") as string;
        const rollNumber = formData.get("rollNumber") as string;
        const branch = formData.get("branch") as string;
        const profile = formData.get("profile") as File;
        const college = formData.get("college") as string
        const UPI = formData.get("UPI") as string
        const gender = formData.get("gender") as string 
        const rollNumberVerify = /^[A-Z0-9]{10}$/;
        if (!rollNumberVerify.test(rollNumber)) {
            toast({
                title: "invalid rollNumber",
                variant: "destructive"
            });
            setLoading(false);
            return;
        }
        if (profile) {
            const storage = getStorage(app);
            const storageRef = ref(storage, `Profiles/${Date.now()}_${profile.name}`);
            const uploadTask = uploadBytesResumable(storageRef, profile);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    setProgress(prog);
                },
                (error) => {
                    console.error("Upload failed", error)
                    setLoading(false)
                },
                async () => {
                    const ImgUrl: string = await getDownloadURL(uploadTask.snapshot.ref)
                    const NewFormData: instructorFormData = {
                        linkedIn: linkedIn,
                        gitHub: gitHub,
                        rollNumber: rollNumber,
                        branch: branch,
                        profileImg: ImgUrl,
                        UPI : UPI,
                        college : college ,
                        gender : gender
                    };
                    dispatch(FetchInstructor(NewFormData))
                        .then(() => {
                            setLoading(false)
                        })
                        .catch((err) => {
                            console.log(err);
                            setLoading(false)
                        });
                }
            );
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="w-full h-full px-10 py-5 flex flex-col items-center gap-3">
                <FileUpload />

                <div className="w-full flex gap-5 mt-6">
                    <div className="gap-3 w-full">
                        <Label htmlFor="name">LinkedIn Profile</Label>
                        <Input name="linkedIn" id="name" className="bg-background" />
                    </div>

                    <div className="gap-3 w-full">
                        <Label htmlFor="email">GitHub Profile</Label>
                        <Input name="gitHub" id="email" className="bg-background" />
                    </div>
                </div>

                <div className="gap-5 w-full flex justify-between">
                    <div className="w-[30%]">
                        <Label htmlFor="rollnumber">Roll Number</Label>
                        <Input name="rollNumber" minLength={10} maxLength={10} id="rollnumber" className="bg-background" />
                    </div>

                    <div className="w-[30%]">
                        <Label htmlFor="gender">Gender</Label>
                        <Select required name="gender">
                            <SelectTrigger id="gender" className="w-full p-5 bg-background">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Transgender">Transgender</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="w-[30%]">
                        <Label htmlFor="college">College</Label>
                        <Input name="college" id="college" className="bg-background" />
                    </div>
                </div>

                <div className="w-[100%] flex gap-5">
                    <div className="w-[50%]">
                        <Label htmlFor="branch">Branch</Label>
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

                    <div className="w-[50%]">
                        <Label htmlFor="UPI">UPI id</Label>
                        <Input id="UPI" name="UPI" className="bg-background"/>
                    </div>
                </div>
                {
                    progress && progress < 100 ? <Progress value={progress} /> : null
                }
                <Button className="w-full p-5 mt-1">{loading ? "Uploading Profile ..." : "Create Your Profile"}</Button>
            </form>
        </>
    );
}
