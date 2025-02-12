"use client"
import React, { useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
function page() {
  const router = useRouter()
  const [data,setdata] = useState('')
  const getUserDetails =async()=>{
   try {
    const response =  await axios.post("/api/users/me")
    console.log(response.data.data._id);
    setdata(response.data.data._id)
   } catch (error) {
    
   }

   
  }
  const logout = async ()=>{
    try {
      await axios.post('/api/users/logout')
      toast.success("Logout Succes")
      router.push('/login')
    } catch (error:any) {
      console.log(error.message);
      toast.error(error.message)
    }
  }
  return (
    <div
    className='flex flex-col items-center justify-center min-h-screen py-2'
    >
      <h1>Profile Page</h1>
      <hr />
      <h2>{data ===""? "Nothing to show":<Link href={`/profile/${data}`}>{data}</Link>}</h2>
      <hr />
      <button
      className='bg-blue-500  mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
      onClick={logout}
      >logout</button>
       <button
      className='bg-red-500  mt-4 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
      onClick={getUserDetails}
      >Get user Details</button>
    </div>
  )
}

export default page