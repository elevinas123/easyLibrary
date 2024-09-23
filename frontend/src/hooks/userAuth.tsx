// src/hooks/useAuth.ts
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { accessTokenAtom, userAtom } from "../atoms";
import axios from "axios";

const fetchUser = async (accessToken: string | null) => {
    if (!accessToken) {
        throw new Error("Access token is null");
    }
    console.log("accessToken", accessToken, );
    const { data } = await axios.get("/api/user/findOneByJwtPayload", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return data;
};

export const useAuth = () => {
    const [accessToken, setAccessToken] = useAtom(accessTokenAtom);
    const [user, setUser] = useAtom(userAtom);
    const navigate = useNavigate();

    useEffect(() => {
        const authenticate = async () => {
            let token = accessToken;
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
