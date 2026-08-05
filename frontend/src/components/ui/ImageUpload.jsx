import { useState, useRef } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'sonner';

const ImageUpload = ({ value, onChange, variant = 'dark' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await uploadFile(files[0]);
    }
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await uploadFile(files[0]);
    }
  };

  const uploadFile = async (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('my_file', file);

    try {
      const response = await api.post('/api/admin/vehicles/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data?.success && response.data?.result?.secure_url) {
        onChange(response.data.result.secure_url);
        console.log(response.data.result.secure_url);

        toast.success('Image uploaded successfully');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Error uploading image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const clearImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onChange('');
  };

  const isDark = variant === 'dark';

  return (
    <div className="w-full">
      <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
        Vehicle Image
      </label>

      <div
        className={`relative border-2 border-dashed rounded-xl p-4 transition-all ${isDragging
          ? isDark ? 'border-blue-500 bg-blue-500/10' : 'border-blue-500 bg-blue-50'
          : value
            ? isDark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-300 bg-slate-50'
            : isDark ? 'border-slate-600 hover:border-slate-500 bg-slate-900' : 'border-slate-300 hover:border-slate-400 bg-white'
          } flex flex-col items-center justify-center text-center cursor-pointer min-h-[160px] overflow-hidden group`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !value && !isUploading && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin mb-2 text-blue-500" />
            <span className="text-sm font-medium">Uploading image...</span>
          </div>
        ) : value ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={value}
              alt="Vehicle preview"
              className="max-h-40 rounded-lg object-contain"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
              <button
                type="button"
                onClick={clearImage}
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
                title="Remove image"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div className={`flex flex-col items-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <div className={`${isDark ? 'bg-slate-800 group-hover:bg-slate-700' : 'bg-slate-100 group-hover:bg-slate-200'} p-3 rounded-full mb-3 transition-colors`}>
              <UploadCloud className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <p className="text-sm font-medium mb-1">
              <span className={isDark ? 'text-blue-400' : 'text-blue-600'}>Click to upload</span> or drag and drop
            </p>
            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>SVG, PNG, JPG or GIF (max. 5MB)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
