// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAtom } from "jotai";
import { accessTokenAtom, userAtom } from "../../atoms";
import { useToast } from "../../hooks/use-toast";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { useAtom as useJotaiAtom } from "jotai";
import { themeModeAtom } from "../../atoms/themeAtom";
import { cn } from "../../lib/utils";
import { BookOpen } from "lucide-react";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [_, setAccessToken] = useAtom(accessTokenAtom);
    const [__, setUser] = useAtom(userAtom);
    const navigate = useNavigate();
    const { toast } = useToast();
    const [themeMode] = useJotaiAtom(themeModeAtom);
    const isDarkMode = themeMode === "dark";

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post("/api/auth/login", {
                username,
                password,
            });

            const { access_token, user: userData } = response.data;
            
            // Save token to localStorage and state
            localStorage.setItem("token", access_token);
            setAccessToken(access_token);
            
            // Save user data to state
            setUser(userData);
            
            toast({
                title: "Login successful",
                description: `Welcome back, ${username}!`,
                duration: 3000,
            });
            
            navigate("/");
        } catch (error) {
            console.error("Login error:", error);
            toast({
                title: "Login failed",
                description: "Invalid username or password",
                variant: "destructive",
                duration: 5000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cn(
            "min-h-screen flex items-center justify-center p-4",
            isDarkMode ? "bg-gray-950" : "bg-amber-50"
        )}>
            <Card className={cn(
                "w-full max-w-md",
                isDarkMode ? "bg-gray-900 border-gray-800 text-gray-100" : "bg-white"
            )}>
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-2">
                        <BookOpen className={cn(
                            "h-12 w-12",
                            isDarkMode ? "text-amber-500" : "text-amber-600"
                        )} />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">
                        Login to Your Account
                    </CardTitle>
                    <CardDescription className={cn(
                        "text-center",
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}>
                        Enter your credentials to access your library
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username" className={isDarkMode ? "text-gray-300" : ""}>
                                Username
                            </Label>
                            <Input
                                id="username"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className={isDarkMode ? "bg-gray-800 border-gray-700 text-white" : ""}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className={isDarkMode ? "text-gray-300" : ""}>
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className={isDarkMode ? "bg-gray-800 border-gray-700 text-white" : ""}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                        <div className="text-center text-sm">
                            <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                                Don't have an account?{" "}
                            </span>
                            <Button 
                                variant="link" 
                                className={cn(
                                    "p-0",
                                    isDarkMode ? "text-amber-500" : "text-amber-600"
                                )}
                                onClick={() => navigate("/register")}
                            >
                                Register
                            </Button>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
