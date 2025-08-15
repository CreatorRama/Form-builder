import { useState } from 'react';
import axios from 'axios';

const ImageUpload = ({ label, currentImage, onImageUpload }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setIsUploading(true);
      // In a real app, you would upload to a service like Cloudinary or your own server
      // For demo purposes, we'll just use a mock URL
      const mockUrl = URL.createObjectURL(file);
      onImageUpload(mockUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mb-4">
      <label className="block mb-2 font-medium">{label}</label>
      {currentImage ? (
        <div className="flex items-center">
          <img src={currentImage} alt="Uploaded" className="w-32 h-32 object-cover rounded mr-4" />
          <button
            onClick={() => onImageUpload('')}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center">
          {isUploading ? (
            <p>Uploading...</p>
          ) : (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id={`image-upload-${label}`}
              />
              <label
                htmlFor={`image-upload-${label}`}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
              >
                Upload Image
              </label>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;