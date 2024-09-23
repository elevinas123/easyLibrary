// src/hooks/useAuth.ts
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { accessTokenAtom, User, userAtom } from "../atoms";
import axios from "axios";

const fetchUser = async (accessToken: string | null) => {
    if (!accessToken) {
        throw new Error("Access token is null");
    }
    console.log("accessToken", accessToken);
    const { data } = await axios.get("/api/user/findOneByJwtPayload", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return data;
};
// Define the mutation function
const loginUser = async (username: string, password: string) => {
    const response = await axios.post("/api/auth/login", {
        username,
        password,
    });
    console.log("response", response);
    return response.data;
};
export const useAuth = () => {
    const [accessToken, setAccessToken] = useAtom(accessTokenAtom);
    const [user, setUser] = useAtom(userAtom);
    const navigate = useNavigate();

    useEffect(() => {
        const authenticate = async () => {
            let token = accessToken;
            console.log("token", token);
            console.log("user", user);
            if (!token && user) {
                const data = await loginUser(
                    user.username,
                    user.password
                );
                const accessToken = data.access_token;
                
                console.log("accessTokenGotten", data);
                if (!accessToken) {
                    navigate("/login");
                    return;
                }
                setAccessToken(accessToken);
                localStorage.setItem("token", accessToken);
                return;
            }
            if (!accessToken) {
                token = localStorage.getItem("token");
                if (token) {
                    setAccessToken(token);
                } else {
                    navigate("/login");
                    return;
                }
            }

            if (!user && token) {
                try {
                    const userData = await fetchUser(token);
                    console.log("userData", userData);
                    setUser(userData);
                } catch (error) {
                    console.error("Error fetching user", error);
                    navigate("/login");
                }
            }
        };

        authenticate();
    }, [accessToken, user, navigate, setAccessToken, setUser]);

    return { accessToken, user };
};
