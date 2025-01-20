import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Upload, 
  Loader2, 
  AlertCircle,
  Check,
  X
} from 'lucide-react';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [fileFormat, setFileFormat] = useState('.txt');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const navigate = useNavigate();

  const fileFormats = [
    { value: '.txt', label: 'Text File (.txt)' },
    { value: '.cpp', label: 'C++ File (.cpp)' },
    { value: '.js', label: 'JavaScript File (.js)' },
    { value: '.java', label: 'Java File (.java)' }
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (uploadedFile) => {
    setFile(uploadedFile);
    
    // Preview file content if it's a text file
    if (uploadedFile && uploadedFile.type.includes('text')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewContent(e.target.result);
      reader.readAsText(uploadedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('file', file);
    formData.append('fileFormat', fileFormat);

    try {
      const response = await axios.post('http://localhost:8001/api/posts/createPost', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Post created successfully:', response.data);
      navigate('/posts');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create a New Post</h1>
          <p className="mt-2 text-gray-600">Share your thoughts and code with the community</p>
        </div>

        {/* Main Form */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Post Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter a descriptive title"
                required
              />
            </div>

            {/* Content Textarea */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Post Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Write your post content here..."
                required
              />
            </div>

            {/* File Format Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                File Format
              </label>
              <select
                value={fileFormat}
                onChange={(e) => setFileFormat(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                {fileFormats.map((format) => (
                  <option key={format.value} value={format.value}>
                    {format.label}
                  </option>
                ))}
              </select>
            </div>

            {/* File Upload Area */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload File
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 transition-colors 
                  ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                  ${file ? 'bg-green-50' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center justify-center space-y-3">
                  {file ? (
                    <>
                      <Check className="h-8 w-8 text-green-500" />
                      <div className="text-sm text-center">
                        <p className="font-medium text-green-600">{file.name}</p>
                        <p className="text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Remove file
                      </button>
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-gray-400" />
                      <div className="text-sm text-center text-gray-600">
                        <p className="font-medium">Drag and drop your file here</p>
                        <p>or</p>
                        <label className="cursor-pointer text-blue-500 hover:text-blue-700">
                          browse files
                          <input
                            type="file"
                            onChange={(e) => handleFileChange(e.target.files[0])}
                            className="hidden"
                            accept={fileFormat}
                          />
                        </label>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* File Preview */}
            {previewContent && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">File Preview:</h3>
                <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm">
                  {previewContent.slice(0, 500)}
                  {previewContent.length > 500 && '...'}
                </pre>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center space-x-2">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
                <button 
                  type="button"
                  onClick={() => setError('')}
                  className="ml-auto"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !file}
                className={`flex items-center px-6 py-2 rounded-md text-white font-medium
                  ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
                  transition-colors disabled:opacity-50`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Creating Post...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-5 w-5" />
                    Create Post
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;