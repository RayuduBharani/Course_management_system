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
import { 
    getStorage, 
    ref, 
    uploadBytesResumable,
    getDownloadURL 
} from "firebase/storage";
import { FirebaseError } from 'firebase/app';
import app from "@/lib/firebase";
import { Progress } from "@/components/ui/progress";
import { FetchInstructor } from "@/components/store/slices/authSlice";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function InstructorForm() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [progress, setProgress] = useState<number>();
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const uploadToFirebase = async (file: File): Promise<string> => {
        try {            const storage = getStorage(app);            const timestamp = Date.now();
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
        
        try {
            const formData = new FormData(event.currentTarget);
            const rollNumber = formData.get("rollNumber") as string;
            const branch = formData.get("branch") as string;
            const college = formData.get("college") as string;
            const gender = formData.get("gender") as string;
            const linkedIn = formData.get("linkedIn") as string;
            const gitHub = formData.get("gitHub") as string;
            const UPI = formData.get("UPI") as string;

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

            // Validate LinkedIn URL
            if (linkedIn && !linkedIn.includes('linkedin.com')) {
                toast({
                    title: "Invalid LinkedIn URL",
                    description: "Please enter a valid LinkedIn profile URL",
                    variant: "destructive"
                });
                setLoading(false);
                return;
            }

            // Validate GitHub URL
            if (gitHub && !gitHub.includes('github.com')) {
                toast({
                    title: "Invalid GitHub URL",
                    description: "Please enter a valid GitHub profile URL",
                    variant: "destructive"
                });
                setLoading(false);
                return;
            }

            // Upload image and get URL
            const profileImgUrl = await uploadToFirebase(selectedFiles[0]);

            // Submit form data
            const instructorData = {
                rollNumber,
                branch,
                college,
                gender,
                linkedIn,
                gitHub,
                UPI,
                profileImg: profileImgUrl
            };

            const result = await dispatch(FetchInstructor(instructorData)).unwrap();
            
            if (result.success) {
                toast({
                    title: result.message || "Registration successful",
                    variant: "default"
                });
                navigate("/instructor/dashboard");
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
                            <SelectItem value="CSE">Computer Science</SelectItem>
                            <SelectItem value="IT">Information Technology</SelectItem>
                            <SelectItem value="ECE">Electronics & Communication</SelectItem>
                            <SelectItem value="EEE">Electrical & Electronics</SelectItem>
                            <SelectItem value="MECH">Mechanical</SelectItem>
                            <SelectItem value="CIVIL">Civil</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="gap-3 w-[50%] mt-5">
                    <Label htmlFor="college">College</Label>
                    <Input required name="college" id="college" className="bg-background" placeholder="Enter your college name" />
                </div>
            </div>

            <div className="flex gap-3 w-full">
                <div className="gap-3 mt-5 w-[50%]">
                    <Label htmlFor="linkedIn">LinkedIn Profile</Label>
                    <Input required name="linkedIn" id="linkedIn" type="url" className="bg-background" placeholder="https://linkedin.com/in/username" />
                </div>

                <div className="gap-3 w-[50%] mt-5">
                    <Label htmlFor="gitHub">GitHub Profile</Label>
                    <Input required name="gitHub" id="gitHub" type="url" className="bg-background" placeholder="https://github.com/username" />
                </div>
            </div>

            <div className="flex gap-3 w-full">
                <div className="gap-3 mt-5 w-[50%]">
                    <Label htmlFor="UPI">UPI ID</Label>
                    <Input required name="UPI" id="UPI" className="bg-background" placeholder="Enter your UPI ID" />
                </div>
            </div>

            <Button disabled={loading} type="submit" className="w-[50%] mt-10">
                {loading ? "Submitting..." : "Submit"}
            </Button>
        </form>
    );
}