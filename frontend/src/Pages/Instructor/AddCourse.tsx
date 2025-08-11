import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { courseSchemaFields } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import app from "@/lib/firebase";
import Videoplayer from "@/components/Common/VideoPlayer/Videoplayer";
import { useNavigate } from "react-router-dom";

const AddCourse = () => {
    const navigate = useNavigate()
    const [sections, setSections] = useState<
        { id: number; title: string; freePreview: boolean; videoUrl: string | null }[]
    >([{ id: 1, title: "", freePreview: false, videoUrl: null }]);

    const [formData, setFormData] = useState({
        title: "",
        thumbnail: "",
        subtitle: "",
        description: "",
        category: "",
        objectives: "",
        requirements: "",
        price: "",
        Level: "",
    });

    const addSection = () => {
        setSections((prev) => [
            ...prev,
            { id: prev.length + 1, title: "", freePreview: false, videoUrl: null },
        ]);
    };

    const deleteSection = (id: number) => {
        setSections((prev) => prev.filter((section) => section.id !== id));
    };

    const handleInputChange = (
        id: number,
        key: "title" | "freePreview" | "videoUrl",
        value: string | boolean | null
    ) => {
        setSections((prev) =>
            prev.map((section) =>
                section.id === id ? { ...section, [key]: value } : section
            )
        );
    };

    const handleFileChange = async (id: number, file: File | null) => {
        if (file) {
            try {
                // Validate file type
                if (!file.type.startsWith('video/')) {
                    alert('Please upload a valid video file');
                    return;
                }

                // Validate file size (e.g., max 100MB)
                const maxSize = 100 * 1024 * 1024; // 100MB in bytes
                if (file.size > maxSize) {
                    alert('File size should be less than 100MB');
                    return;
                }

                const storage = getStorage(app);
                const storageRef = ref(storage, `CourseVideos/${Date.now()}_${file.name}`);
                const uploadTask = uploadBytesResumable(storageRef, file);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log(`Upload is ${progress}% done`);
                    },
                    (error) => {
                        console.error("Error uploading video: ", error);
                        alert(`Error uploading video: ${error.message}`);
                    },
                    async () => {
                        try {
                            const videoUrl: string = await getDownloadURL(uploadTask.snapshot.ref);
                            console.log("Video uploaded and available at: ", videoUrl);
                            handleInputChange(id, "videoUrl", videoUrl);
                        } catch (error) {
                            console.error("Error getting download URL: ", error);
                            alert("Error getting video URL after upload");
                        }
                    }
                );
            } catch (error) {
                console.error("Error during file upload: ", error);
                alert(error instanceof Error ? error.message : "Error uploading file");
            }
        }
    };

    const handleThumbnailChange = async (file: File | null) => {
        if (file) {
            try {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    alert('Please upload a valid image file');
                    return;
                }

                // Validate file size (e.g., max 5MB)
                const maxSize = 5 * 1024 * 1024; // 5MB in bytes
                if (file.size > maxSize) {
                    alert('File size should be less than 5MB');
                    return;
                }

                const storage = getStorage(app);
                const storageRef = ref(storage, `CourseThumbnails/${Date.now()}_${file.name}`);
                const uploadTask = uploadBytesResumable(storageRef, file);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log(`Thumbnail upload is ${progress}% done`);
                    },
                    (error) => {
                        console.error("Error uploading thumbnail: ", error);
                        alert(`Error uploading thumbnail: ${error.message}`);
                    },
                    async () => {
                        try {
                            const thumbnailUrl: string = await getDownloadURL(uploadTask.snapshot.ref);
                            console.log("Thumbnail uploaded and available at: ", thumbnailUrl);
                            setFormData((prevData) => ({
                                ...prevData,
                                thumbnail: thumbnailUrl,
                            }));
                        } catch (error) {
                            console.error("Error getting download URL: ", error);
                            alert("Error getting thumbnail URL after upload");
                        }
                    }
                );
            } catch (error) {
                console.error("Error during thumbnail upload: ", error);
                alert(error instanceof Error ? error.message : "Error uploading thumbnail");
            }
        }
    };

    const handleInput = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((data) => ({
            ...data,
            [event.target.name]: event.target.value,
        }));
    };

    const isFormValid = () => {
        const requiredFields = [
            "title",
            "price",
            "requirements",
            "objectives",
            "thumbnail",
            "subtitle",
            "description",
            "category",
            "Level",
        ];
        const areFieldsValid = requiredFields.every((field) =>
            formData[field as keyof typeof formData]?.toString().trim() !== ""
        );
        const areSectionsValid = sections.every(
            (section) => section.title.trim() !== "" && section.videoUrl !== null
        );
        return areFieldsValid && areSectionsValid;
    };

    const handleFormSubmit = () => {
        const formSubmissionData = {
            ...formData,
            files: sections.map(({ id, title, freePreview, videoUrl }) => ({
                id,
                title,
                freePreview,
                videoUrl,
            })),
        };

        console.log("Submitting form data: ", formSubmissionData);
        fetch('https://course-management-system-2-2wm4.onrender.com/instructor/course/add', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials : "include",
            body: JSON.stringify(formSubmissionData)
        }).then(response => response.json())
            .then((data) => {
                console.log(data)
                navigate("/instructor/courses")
            })
            .catch((err) => {
                console.log(err)
            })
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!isFormValid()) {
            console.error("Form is invalid");
            return;
        }
        handleFormSubmit();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-3">
            <form onSubmit={handleSubmit} className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Course Details */}
                    <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-md p-4">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg mb-4">
                            <h1 className="text-xl font-bold">Create New Course</h1>
                            <p className="text-sm text-white/80">Fill in the details</p>
                        </div>
                        
                        <div className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
                            {courseSchemaFields.map((field, index) => (
                                <div key={field.label + index}>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                        {field.label}
                                    </label>
                                    
                                    {field.type === "text" || field.type === "number" ? (
                                        <Input
                                            onChange={handleInput}
                                            name={field.name}
                                            type={field.type}
                                            placeholder={field.label}
                                            className="border-gray-200"
                                        />
                                    ) : null}

                                    {field.type === "textarea" ? (
                                        <Textarea
                                            onChange={handleInput}
                                            name={field.name}
                                            placeholder={field.label}
                                            rows={4}
                                            className="border-gray-200"
                                        />
                                    ) : null}

                                    {field.type === "file" && field.name === "thumbnail" ? (
                                        <div className="space-y-2">
                                            <Input
                                                type="file"
                                                name={field.name}
                                                placeholder={field.label}
                                                onChange={(e) => handleThumbnailChange(e.target.files?.[0] ?? null)}
                                                className="border-gray-200"
                                            />
                                            {formData.thumbnail && (
                                                <img 
                                                    src={formData.thumbnail} 
                                                    alt="Course thumbnail" 
                                                    className="w-full h-32 object-cover rounded-md"
                                                />
                                            )}
                                        </div>
                                    ) : null}

                                    {field.type === "select" && field.options ? (
                                        <Select
                                            onValueChange={(value) =>
                                                setFormData((data) => ({ ...data, [field.name]: value }))
                                            }
                                        >
                                            <SelectTrigger className="w-full border-gray-200">
                                                <SelectValue placeholder={field.label} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {field.options.map((option, idx) => (
                                                    <SelectItem key={option + idx} value={option}>
                                                        {option}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Video Modules */}
                    <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-md p-4">
                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-lg mb-4">
                            <h1 className="text-xl font-bold">Course Content</h1>
                            <p className="text-sm text-white/80">Add sections and videos</p>
                        </div>
                        
                        <div className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
                            {sections.map((section) => (
                                <div
                                    key={section.id}
                                    className="border rounded-lg p-4"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-medium">Section {section.id}</h3>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="h-7 w-7 rounded-full p-0"
                                            onClick={() => deleteSection(section.id)}
                                        >
                                            ×
                                        </Button>
                                    </div>
                                    
                                    <Input
                                        placeholder="Enter section title"
                                        value={section.title}
                                        onChange={(e) => handleInputChange(section.id, "title", e.target.value)}
                                        className="mb-3"
                                    />

                                    {section.videoUrl ? (
                                        <div className="rounded-md overflow-hidden mb-3">
                                            <Videoplayer height="150px" width="100%" videoUrl={section.videoUrl} />
                                        </div>
                                    ) : (
                                        <Input
                                            type="file"
                                            placeholder="Upload Video"
                                            onChange={(e) => handleFileChange(section.id, e.target.files?.[0] ?? null)}
                                            className="mb-3"
                                        />
                                    )}
                                    
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            checked={section.freePreview}
                                            onCheckedChange={(checked) =>
                                                handleInputChange(section.id, "freePreview", Boolean(checked))
                                            }
                                        />
                                        <label className="text-sm text-gray-600">
                                            Free preview
                                        </label>
                                    </div>
                                </div>
                            ))}
                            
                            <Button 
                                className="w-full bg-blue-600 hover:bg-blue-700"
                                type="button" 
                                onClick={addSection}
                            >
                                Add Section
                            </Button>
                        </div>
                    </div>
                </div>
                
                <div className="mt-4">
                    <Button 
                        type="submit" 
                        disabled={!isFormValid()} 
                        className={`w-full py-2 ${
                            isFormValid() 
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                                : 'opacity-50 cursor-not-allowed'
                        }`}
                    >
                        {isFormValid() ? 'Create Course' : 'Please fill all required fields'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AddCourse;
