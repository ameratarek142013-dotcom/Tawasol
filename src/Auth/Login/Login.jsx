import { zodResolver } from '@hookform/resolvers/zod'
import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaSpinner, FaFacebook, FaApple } from 'react-icons/fa'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { motion } from 'framer-motion'
import z from 'zod'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../Context/UserContext'


export default function Login() {

  let { setUserToken, setUserId } = useContext(UserContext)

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const schema = z.object({
    email: z.string().email("invalid mail"),
    password: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, 'Enter your correct password'),

  })


  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
    mode: 'all'
  })

  let { register, handleSubmit, formState, watch } = form

  async function handleLogin(values) {
    console.log(values);

    try {

      setIsLoading(true)

      let { data } = await axios.post('https://route-posts.routemisr.com/users/signin', values)

      console.log(data);
      localStorage.setItem('userToken', data.data.token)
      setUserToken(data.data.token)
      localStorage.setItem('userId', data.data.user._id)
      setUserId(data.data.user._id)
      Swal.fire({
        position: "center",
        icon: "success",
        title: `${data.message}👍`,
        showConfirmButton: false,
        timer: 2000
      });
      navigate('/home')
    } catch (error) {

      Swal.fire({
        icon: "error",
        title: "Oops...😒",
        text: error.response.data.message
      });
    } finally {
      setIsLoading(false)
    }


  }



  const passwordValue = watch('password')

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white/60 py-10 transition-colors dark:bg-[#05050D]">
      <motion.div
        animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -top-32 left-1/2 h-150 w-150 -translate-x-1/2 rounded-full bg-linear-to-tr from-purple-600/30 to-blue-600/30 blur-[140px]"
      />
      <motion.div
        animate={{ y: [-15, 15, -15], x: [-5, 5, -5] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute top-1/4 right-[15%] hidden h-16 w-16 rounded-full border border-purple-300/20 bg-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.4)] backdrop-blur-md md:block"
      />
      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute bottom-1/2 left-[12%] hidden h-12 w-12 rounded-full border border-blue-300/20 bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)] backdrop-blur-md md:block"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mx-4 mt-12 w-full max-w-120 rounded-[32px] border border-white/10 bg-white/60 p-8 text-gray-900 shadow-[0_0_50px_rgba(112,0,255,0.08)] backdrop-blur-xl transition-colors dark:border-purple-500/30 dark:bg-[#0c0d1e]/60 dark:text-white dark:shadow-[0_0_50px_rgba(112,0,255,0.15)]"
      >
        <div className="pointer-events-none absolute inset-0 rounded-[32px] border border-gradient-to-b from-purple-500/20 via-transparent to-purple-500/10" />
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mt-1 flex items-center justify-center gap-1.5">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">Login to your account</h3>
            <span className="text-xs">🔐</span>
          </div>
          <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">Welcome back — sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-3">
          <div>
            <div className="relative flex items-center">
              <FiMail className="pointer-events-none absolute left-3.5 text-sm text-gray-400" />
              <input {...register('email')} type="email" placeholder="Email" className="w-full rounded-xl border border-gray-200 bg-gray-50/70 py-3 pr-4 pl-10 text-xs text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/50 dark:border-white/10 dark:bg-[#12132b]/50 dark:text-white" />
            </div>
            <ErrorMessage error={formState.errors.email} />
          </div>

          <div>
            <div className="relative flex items-center">
              <FiLock className="pointer-events-none absolute left-3.5 text-sm text-gray-400" />
              <input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="Password" className="w-full rounded-xl border border-gray-200 bg-gray-50/70 py-3 pr-10 pl-10 text-xs text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/50 dark:border-white/10 dark:bg-[#12132b]/50 dark:text-white" />
              {passwordValue && (
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-300 dark:hover:text-white">
                  {showPassword ? <FiEyeOff className="text-sm" /> : <FiEye className="text-sm" />}
                </button>
              )}
            </div>
            <ErrorMessage error={formState.errors.password} />
          </div>

          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} disabled={isLoading} type="submit" className="flex w-full items-center justify-center rounded-xl bg-linear-to-r from-blue-600 via-purple-600 to-pink-500 py-3 text-xs font-semibold text-white shadow-[0_0_20px_rgba(168,85,247,0.12)] transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-[0_0_20px_rgba(168,85,247,0.28)]">
            {isLoading ? <FaSpinner className="animate-spin text-base" /> : 'Login'}
          </motion.button>
        </form>

        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200/30 dark:border-white/10" /></div>
          <span className="relative rounded-full bg-white px-3 text-[10px] text-gray-500 dark:bg-[#0c0d1e] dark:text-gray-400">or continue with</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button type="button" className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50/60 py-2 text-xs text-gray-700 transition-all hover:bg-gray-100 dark:border-white/10 dark:bg-[#12132b]/60 dark:text-gray-300 dark:hover:bg-white/5"><FcGoogle className="text-sm" /><span className="text-[11px]">Google</span></button>
          <button type="button" className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50/60 py-2 text-xs text-gray-700 transition-all hover:bg-gray-100 dark:border-white/10 dark:bg-[#12132b]/60 dark:text-gray-300 dark:hover:bg-white/5"><FaFacebook className="text-sm text-blue-500" /><span className="text-[11px]">Facebook</span></button>
          <button type="button" className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50/60 py-2 text-xs text-gray-700 transition-all hover:bg-gray-100 dark:border-white/10 dark:bg-[#12132b]/60 dark:text-gray-300 dark:hover:bg-white/5"><FaApple className="text-sm text-black dark:text-white" /><span className="text-[11px]">Apple</span></button>
        </div>

        <div className="mt-5 text-center"><p className="text-[11px] text-gray-600 dark:text-gray-400">you don't have an account? <Link to="/" className="font-medium text-purple-600 hover:underline dark:text-purple-400">register now</Link></p></div>
      </motion.div>
    </section>
  )
}
