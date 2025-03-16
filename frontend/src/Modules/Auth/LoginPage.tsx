// src/pages/Login.tsx
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { accessTokenAtom, userAtom } from "../../atoms";

const Login: React.FC = () => {
    const [, setUser] = useAtom(userAtom);
    const [_, setAccessToken] = useAtom(accessTokenAtom);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");

    // Define the mutation function
    const loginUser = async () => {
        const response = await axios.post("/api/auth/login", {
            username,
            password,
        });
        console.log("response", response);
        return response.data;
    };


    // Use the useMutation hook with the mutation function
    const mutation = useMutation({
        mutationFn: loginUser,
        onSuccess: async (data) => {
            console.log("Logged in successfully:", data);
            localStorage.setItem("token", data.access_token);
            setUser(data.user);
            setAccessToken(data.access_token);
            navigate("/");
        },
        onError: () => {
            setErrorMessage("Invalid username or password.");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-amber-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 border-t-8 border-amber-600 transform transition-all duration-300 hover:shadow-xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-serif font-bold text-amber-800">Welcome Back</h2>
                    <p className="text-gray-600 mt-2">Sign in to continue your reading journey</p>
                </div>
                
                {errorMessage && (
                    <div className="mb-6 text-red-500 text-center bg-red-50 p-3 rounded-md border border-red-200">
                        {errorMessage}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 font-medium transition-colors duration-200"
                    >
                        Log in
                    </button>
                </form>
                
                <div className="mt-8 text-center">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
                        </div>
                    </div>
                    <Link
                        to="/register"
                        className="mt-4 inline-block text-amber-600 hover:text-amber-800 font-medium transition-colors duration-200"
                    >
                        Create an account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
