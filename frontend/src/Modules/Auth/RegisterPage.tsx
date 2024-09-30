// src/pages/Register.tsx
import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { accessTokenAtom, userAtom } from "../../atoms";
import { apiFetch } from "../../endPointTypes/apiClient";

const Register: React.FC = () => {
    const [user, setUser] = useAtom(userAtom);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");

    // Define the mutation function
    const registerUser = async () => {
        if (password !== confirmPassword) {
            throw new Error("Passwords do not match.");
        }
        const response = await apiFetch("POST /auth/register", {
            body: {
                username,
                password,
                age: 10,
                comment: "hi",
                books: [],
                bookshelves: [],
            },
        });
        return response.data;
    };

    // Use the useMutation hook with the mutation function
    const mutation = useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            console.log("Registered successfully:", data);
            setUser(data);
            navigate("/");
        },
        onError: (error: any) => {
            setErrorMessage(error.response?.data?.message || error.message);
        },
    });
    useEffect(() => {
        console.log("user", user);
        console.log("accessToken", accessTokenAtom);
    }, [user, accessTokenAtom]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-800">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-center mb-6">
                    Register
                </h2>
                {errorMessage && (
                    <div className="mb-4 text-red-500 text-center">
                        {errorMessage}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 font-medium"
                    >
                        Register
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <a
                        href="/login"
                        className="text-indigo-600 hover:text-indigo-500"
                    >
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Register;
