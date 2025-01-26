import React, { useState, useEffect } from "react";

const PostDetails = ({ post }) => {
    const [fileContent, setFileContent] = useState(null);
    const [codeSnippetContent, setCodeSnippetContent] = useState(null);
    const [authorEmail, setAuthorEmail] = useState("Loading...");
    const [isFileExpanded, setIsFileExpanded] = useState(false);
    const [isSnippetExpanded, setIsSnippetExpanded] = useState(false);

    useEffect(() => {
        const fetchFileContent = async () => {
            if (post.file_url) {
                try {
                    const response = await fetch(post.file_url);
                    if (!response.ok) {
                        throw new Error(`Error fetching file: ${response.statusText}`);
                    }
                    const text = await response.text();
                    setFileContent(text);
                } catch (error) {
                    console.error("Error fetching file content:", error);
                    setFileContent("Error loading file content.");
                }
            }
        };

        const fetchCodeSnippetContent = async () => {
            if (post.code_snippet_url) {
                try {
                    const response = await fetch(post.code_snippet_url);
                    if (!response.ok) {
                        throw new Error(`Error fetching code snippet: ${response.statusText}`);
                    }
                    const text = await response.text();
                    setCodeSnippetContent(text);
                } catch (error) {
                    console.error("Error fetching code snippet:", error);
                    setCodeSnippetContent("Error loading code snippet.");
                }
            }
        };

        const fetchAuthorEmail = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8001/api/auth/${post.author_id}`
                ); // Update endpoint based on your backend route
                if (!response.ok) {
                    throw new Error("Failed to fetch author details");
                }
                const data = await response.json();
                setAuthorEmail(data.email || "Unknown Author");
            } catch (error) {
                console.error("Error fetching author email:", error);
                setAuthorEmail("Error fetching author");
            }
        };

        fetchFileContent();
        fetchCodeSnippetContent();
        fetchAuthorEmail();
    }, [post]);

    const limitContent = (content, length = 1000) => {
        return content.length > length ? content.substring(0, length) + "..." : content;
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-md mb-8 border border-gray-500 hover:shadow-lg transition-shadow">
            {/* Post Header */}
            <div className="flex justify-between items-center border-b pb-4 mb-6">
                <div>
                    <h4 className="text-3xl font-extrabold text-gray-900 mb-2">
                        {post.title || "Untitled Post"}
                    </h4>
                    <p className="text-sm text-gray-600">
                        Post Author:{" "}
                        <span className="text-blue-600 font-medium">
                            {authorEmail}
                        </span>
                    </p>
                    <p className="text-sm text-gray-600">
                        Published on:{" "}
                        <span className="text-sm text-gray-500 italic">
                        {new Date(post.createdAt).toLocaleString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                        </span>
                    </p>
                </div>
                <div className="rounded-full bg-blue-100 text-blue-700 px-4 py-1 text-sm font-bold">
                    {post.file_type ? post.file_type.toUpperCase() : "OTHER"}
                </div>
            </div>

            {/* Post Content */}
            {post.content && (
                <div className="mb-6">
                    <h5 className="text-lg font-bold text-gray-800 mb-2">
                        Post Content:
                    </h5>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-700 leading-relaxed font-sans">
                        {post.content}
                    </div>
                </div>
            )}

            {/* Code Snippet Section */}
            {codeSnippetContent && (
                <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
                    <h5 className="text-lg font-bold text-gray-800 mb-2">
                        Code Snippet:
                    </h5>
                    <pre
                        className={`bg-gray-100 p-4 rounded-lg overflow-auto text-sm font-mono text-gray-800 ${
                            isSnippetExpanded ? "" : "max-h-200"
                        }`}
                    >
                        <code>
                            {isSnippetExpanded
                                ? codeSnippetContent
                                : limitContent(codeSnippetContent)}
                        </code>
                    </pre>
                    <button
                        onClick={() => setIsSnippetExpanded(!isSnippetExpanded)}
                        className="mt-3 text-blue-600 font-medium hover:underline"
                    >
                        {isSnippetExpanded ? "Collapse" : "Expand"}
                    </button>
                </div>
            )}

            {/* File Content Section */}
            {fileContent && (
                <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
                    <h5 className="text-lg font-bold text-gray-800 mb-2">
                        File Content:
                    </h5>
                    <pre
                        className={`bg-gray-100 p-4 rounded-lg overflow-auto text-sm font-mono text-gray-800 ${
                            isFileExpanded ? "" : "max-h-200"
                        }`}
                    >
                        <code>
                            {isFileExpanded ? fileContent : limitContent(fileContent)}
                        </code>
                    </pre>
                    <button
                        onClick={() => setIsFileExpanded(!isFileExpanded)}
                        className="mt-3 text-blue-600 font-medium hover:underline"
                    >
                        {isFileExpanded ? "Collapse" : "Expand"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default PostDetails;
