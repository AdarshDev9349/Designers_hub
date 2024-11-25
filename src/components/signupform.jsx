import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { div } from 'framer-motion/m';

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== passwordConfirm) {
            setError("Passwords do not match");
            return;
        }

        try {
            await axios.post('https://fig-hub.onrender.com/api/signup/', { username, password, password_confirm: passwordConfirm });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || "Signup failed");
        }
    };

    return (
        <div className='flex h-screen p-10 items-center bg-blue-900'>
        <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-lg bg-gray-800 mt-10">
            <h2 className="font-bold text-xl text-gray-800 dark:text-gray-200">
                Create Your Account
            </h2>
            <p className="text-gray-600 text-sm mt-2 dark:text-gray-300">
                Sign up to get started
            </p>

            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

            <form className="my-8" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-white">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-white">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="passwordConfirm" className="block text-sm font-medium text-white">
                        Confirm Password
                    </label>
                    <input
                        id="passwordConfirm"
                        type="password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        placeholder="Confirm Password"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-purple-600 hover:to-indigo-600 text-white font-medium rounded-md h-10 flex justify-center items-center transition duration-300"
                >
                    Sign Up &rarr;
                </button>
            </form>
            <p className="text-center mt-6 text-sm text-white">
                Already have an account? <a href="/login" className="text-indigo-600 hover:text-indigo-500">
                    Login
                </a>
            </p>
        </div>
        </div>
    );
}

export default Signup;
