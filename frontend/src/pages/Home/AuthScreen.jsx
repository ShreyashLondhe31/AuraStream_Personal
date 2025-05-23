import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {ChevronRight} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const AuthScreen = () => {
    const [email, setEmail] = useState("")
    const navigate = useNavigate()

    const handleFormSubmit = (e) => {
        e.preventDefault()
        navigate("/signup?email=" + email)
    }
  return (
    <div className='hero-bg relative'>
        {/* navbar */}
        <header className="max-w-6xl mx-auto flex items-center justify-between p-4 pb-10">
            {/* <img  alt="AuraStream Logo" className=' text-white w-32 md:w-52' /> */}
            <h1 className="text-3xl font-bold text-white" >AuraStream</h1>
        <Link to={"/login"} className="text-white bg-green-600 py-1 px-2 rounded">
          sign in
        </Link>
      </header>

      {/* herosection */}
      <div className='flex flex-col items-center justify-center text-center py-40 text-white max-w-6xl mx-auto'>
        <h1 className='text-4xl md:text-6xl font-bold mb-4'>Unlimited movies, Tv shows, and more</h1>
        <p className='text-lg mb-4 '>Watch anywhere. Cancel anytime.</p>
        <p className='mb-4'>Ready to watch? Enter your email to create or restart your membership</p>

        <form action="" onSubmit={handleFormSubmit} className='flex flex-col md:flex-row gap-4 w-1/2'>
        <input
                type="email"
                className="w-full px-3 py-2 mt-1 border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                placeholder="you@example.com"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
          />
            <button className='bg-green-600 text-lg lg:text-2xl px-2 lg:px-6 py-1 md:py-2 rounded flex justify-center items-center'>Get Started
                <ChevronRight className='size-8 md:size-10' />
            </button>
        </form>
      </div>

      {/* separator */}
     <div className='h-2 w-full bg-[#232323]' aria-hidden='true'/>

     {/* 1st section  */}
     <div className='flex text-white max-w-6xl mx-auto justify-center items-center md:flex-row flex-col px-4 md:px-2'>
        {/* left size */}
        <div className='flex-1 text-center md:text-left'>
            <h2 className='text-4xl md:text-5xl font-extrabold mb-4 '> Enjoy on your TV</h2>
            <p className='text-lg md:text-xl'>
                Watch on Smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.
            </p>
        </div>
        {/* right size */}
        <div className='flex-1 relative '>
            <img src="/tv.png" alt="Tv image" className='mt-4 relative z-20' />
            <video className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-1/2 z-10' autoPlay loop muted playsInline> 
            <source src='/hero-vid.m4v' type='video/mp4' />    
             </video>
        </div>

     </div>

      {/* separator */}
      <div className='h-2 w-full bg-[#232323]' aria-hidden='true'/>

      {/* 2nd section */}
      
      

       {/* 3rd section  */}
     <div className='flex text-white max-w-6xl mx-auto justify-center items-center md:flex-row flex-col px-4 md:px-2'>
        {/* left size */}
        <div className='flex-1 text-center md:text-left'>
            <h2 className='text-4xl md:text-5xl font-extrabold mb-4 '>Watch Everywhere</h2>
            <p className='text-lg md:text-xl'>
                Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV without paying more.
            </p>
        </div>
        {/* right size */}
        <div className='flex-1 relative overflow-hidden'>
            <img src="/device-pile.png" alt="Device image" className='mt-4 relative z-20' />
            <video className='absolute top-12 left-1/2 -translate-x-1/2 max-w-[63%] w-full h-1/2 z-10' autoPlay loop muted playsInline> 
            <source src='/video-devices.m4v' type='video/mp4' />    
             </video>
        </div>

     </div>

     {/* separator */}
     <div className='h-2 w-full bg-[#232323]' aria-hidden='true'/>

    {/* 4th section */}
     <div className='py-10 text-white bg-black '>
        <div className="flex max-w-6xl mx-auto items-center justify-center flex-col-reverse md:flex-row px-4 md:px-2"> {/* left side */}
        <div className='flex-1 relative '>
            <img src="/kids.png" alt="Enjoy on your TV" className='mt-4' />
        </div>
        {/* right side */}
        <div className='flex-1 text-center md:text-left'>
            <h2 className='text-4xl md:text-5xl font-extrabold mb-4'>
                Create profiles for kids.
            </h2>
            <p className='text-lg md:text-xl'>
                send kids on adventures with their favorite characters in a space made just for them—free with your membership.
            </p>
        </div>
     </div></div>
       
    </div>
  )
}

export default AuthScreen