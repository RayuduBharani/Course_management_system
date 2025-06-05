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
import { 
    getStorage, 
    ref, 
    uploadBytesResumable,
    getDownloadURL 
} from "firebase/storage";
import { FirebaseError } from 'firebase/app';
import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function StudentForm() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [progress, setProgress] = useState<number>();
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const uploadToFirebase = async (file: File): Promise<string> => {
        try {
            const storage = getStorage(app);
            const timestamp = Date.now();
            const fileExtension = file.name.split('.').pop();
            const uniqueFileName = `${timestamp}_${Math.random().toString(36).substring(2)}.${fileExtension}`;
            const storageRef = ref(storage, `Profiles/${uniqueFileName}`);
            
            const uploadTask = uploadBytesResumable(storageRef, file);
            
            return new Promise((resolve, reject) => {
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                        setProgress(prog);
                    },
                    (error) => {
                        console.error("Upload failed:", error);
                        if (error instanceof FirebaseError) {
                            reject(new Error(`Firebase upload failed: ${error.message}`));
                        } else {
                            reject(new Error("File upload failed"));
                        }
                    },
                    async () => {
                        try {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve(downloadURL);
                        } catch (error) {
                            console.error("Failed to get download URL:", error);
                            reject(new Error("Failed to get file URL"));
                        }
                    }
                );
            });
        } catch (error) {
            console.error("Firebase initialization error:", error);
            throw new Error("Failed to initialize upload");
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        
        try {            const formData = new FormData(event.currentTarget);
            const rollNumber = formData.get("rollNumber") as string;
            const branch = formData.get("branch") as string;
            const teamNum = formData.get("team") as string;
            const gender = formData.get("gender") as string;

            // Validate team number
            if (!teamNum || !teamNum.match(/^Team-([1-9]|10)$/)) {
                toast({
                    title: "Invalid team number",
                    description: "Please select a valid team",
                    variant: "destructive"
                });
                setLoading(false);
                return;
            }

            // Validate roll number
            const rollNumberVerify = /^[A-Z0-9]{10}$/;
            if (!rollNumberVerify.test(rollNumber)) {
                toast({
                    title: "Invalid roll number format",
                    description: "Roll number must be 10 characters long and contain only capital letters and numbers",
                    variant: "destructive"
                });
                setLoading(false);
                return;
            }

            // Validate file selection
            if (!selectedFiles[0]) {
                toast({
                    title: "Profile image required",
                    description: "Please select a profile image",
                    variant: "destructive"
                });
                setLoading(false);
                return;
            }

            // Upload image and get URL
            const profileImgUrl = await uploadToFirebase(selectedFiles[0]);

            // Submit form data
            const studentData = {
                rollNumber,
                branch,
                teamNum,
                gender,
                profileImg: profileImgUrl
            };

            const result = await dispatch(FetchStudent(studentData)).unwrap();
            
            if (result.success) {
                toast({
                    title: result.message || "Registration successful",
                    variant: "default"
                });
                navigate("/student/dashboard");
            } else {
                toast({
                    title: result.message || "Registration failed",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error("Form submission failed:", error);
            toast({
                title: "Form submission failed",
                description: error instanceof Error ? error.message : "Please try again",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full h-full px-10 py-5 flex flex-col items-center gap-3">
            <FileUpload 
                onChange={(files) => setSelectedFiles(files)}
                value={selectedFiles}
            />
            {progress !== undefined && progress < 100 && (
                <Progress value={progress} className="w-full h-2" />
            )}
            <div className="flex gap-3 w-full">
                <div className="gap-3 mt-5 w-[50%]">
                    <Label htmlFor="rollnumber">Roll Number</Label>
                    <Input required name="rollNumber" minLength={10} maxLength={10} id="rollnumber" className="bg-background" placeholder="e.g., 21A91A05J5" />
                </div>

                <div className="gap-3 w-[50%] mt-5">
                    <Label htmlFor="gender">Gender</Label>
                    <Select required name="gender">
                        <SelectTrigger id="gender" className="w-full p-5 bg-background">
                            <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex gap-3 w-full">
                <div className="gap-3 mt-5 w-[50%]">
                    <Label htmlFor="branch">Branch</Label>
                    <Select required name="branch">
                        <SelectTrigger id="branch" className="w-full p-5 bg-background">
                            <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="CSD">Computer Science & Design</SelectItem>
                            <SelectItem value="CAI">Computer Science & AI</SelectItem>
                            <SelectItem value="AID">Artificial Intelligence & Data Science</SelectItem>
                            <SelectItem value="CMS">Computer Science & Machine learing</SelectItem>
                            <SelectItem value="CSC">Computer Science & Cyber Security</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="gap-3 w-[50%] mt-5">
                    <Label htmlFor="team">Team</Label>
                    <Select required name="team">
                        <SelectTrigger id="team" className="w-full p-5 bg-background">
                            <SelectValue placeholder="Select team" />
                        </SelectTrigger>                        
                        <SelectContent>                            
                            <SelectItem value="Team-1">Team 1</SelectItem>
                            <SelectItem value="Team-2">Team 2</SelectItem>
                            <SelectItem value="Team-3">Team 3</SelectItem>
                            <SelectItem value="Team-4">Team 4</SelectItem>
                            <SelectItem value="Team-5">Team 5</SelectItem>
                            <SelectItem value="Team-6">Team 6</SelectItem>
                            <SelectItem value="Team-7">Team 7</SelectItem>
                            <SelectItem value="Team-8">Team 8</SelectItem>
                            <SelectItem value="Team-9">Team 9</SelectItem>
                            <SelectItem value="Team-10">Team 10</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Button disabled={loading} type="submit" className="w-[50%] mt-10">
                {loading ? "Submitting..." : "Submit"}
            </Button>
        </form>
    );
}
