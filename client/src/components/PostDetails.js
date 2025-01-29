import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Clock, User, FileText, Code } from 'lucide-react';

const PostDetails = ({ post }) => {
    const { token } = useContext(AuthContext);
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
                console.log(post._id);
                
                const response = await fetch(
                    `http://localhost/api/auth/${post.author_id}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

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
        <div className="relative bg-gradient-to-br from-white via-blue-50 to-white p-8 rounded-3xl shadow-2xl mb-8 border-2 border-blue-100 overflow-hidden transition-all duration-300 ease-in-out hover:shadow-3xl">
            {/* Decorative Gradient Overlay */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-80"></div>

            {/* Post Header */}
            <div className="flex justify-between items-center border-b border-blue-200 pb-6 mb-6 relative">
                <div>
                    <h4 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-3 tracking-tight font-['Inter'] drop-shadow-sm">
                        {post.title || "Untitled Post"}
                    </h4>
                    <div className="flex items-center space-x-3 mb-2">
                        <User className="w-5 h-5 text-blue-600" />
                        <p className="text-sm text-gray-600 font-['Inter']">
                            Post Author:{" "}
                            <span className="text-blue-700 font-semibold tracking-wide">
                                {authorEmail}
                            </span>
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <p className="text-sm text-gray-500 italic font-['Roboto'] opacity-80">
                            {new Date(post.createdAt).toLocaleString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>
                    </div>
                </div>
                <div className="rounded-full bg-blue-100 text-blue-800 px-5 py-2 text-sm font-bold font-['Inter'] shadow-md transform hover:scale-105 transition-transform">
                    {post.file_type ? post.file_type.toUpperCase() : "OTHER"}
                </div>
            </div>

            {/* Post Content */}
            {post.content && (
                <div className="mb-6 group">
                    <h5 className="text-xl font-bold text-gray-900 mb-3 font-['Inter'] border-l-4 border-blue-500 pl-3 flex items-center">
                        <FileText className="w-6 h-6 mr-3 text-blue-600" />
                        Post Content
                    </h5>
                    <div className="bg-white p-6 rounded-xl border border-blue-100 text-gray-700 leading-relaxed font-['Roboto'] shadow-inner hover:shadow-lg transition-shadow">
                        {post.content}
                    </div>
                </div>
            )}

            {/* Code Snippet Section */}
            {codeSnippetContent && (
                <div className="bg-white p-6 rounded-xl mb-6 border border-blue-100 shadow-md hover:shadow-xl transition-shadow">
                    <h5 className="text-xl font-bold text-gray-900 mb-3 font-['Inter'] border-l-4 border-green-500 pl-3 flex items-center">
                        <Code className="w-6 h-6 mr-3 text-green-600" />
                        Code Snippet
                    </h5>
                    <pre
                        className={`bg-gray-50 p-5 rounded-lg overflow-auto text-sm font-['Fira Code'] text-gray-800 border border-gray-200 relative ${
                            isSnippetExpanded ? "" : "max-h-64"
                        }`}
                    >
                        {!isSnippetExpanded && (
                            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
                        )}
                        <code>
                            {isSnippetExpanded
                                ? codeSnippetContent
                                : limitContent(codeSnippetContent)}
                        </code>
                    </pre>
                    <button
                        onClick={() => setIsSnippetExpanded(!isSnippetExpanded)}
                        className="mt-4 px-4 py-2 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors font-['Inter'] flex items-center justify-center space-x-2 group"
                    >
                        <span>{isSnippetExpanded ? "Collapse" : "Expand"}</span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                            {isSnippetExpanded ? "▲" : "▼"}
                        </span>
                    </button>
                </div>
            )}

            {/* File Content Section */}
            {fileContent && (
                <div className="bg-white p-6 rounded-xl mb-6 border border-blue-100 shadow-md hover:shadow-xl transition-shadow">
                    <h5 className="text-xl font-bold text-gray-900 mb-3 font-['Inter'] border-l-4 border-purple-500 pl-3 flex items-center">
                        <FileText className="w-6 h-6 mr-3 text-purple-600" />
                        File Content
                    </h5>
                    <pre
                        className={`bg-gray-50 p-5 rounded-lg overflow-auto text-sm font-['Fira Code'] text-gray-800 border border-gray-200 relative ${
                            isFileExpanded ? "" : "max-h-64"
                        }`}
                    >
                        {!isFileExpanded && (
                            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
                        )}
                        <code>
                            {isFileExpanded ? fileContent : limitContent(fileContent)}
                        </code>
                    </pre>
                    <button
                        onClick={() => setIsFileExpanded(!isFileExpanded)}
                        className="mt-4 px-4 py-2 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors font-['Inter'] flex items-center justify-center space-x-2 group"
                    >
                        <span>{isFileExpanded ? "Collapse" : "Expand"}</span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                            {isFileExpanded ? "▲" : "▼"}
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default PostDetails;
