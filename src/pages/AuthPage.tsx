import LoginForm from '@/_components/Auth/LoginForm'
import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

const AuthPage = () => {
    return (
        <section className='flex items-center justify-center h-screen gap-x-3'>
            <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center md:gap-8">
                    <div>
                        <div className="max-w-lg md:max-w-none">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-xl"
                            >
                                <Shield className="w-10 h-10 text-white" />
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-2xl md:text-4xl font-bold text-black mb-2"
                            >
                                Font Management Admin Portal
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-gray-900 text-sm md:text-xl md:font-bold"
                            >
                                Secure access to your font management dashboard
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2 }}
                                className=" mt-8 text-gray-700 text-sm"
                            >
                                <p>© 2025 Admin Portal. All rights reserved.</p>
                                <p className="mt-1">Need help? Contact system administrator</p>
                            </motion.div>
                        </div>
                    </div>

                    <div>
                        <LoginForm />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AuthPage