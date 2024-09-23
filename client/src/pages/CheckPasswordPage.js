import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'
import toast from 'react-hot-toast';
import Avatar from '../components/Avatar';
import { useDispatch } from 'react-redux';
import { setToken } from '../redux/userSlice';

const CheckPasswordPage = () => {
  const [data, setData] = useState({
    password: "",
    userId: ""
  })
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!location?.state?.name) {
      navigate('/email')
    }
  }, [])

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

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`

    try {
      const response = await axios({
        method: 'post',
        url: URL,
        data: {
          userId: location?.state?._id,
          password: data.password
        },
        withCredentials: true
      })

      toast.success(response.data.message)

      if (response.data.success) {
        dispatch(setToken(response?.data?.token))
        localStorage.setItem('token', response?.data?.token)

        setData({
          password: "",
        })
        navigate('/')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  return (
    <div className='flex justify-center items-center h-screen bg-[#0e1223]'>
      <div className='bg-[#1a1f38] w-full max-w-md rounded-lg overflow-hidden p-6 text-white'>
        <div className='w-fit mx-auto mb-4 flex justify-center items-center flex-col'>
          <Avatar
            width={70}
            height={70}
            name={location?.state?.name}
            imageUrl={location?.state?.profile_pic}
          />
          <h2 className='font-semibold text-xl mt-2'>{location?.state?.name}</h2>
        </div>

        <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-2'>
            <label htmlFor='password' className='text-slate-300'>Password:</label>
            <input
              type='password'
              id='password'
              name='password'
              placeholder='Enter your password'
              className='bg-[#2c324e] px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-slate-400'
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <button
            className='bg-[#48ff48] text-lg px-4 py-2 hover:bg-[#3ae43a] rounded mt-2 font-bold text-black'
          >
            Login
          </button>
        </form>

        <p className='my-3 text-center text-slate-400'>
          <Link to={"/forgot-password"} className='text-[#48ff48] hover:text-[#3ae43a] font-semibold'>Forgot password?</Link>
        </p>
      </div>
    </div>
  )
}

export default CheckPasswordPage
