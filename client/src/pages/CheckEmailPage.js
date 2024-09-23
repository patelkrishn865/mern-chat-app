import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import toast from 'react-hot-toast';
import { PiUserCircle } from "react-icons/pi";

const CheckEmailPage = () => {
  const [data, setData] = useState({
    email: "",
  })
  const navigate = useNavigate()

  const handleOnChange = (e) => {
    const { name, value } = e.target

    setData((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/email`

    try {
      const response = await axios.post(URL, data)

      toast.success(response.data.message)

      if (response.data.success) {
        setData({
          email: "",
        })
        navigate('/password', {
          state: response?.data?.data
        })
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  return (
    <div className='mt-5 flex justify-center items-center h-screen bg-[#0e1223]'>
      <div className='bg-[#1a1f38] w-full max-w-md rounded-lg overflow-hidden p-6 text-white'>
        <div className='w-fit mx-auto mb-4'>
          <PiUserCircle
            size={80}
            className="text-slate-300"
          />
        </div>

        <h3 className='text-2xl text-center font-semibold'>Welcome to ODINIX!</h3>

        <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-2'>
            <label htmlFor='email' className='text-slate-300'>Email:</label>
            <input
              type='email'
              id='email'
              name='email'
              placeholder='Enter your email'
              className='bg-[#2c324e] px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-slate-400'
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <button
            className='bg-[#48ff48] text-lg px-4 py-2 hover:bg-[#3ae43a] rounded mt-2 font-bold text-black'
          >
            Let&apos;s Go
          </button>
        </form>

        <p className='my-3 text-center text-slate-400'>
          New User? <Link to={"/register"} className='text-[#48ff48] hover:text-[#3ae43a] font-semibold'>Register</Link>
        </p>
      </div>
    </div>
  )
}

export default CheckEmailPage
