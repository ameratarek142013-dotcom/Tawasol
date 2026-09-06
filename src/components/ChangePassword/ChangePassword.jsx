import React, { useState } from 'react'
import { Alert, Button, Input } from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { FaSpinner, FaFacebook, FaApple } from 'react-icons/fa'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { motion } from 'framer-motion';
import z from 'zod'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import { useMutation } from '@tanstack/react-query'
import { changePassword } from '../../api/ChangePassword.api'
import { Bounce, toast } from 'react-toastify'

export default function ChangePassword() {

  const { data, isPending, mutate, isError, error } = useMutation({
    mutationFn: (values) => changePassword(values),
    onSuccess: (response) => {
      const data = response?.data
      console.log(data);
      toast.success(`${data?.message}👍`, {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
        transition: Bounce,
      });
      reset()

    },
    onError: (error) => {
      toast.error(error?.response?.data?.message, {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
        transition: Bounce,
      });
    }
  })


  const [showPassword, setShowPassword] = useState(false)
  const [shownewPassword, setShownewPassword] = useState(false)

  const schema = z.object({
    password: z.string().min(1, 'Please enter your current password'),
    newPassword: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, 'New password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character'),
  }).refine((object) => object.newPassword !== object.password, {
    message: 'New password must be different from the current password',
    path: ['newPassword'],
  })

  const form = useForm({
    defaultValues: {
      password: "",
      newPassword: "",
    },
    resolver: zodResolver(schema),
    mode: 'all'
  })

  let { register, handleSubmit, formState, watch, reset } = form

  async function handleChangePassword(values) {
    console.log(values);
    mutate(values)

  }

  const passwordValue = watch('password')
  const newPasswordValue = watch('newPassword')
  return (
    <>
      <section className="relative min-h-screen w-full flex items-center justify-center bg-white/60 dark:bg-[#05050D] overflow-hidden py-10 transition-colors">
        <motion.div
          animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-150 h-150 bg-linear-to-tr from-purple-600/30 to-blue-600/30 rounded-full blur-[140px] pointer-events-none"
        />

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full mt-12 max-w-120 mx-4 p-8 rounded-[32px] bg-white/60 dark:bg-[#0c0d1e]/60 backdrop-blur-xl border border-white/10 dark:border-purple-500/30 shadow-[0_0_50px_rgba(112,0,255,0.08)] dark:shadow-[0_0_50px_rgba(112,0,255,0.15)] text-gray-900 dark:text-white transition-colors"
        >
          <div className="absolute inset-0 rounded-[32px] border border-gradient-to-b from-purple-500/20 via-transparent to-purple-500/10 pointer-events-none" />

          <div className="flex flex-col items-center text-center mb-6">
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 capitalize">change your password</h3>
              <span className="text-xs">🔐</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(handleChangePassword)} className="space-y-3">


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

            <div>
              <div className="relative flex items-center">
                <FiLock className="absolute left-3.5 text-gray-400 text-sm pointer-events-none" />
                <input
                  {...register('newPassword')}
                  type={shownewPassword ? 'text' : 'password'}
                  placeholder="New Password"
                  className="w-full bg-gray-50/70 dark:bg-[#12132b]/50 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 pl-10 pr-10 py-3 rounded-xl border border-gray-200 dark:border-white/10 outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/50 transition-all"
                />
                {newPasswordValue && (
                  <button
                    type="button"
                    onClick={() => setShownewPassword(!shownewPassword)}
                    className="absolute right-3.5 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition-colors"
                  >
                    {shownewPassword ? <FiEyeOff className="text-sm" /> : <FiEye className="text-sm" />}
                  </button>
                )}
              </div>
              <ErrorMessage error={formState.errors.newPassword} />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={isPending}
              type="submit"
              className="w-full py-3 bg-linear-to-r from-blue-600 via-purple-600 to-pink-500 hover:opacity-90 text-white text-xs font-semibold rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.12)] dark:shadow-[0_0_20px_rgba(168,85,247,0.28)] transition-all flex items-center justify-center"
            >

              {isPending ? <FaSpinner className="animate-spin text-base" /> : "Change Password"}
            </motion.button>
          </form>


        </motion.div>
      </section>
    </>
  )
}
