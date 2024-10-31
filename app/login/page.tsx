"use client"
import React, {useRef} from 'react'

export default function Login() {
    const usernameInputRef = useRef<HTMLInputElement>(null)

    const handleSubmitUsername = () =>{
      
      if(usernameInputRef.current == null){
        return
      }

      const usernameValue = String(usernameInputRef.current.value);
      
      console.log(usernameValue)
      if(usernameValue != "" || usernameValue != null){
        window.location.href = `/chat?username=${encodeURIComponent(String(usernameValue))}`;      
    }
        
      

    }

  return (
    <div className='flex justify-center items-center bg-gray-200 h-[100vh] w-full '>
      <div className='flex flex-col items-center bg-white shadow-md shadow-gray-500 p-4 w-[50vw] max-w-[500px] rounded-lg'>
        <p className='text-4xl font-bold text-blue-500 mb-6'>Chat App</p>
        <input className='border-2 border-gray-300 p-2 rounded-sm w-full' type="text" placeholder='Enter your nickname' ref={usernameInputRef} ></input>
        <button className='bg-blue-500 p-2 rounded-sm w-full mt-3 text-white' onClick={handleSubmitUsername}>Join chat</button>

      </div>
    </div>
  )
}