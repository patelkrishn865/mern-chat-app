import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import { uploadFile } from '../helpers/uploadFile';
import axios from 'axios'
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: ""
  });
  const [uploadPhoto, setUploadPhoto] = useState("");
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    const uploadPhoto = await uploadFile(file);
    setUploadPhoto(file);
    setData((prev) => {
      return {
        ...prev,
        profile_pic: uploadPhoto?.url
      };
    });
  };

  const handleClearUploadPhoto = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setUploadPhoto(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/register`;

    try {
      const response = await axios.post(URL, data);
      console.log("response", response);
      toast.success(response.data.message);

      if (response.data.success) {
        setData({
          name: "",
          email: "",
          password: "",
          profile_pic: ""
        });
        navigate('/email');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    console.log('data', data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e1223] text-white">
      <div className="bg-[#1a1f38] w-full max-w-md rounded overflow-hidden p-6 mx-auto">
        <h3 className="text-3xl font-bold text-white mb-4">Welcome to ODINIX!</h3>

        <form className="grid gap-6 mt-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-[#a8b2c1]">Name :</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              className="bg-[#f1f5f9] text-black px-3 py-2 focus:outline-none rounded"
              value={data.name}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-[#a8b2c1]">Email :</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="bg-[#f1f5f9] text-black px-3 py-2 focus:outline-none rounded"
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-[#a8b2c1]">Password :</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="bg-[#f1f5f9] text-black px-3 py-2 focus:outline-none rounded"
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="profile_pic" className="text-[#a8b2c1]">Photo :</label>
            <div className="h-14 bg-[#f1f5f9] flex justify-between items-center px-4 py-2 border rounded cursor-pointer">
              <p className="text-sm text-black max-w-[300px] text-ellipsis line-clamp-1">
                {uploadPhoto?.name ? uploadPhoto?.name : "Upload profile photo"}
              </p>
              {uploadPhoto?.name && (
                <button className="text-lg text-black ml-2 hover:text-red-600" onClick={handleClearUploadPhoto}>
                  <IoClose />
                </button>
              )}
            </div>
            <input
              type="file"
              id="profile_pic"
              name="profile_pic"
              className="hidden"
              onChange={handleUploadPhoto}
            />
          </div>

          <button
            className="bg-[#48ff48] text-lg px-4 py-2 hover:bg-[#3ae43a] rounded mt-2 font-bold text-black"
          >
            Register
          </button>
        </form>

        <p className="my-3 text-center text-[#a8b2c1]">Already have an account? 
          <Link to="/email" className="text-[#48ff48] hover:text-[#3ae43a] font-semibold"> Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
