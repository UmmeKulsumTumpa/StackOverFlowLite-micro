import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { PlusIcon, ArrowUpTrayIcon, CodeBracketIcon } from "@heroicons/react/24/outline";

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

        if (file) {
            formData.append("file", file);
        }
        if (codeSnippet) {
            formData.append("codeSnippet", codeSnippet);
        }

        try {
            const response = await fetch("http://localhost:8002/api/posts", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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
                setTimeout(() => {
                    navigate("/profile");
                }, 1000);
            } else {
                setError(data.message || "Failed to create post.");
                if (response.status === 401) {
                    logout();
                }
            }
        } catch (error) {
            setError("Failed to create post. Please try again.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-6 bg-gradient-to-r from-blue-50 to-white rounded-lg shadow-lg">
            <h2 className="text-4xl font-bold text-blue-800 mb-6 flex items-center justify-center">
                <PlusIcon className="w-8 h-8 mr-3 text-blue-600" />
                Create a New Post
            </h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{success}</span>
                </div>
            )}

            <div className="space-y-6">
                <div>
                    <label className="block text-blue-700 text-lg font-semibold mb-2">
                        Title:
                        <input
                            type="text"
                            placeholder="Enter a title for your post..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </label>
                </div>

                <div>
                    <label className="block text-blue-700 text-lg font-semibold mb-2">
                        Content:
                        <textarea
                            placeholder="Write your post content here..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows="4"
                            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </label>
                </div>

                <div>
                    <label className="block text-blue-700 text-lg font-semibold mb-2 flex items-center">
                        <CodeBracketIcon className="w-6 h-6 mr-2 text-blue-600" />
                        Select Language (for Code Snippet):
                    </label>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">-- Select Language --</option>
                        <option value="txt">Plain Text</option>
                        <option value="c">C</option>
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                        <option value="python">Python</option>
                        <option value="javascript">JavaScript</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                        <option value="json">JSON</option>
                        <option value="xml">XML</option>
                        <option value="ruby">Ruby</option>
                        <option value="php">PHP</option>
                        <option value="go">Go</option>
                        <option value="swift">Swift</option>
                    </select>
                </div>

                <div>
                    <label className="block text-blue-700 text-lg font-semibold mb-2 flex items-center">
                        <CodeBracketIcon className="w-6 h-6 mr-2 text-blue-600" />
                        Paste Code Snippet:
                    </label>
                    <textarea
                        placeholder="Paste your code snippet here..."
                        value={codeSnippet}
                        onChange={(e) => setCodeSnippet(e.target.value)}
                        rows="6"
                        className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    />
                </div>

                <div>
                    <label className="block text-blue-700 text-lg font-semibold mb-2 flex items-center">
                        <ArrowUpTrayIcon className="w-6 h-6 mr-2 text-blue-600" />
                        Upload a File:
                    </label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="mt-2 block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleCreatePost}
                        className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-400 transition duration-300"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Create Post
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
