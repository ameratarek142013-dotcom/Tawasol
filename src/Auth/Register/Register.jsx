import { Alert, Button, Input, Label, ListBox, Select } from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa'
import z from 'zod'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion';
import { 
  FiUser, FiMail, FiLock, FiEye, FiEyeOff, 
  FiCalendar
} from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaApple } from 'react-icons/fa';

export default function Register() {

  const [showPassword, setShowPassword] = useState(false)
  const [showRePassword, setShowRePassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const schema = z.object({
    name: z.string().min(3, 'Name must be at least 3 charcters').max(15, 'Name must be at most 15 charcters'),
    username: z.string().min(3, 'username must be at least 3 charcters').max(30, 'username must be at most 30 charcters').regex(/^[a-z0-9_]+$/, 'username can only contain letters ,numbers and underscores'),
    email: z.string().email("invalid mail"),
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'invalid date').refine((date) => {
      const userDateInpute = new Date(date)
      const todayDate = new Date()
      todayDate.setHours(0, 0, 0, 0)
      return userDateInpute < todayDate
    }, "can't enter future date"),
    gender: z.enum(['male', 'female'], 'you must choose male or female'),
    password: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, 'password must contain one capital litter at least ,digits and symbols'),
    rePassword: z.string()

  }).refine((object) => object.password === object.rePassword, {
    error: 'rePassword must match the password',
    path: ['rePassword']
  })


  const form = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "",
      password: "",
      rePassword: "",
    },
    resolver: zodResolver(schema),
    mode: 'all'
  })

  let { register, handleSubmit, formState, watch } = form

  async function handleRegister(values) {
    console.log(values);

    try {

      setIsLoading(true)

      let { data } = await axios.post('https://route-posts.routemisr.com/users/signup', values)
      console.log(data)

      localStorage.setItem('userToken', data.token)
      localStorage.setItem('userId', data.user._id)
      if (setUserToken) setUserToken(data.token)
      
      await Swal.fire({
        toast: true,
        position: 'top-end',
        icon: "success",
        title: "Account created!",
        text: data.message,
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true,
      })
      navigate('/login')
    } catch (error) {
      
      Swal.fire({
        icon: "error",
        title: "Oops...😒",
        text: error.response?.data?.message || error.message   
      });
    }finally{
      setIsLoading(false)
    }


  }





  const passwordValue = watch('password')
  const repasswordValue = watch('rePassword')

  return (
    <>
      <section className="relative min-h-screen w-full flex items-center justify-center bg-white/60 dark:bg-[#05050D] overflow-hidden py-10 transition-colors">
      
      {/* 🌌 Animated Background Elements */}
      <motion.div 
        animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-150 h-150 bg-linear-to-tr from-purple-600/30 to-blue-600/30 rounded-full blur-[140px] pointer-events-none"
      />
      
      {/* Floating Glowing Orbs */}
      <motion.div 
        animate={{ y: [-15, 15, -15], x: [-5, 5, -5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-[15%] w-16 h-16 rounded-full bg-purple-500/30 backdrop-blur-md border border-purple-300/20 shadow-[0_0_20px_rgba(168,85,247,0.4)] pointer-events-none hidden md:block"
      />
      <motion.div 
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/2 left-[12%] w-12 h-12 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-300/20 shadow-[0_0_15px_rgba(59,130,246,0.3)] pointer-events-none hidden md:block"
      />

      {/* 🎴 Main Glassmorphism Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full mt-12 max-w-120 mx-4 p-8 rounded-[32px] bg-white/60 dark:bg-[#0c0d1e]/60 backdrop-blur-xl border border-white/10 dark:border-purple-500/30 shadow-[0_0_50px_rgba(112,0,255,0.08)] dark:shadow-[0_0_50px_rgba(112,0,255,0.15)] text-gray-900 dark:text-white transition-colors"
      >
        {/* Glow border overlay */}
        <div className="absolute inset-0 rounded-[32px] border border-gradient-to-b from-purple-500/20 via-transparent to-purple-500/10 pointer-events-none" />

        {/* Logo & Header */}
        <div className="flex flex-col items-center text-center mb-6">
          
          
          
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">Create your account</h3>
            <span className="text-xs">✨</span>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Join Tawasol and connect with the world</p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit(handleRegister)} className="space-y-3">
          
          {/* Full Name */}
          <div>
            <div className="relative flex items-center">
              <FiUser className="absolute left-3.5 text-gray-400 text-sm pointer-events-none" />
              <input 
                {...register('name')} 
                type="text" 
                placeholder="Full Name" 
                className="w-full bg-gray-50/70 dark:bg-[#12132b]/50 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/50 transition-all"
              />
            </div>
            <ErrorMessage error={formState.errors.name} />
          </div>

          {/* Username */}
          <div>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-gray-400 text-xs pointer-events-none">@</span>
              <input 
                {...register('username')} 
                type="text" 
                placeholder="Username" 
                className="w-full bg-gray-50/70 dark:bg-[#12132b]/50 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/50 transition-all"
              />
            </div>
            <ErrorMessage error={formState.errors.username} />
          </div>

          {/* Email */}
          <div>
            <div className="relative flex items-center">
              <FiMail className="absolute left-3.5 text-gray-400 text-sm pointer-events-none" />
              <input 
                {...register('email')} 
                type="email" 
                placeholder="Email" 
                className="w-full bg-gray-50/70 dark:bg-[#12132b]/50 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/50 transition-all"
              />
            </div>
            <ErrorMessage error={formState.errors.email} />
          </div>

          {/* Date of Birth & Gender (Row) */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="relative flex items-center">
                <FiCalendar className="absolute left-3 text-gray-400 text-xs pointer-events-none" />
                <input 
                  {...register('dateOfBirth')} 
                  type="date" 
                  aria-label="dateOfBirth"
                  className="w-full bg-gray-50/70 dark:bg-[#12132b]/50 text-xs text-gray-900 dark:text-gray-300 pl-8 pr-2 py-3 rounded-xl border border-gray-200 dark:border-white/10 outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/50 transition-all scheme-dark"
                />
              </div>
              <ErrorMessage error={formState.errors.dateOfBirth} />
            </div>

            <div>
              <select 
                {...register('gender')} 
                defaultValue="" 
                className="w-full bg-gray-50/70 dark:bg-[#12132b]/50 text-xs text-gray-900 dark:text-gray-300 px-3 py-3 rounded-xl border border-gray-200 dark:border-white/10 outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/50 transition-all cursor-pointer"
              >
                <option value="" disabled className="bg-white dark:bg-[#0c0d1e] text-gray-400">Gender</option>
                <option value="male" className="bg-white dark:bg-[#0c0d1e] text-gray-900 dark:text-white">Male</option>
                <option value="female" className="bg-white dark:bg-[#0c0d1e] text-gray-900 dark:text-white">Female</option>
              </select>
              <ErrorMessage error={formState.errors.gender} />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="relative flex items-center">
              <FiLock className="absolute left-3.5 text-gray-400 text-sm pointer-events-none" />
              <input 
                {...register('password')} 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Password" 
                className="w-full bg-gray-50/70 dark:bg-[#12132b]/50 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 pl-10 pr-10 py-3 rounded-xl border border-gray-200 dark:border-white/10 outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/50 transition-all"
              />
              {passwordValue && (
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3.5 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  {showPassword ? <FiEyeOff className="text-sm" /> : <FiEye className="text-sm" />}
                </button>
              )}
            </div>
            <ErrorMessage error={formState.errors.password} />
          </div>

          {/* Confirm Password */}
          <div>
            <div className="relative flex items-center">
              <FiLock className="absolute left-3.5 text-gray-400 text-sm pointer-events-none" />
              <input 
                {...register('rePassword')} 
                type={showRePassword ? 'text' : 'password'} 
                placeholder="Confirm Password" 
                className="w-full bg-gray-50/70 dark:bg-[#12132b]/50 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 pl-10 pr-10 py-3 rounded-xl border border-gray-200 dark:border-white/10 outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/50 transition-all"
              />
              {repasswordValue && (
                <button 
                  type="button"
                  onClick={() => setShowRePassword(!showRePassword)} 
                  className="absolute right-3.5 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  {showRePassword ? <FiEyeOff className="text-sm" /> : <FiEye className="text-sm" />}
                </button>
              )}
            </div>
            <ErrorMessage error={formState.errors.rePassword} />
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center gap-2 pt-1 pb-1">
            <input 
              type="checkbox" 
              id="terms" 
              className="w-3.5 h-3.5 rounded border-gray-300 dark:border-white/20 bg-white/5 accent-purple-600 cursor-pointer" 
            />
            <label htmlFor="terms" className="text-[11px] text-gray-600 dark:text-gray-400 cursor-pointer select-none">
              I agree to the <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">Terms & Conditions</a> and <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">Privacy Policy</a>
            </label>
          </div>

          {/* Submit Button */}
          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading} 
            type="submit" 
            className="w-full py-3 bg-linear-to-r from-blue-600 via-purple-600 to-pink-500 hover:opacity-90 text-white text-xs font-semibold rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.12)] dark:shadow-[0_0_20px_rgba(168,85,247,0.28)] transition-all flex items-center justify-center"
          >
            {isLoading ? <FaSpinner className="animate-spin text-base" /> : "Sign Up"}
          </motion.button>
        </form>

        {/* Separator */}
        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200/30 dark:border-white/10"></div></div>
          <span className="relative px-3 text-[10px] text-gray-500 dark:text-gray-400 bg-white dark:bg-[#0c0d1e] rounded-full">or continue with</span>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button type="button" className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gray-50/60 dark:bg-[#12132b]/60 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-xs text-gray-700 dark:text-gray-300">
            <FcGoogle className="text-sm" /> <span className="text-[11px]">Google</span>
          </button>
          <button type="button" className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gray-50/60 dark:bg-[#12132b]/60 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-xs text-gray-700 dark:text-gray-300">
            <FaFacebook className="text-sm text-blue-500" /> <span className="text-[11px]">Facebook</span>
          </button>
          <button type="button" className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gray-50/60 dark:bg-[#12132b]/60 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-xs text-gray-700 dark:text-gray-300">
            <FaApple className="text-sm text-black dark:text-white" /> <span className="text-[11px]">Apple</span>
          </button>
        </div>

        {/* Bottom Navigation Link */}
        <div className="text-center mt-5">
          <p className="text-[11px] text-gray-600 dark:text-gray-400">
            Already have an account? {' '}
            <Link to="/login" className="text-purple-600 dark:text-purple-400 font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>

      </motion.div>
    </section>


    </>
  )
}
