import { useState } from "react";
import axios from "axios";

const UploadImage = () => {
  const [image, setImage] = useState(null);
  const [output, setOutput] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setOutput(null); // Reset output saat gambar baru di-upload
  };

  const handleSubmit = async () => {
    if (!image) return alert("Please upload an image first.");

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        setOutput(response.data);
      } else {
        alert("Image compression failed.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(`Failed to upload image: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10 px-5">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-blue-600">
          Image Compressor
        </h1>

        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300"
        >
          Upload & Compress
        </button>

        {output && (
          <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-10">
            {/* Gambar Asli */}
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">Original Image</h3>
              <img
                src={`http://127.0.0.1:5000${output.original_image}`}
                alt="Original"
                className="w-full max-w-xs  rounded-lg shadow-lg"
              />
              <p className="mt-2 text-sm text-gray-500">
                Size: {output.original_size}
              </p>
            </div>

            {/* Gambar Terkompresi */}
            <div className=" text-center">
              <h3 className="text-xl font-bold mb-4">Compressed Image</h3>
              <img
                src={`http://127.0.0.1:5000${output.compressed_image}`}
                alt="Compressed"
                className="w-full  max-w-xs rounded-lg shadow-lg"
              />
              <p className="mt-2 text-sm text-gray-500">
                Size: {output.compressed_size}
              </p>
            </div>
          </div>
        )}
        
      </div>
      <div className="text-center mt-10"> 
      <marquee  direction="left">
          <p className="text-xl text-gray-300" >  Created By :  Aditya Putra - 212310025 & Adrian Adhari - 212310035 & Nagasa Anandes Putra - 212310048</p>
      </marquee>
          <p className="text-md text-gray-300">TI-21-KA</p>
          
        </div>
    </div>
  );
};

export default UploadImage;
