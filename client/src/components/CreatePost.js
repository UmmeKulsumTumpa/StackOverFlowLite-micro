import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";

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
            // Extract the file extension from the last dot
            const extension = uploadedFile.name.substring(uploadedFile.name.lastIndexOf('.') + 1).toLowerCase();
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
            console.log(data);

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
            console.error("Error creating post:", error);
            setError("Failed to create post. Please try again.");
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-6 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Create a New Post
            </h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}

            <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-semibold">
                    Title:
                </label>
                <input
                    type="text"
                    placeholder="Enter a title for your post..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <textarea
                placeholder="Write your post content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="4"
                className="w-full p-4 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Select Language */}
            <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-semibold">
                    Select Language (for Code Snippet):
                </label>
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            {/* Paste Code Snippet */}
            <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-semibold">
                    Paste Code Snippet:
                </label>
                <textarea
                    placeholder="Paste your code snippet here..."
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    rows="6"
                    className="w-full p-4 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Upload a File */}
            <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-semibold">
                    Upload a File:
                </label>
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
            </div>

            <button
                onClick={handleCreatePost}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            >
                Create Post
            </button>
        </div>
    );
};

export default CreatePost;
