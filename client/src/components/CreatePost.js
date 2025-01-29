import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { Plus, Upload, Code, AlertTriangle, CheckCircle2 } from "lucide-react";

const CreatePost = () => {
    const { user, token, logout } = useContext(AuthContext);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [file, setFile] = useState(null);
    const [codeSnippet, setCodeSnippet] = useState("");
    const [language, setLanguage] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        setFile(uploadedFile);
        if (uploadedFile) {
            const extension = uploadedFile.name.substring(uploadedFile.name.lastIndexOf(".") + 1).toLowerCase();
            setLanguage(extension);
        }
    };

    const handleCreatePost = async () => {
        if (!title && !content && !file && !codeSnippet) {
            setError("Title, content, or a file/code snippet is required.");
            return;
        }

        if (codeSnippet && !language) {
            setError("Please select a language for the code snippet.");
            return;
        }

        if (!user || !user._id) {
            setError("User is not authenticated.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title || "Untitled");
        formData.append("content", content);
        formData.append("fileType", language);

        if (file) formData.append("file", file);
        if (codeSnippet) formData.append("codeSnippet", codeSnippet);

        try {
            const response = await fetch("http://localhost/api/posts", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess("Post created successfully!");
                setTitle("");
                setContent("");
                setFile(null);
                setCodeSnippet("");
                setLanguage("");
                setError(null);
                setTimeout(() => navigate("/profile"), 1000);
            } else {
                setError(data.message || "Failed to create post.");
                if (response.status === 401) logout();
            }
        } catch (error) {
            setError("Failed to create post. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="relative mb-12">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25"></div>
                    <div className="relative bg-white p-8 rounded-2xl shadow-xl">
                        <div className="flex justify-center mb-4">
                            <Plus className="w-12 h-12 text-blue-600" />
                        </div>
                        <h2 className="text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            Create New Post
                        </h2>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 transform hover:scale-[1.01] transition-all">
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl">
                            <AlertTriangle className="w-5 h-5" />
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="mb-6 transform hover:scale-[1.01] transition-all">
                        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl">
                            <CheckCircle2 className="w-5 h-5" />
                            <span>{success}</span>
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    {[
                        {
                            label: "Title",
                            element: (
                                <input
                                    type="text"
                                    placeholder="Enter a title for your post..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="mt-2 w-full p-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                />
                            ),
                        },
                        {
                            label: "Content",
                            element: (
                                <textarea
                                    placeholder="Write your post content here..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows="4"
                                    className="mt-2 w-full p-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                />
                            ),
                        },
                    ].map((field, index) => (
                        <div
                            key={field.label}
                            className="transform hover:scale-[1.01] transition-all duration-200"
                            style={{
                                opacity: 0,
                                animation: `fadeIn 0.5s ease-out forwards ${index * 0.1}s`,
                            }}
                        >
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl blur opacity-25"></div>
                                <div className="relative bg-white p-6 rounded-xl">
                                    <label className="block text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                        {field.label}
                                    </label>
                                    {field.element}
                                </div>
                            </div>
                        </div>
                    ))}

                    <style>
                        {`
                            @keyframes fadeIn {
                                from { opacity: 0; transform: translateY(20px); }
                                to { opacity: 1; transform: translateY(0); }
                            }
                        `}
                    </style>

                    <div className="transform hover:scale-[1.01] transition-all duration-200">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl blur opacity-25"></div>
                            <div className="relative bg-white p-6 rounded-xl space-y-6">
                                <div>
                                    <label className="flex items-center text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                        <Code className="w-5 h-5 mr-2" />
                                        Code Snippet
                                    </label>
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="mt-2 w-full p-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                    >
                                        <option value="">-- Select Language --</option>
                                        {[
                                            "txt", "c", "cpp", "java", "python", "javascript",
                                            "html", "css", "json", "xml", "ruby", "php", "go", "swift"
                                        ].map(lang => (
                                            <option key={lang} value={lang}>
                                                {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                    <textarea
                                        placeholder="Paste your code snippet here..."
                                        value={codeSnippet}
                                        onChange={(e) => setCodeSnippet(e.target.value)}
                                        rows="6"
                                        className="mt-4 w-full p-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-mono text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                        <Upload className="w-5 h-5 mr-2" />
                                        Upload File
                                    </label>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="mt-2 block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-xl file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-gradient-to-r file:from-blue-50 file:to-purple-50
                                            file:text-blue-700
                                            hover:file:bg-blue-100
                                            focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center pt-6">
                        <button
                            onClick={handleCreatePost}
                            className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200"
                        >
                            <div className="flex items-center gap-2">
                                <Plus className="w-5 h-5 transform group-hover:rotate-90 transition-transform duration-200" />
                                Create Post
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
