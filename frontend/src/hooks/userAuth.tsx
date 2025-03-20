// src/hooks/userAuth.tsx
import axios from "axios";
import { useAtom } from "jotai";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { accessTokenAtom, userAtom } from "../atoms";
import { apiFetch } from "../endPointTypes/apiClient";

const fetchUser = async (accessToken: string | undefined) => {
    if (!accessToken) {
        throw new Error("Access token is null");
    }
    const userData = await apiFetch(
        "GET /user/findOneByJwtPayload",
        {},
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    return userData.data;
};

// Define the mutation function
const loginUser = async (username: string, password: string) => {
    const response = await axios.post("/api/auth/login", {
        username,
        password,
    });
    return response.data;
};

export const useAuth = () => {
    const [accessToken, setAccessToken] = useAtom(accessTokenAtom);
    const [user, setUser] = useAtom(userAtom);
    const navigate = useNavigate();
    const location = useLocation();
    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);

    const authenticate = useCallback(async () => {
        // Don't try to authenticate if we're already on the login page
        if (location.pathname === "/login") {
            setIsAuthenticating(false);
            return;
        }

        try {
            setIsAuthenticating(true);
            setAuthError(null);
            
            // First check if we have a token in state or localStorage
            let token = accessToken || localStorage.getItem("token");
            
            if (token) {
                // We have a token, set it in state if not already there
                if (!accessToken) {
                    setAccessToken(token);
                }
                
                // If we have a token but no user, fetch the user data
                if (!user) {
                    try {
                        const userData = await fetchUser(token);
                        setUser(userData);
                    } catch (error) {
                        console.error("Error fetching user with token:", error);
                        // Token might be invalid, clear it
                        setAccessToken(undefined);
                        localStorage.removeItem("token");
                        setAuthError("Session expired. Please login again.");
                        navigate("/login", { state: { from: location.pathname } });
                    }
                }
            } else if (user?.username && user?.password) {
                // No token but we have credentials, try to login
                try {
                    const data = await loginUser(user.username, user.password);
                    const newToken = data.access_token;
                    
                    if (newToken) {
                        setAccessToken(newToken);
                        localStorage.setItem("token", newToken);
                    } else {
                        setAuthError("Login failed. Please try again.");
                        navigate("/login", { state: { from: location.pathname } });
                    }
                } catch (error) {
                    console.error("Login failed:", error);
                    setAuthError("Login failed. Please try again.");
                    navigate("/login", { state: { from: location.pathname } });
                }
            } else {
                // No token and no credentials, redirect to login
                navigate("/login", { state: { from: location.pathname } });
            }
        } finally {
            setIsAuthenticating(false);
        }
    }, [accessToken, user, navigate, setAccessToken, setUser, location.pathname]);

    useEffect(() => {
        authenticate();
    }, [authenticate]);

    // Add logout function
    const logout = () => {
        // Clear the access token from state and localStorage
        setAccessToken(undefined);
        localStorage.removeItem("token");
        
        // Clear the user from state
        setUser(undefined);
        
        // Redirect to login page
        navigate("/login");
    };

    return { 
        accessToken, 
        user, 
        logout, 
        isAuthenticating, 
        authError,
        authenticate // Expose the authenticate function so it can be called manually
    };
};
