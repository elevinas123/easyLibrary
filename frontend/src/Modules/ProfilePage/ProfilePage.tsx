import React, { useState } from "react";
import Sidebar from "../LibraryPage/Sidebar";
import { useAtom } from "jotai";
import { themeModeAtom } from "../../atoms/themeAtom";
import { cn } from "../../lib/utils";
import { useAuth } from "../../hooks/userAuth";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";
import { useToast } from "../../hooks/use-toast";
import { User, Edit, Save, Key, LogOut } from "lucide-react";

export default function ProfilePage() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [booksLoading, setBooksLoading] = useState<string[]>([]);
    const [themeMode] = useAtom(themeModeAtom);
    const isDarkMode = themeMode === "dark";
    const { user, logout } = useAuth();
    const { toast } = useToast();
    
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState(user?.username || "");
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleSaveProfile = () => {
        // Here you would implement the API call to update the user's profile
        toast({
            title: "Profile updated",
            description: "Your profile has been successfully updated.",
            duration: 3000,
        });
        setIsEditing(false);
    };

    const handleChangePassword = () => {
        if (newPassword !== confirmPassword) {
            toast({
                title: "Passwords don't match",
                description: "New password and confirmation must match.",
                variant: "destructive",
                duration: 3000,
            });
            return;
        }
        
        // Here you would implement the API call to change the password
        toast({
            title: "Password changed",
            description: "Your password has been successfully updated.",
            duration: 3000,
        });
        
        setIsChangingPassword(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    const handleLogout = () => {
        logout();
        toast({
            title: "Logged out",
            description: "You have been successfully logged out.",
            duration: 3000,
        });
    };

    return (
        <div className="flex h-screen">
            <Sidebar
                isCollapsed={isCollapsed}
                toggleCollapse={toggleCollapse}
                setBooksLoading={setBooksLoading}
            />
            <div className={cn(
                "flex-1 p-6 overflow-auto",
                isDarkMode ? "bg-gray-950 text-gray-200" : "bg-amber-50 text-gray-900"
            )}>
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className={cn(
                            "text-2xl font-bold flex items-center gap-2",
                            isDarkMode ? "text-white" : "text-gray-900"
                        )}>
                            <User className="h-6 w-6" />
                            User Profile
                        </h1>
                        <Button 
                            variant={isDarkMode ? "outline" : "secondary"}
                            size="sm"
                            onClick={handleLogout}
                            className={cn(
                                "flex items-center gap-1",
                                isDarkMode ? "text-gray-300 border-gray-700 hover:bg-gray-800" : ""
                            )}
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </Button>
                    </div>

                    <div className={cn(
                        "p-6 rounded-lg shadow-md mb-6",
                        isDarkMode ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-200"
                    )}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className={cn(
                                "text-xl font-semibold",
                                isDarkMode ? "text-gray-200" : "text-gray-800"
                            )}>
                                Account Information
                            </h2>
                            {!isEditing ? (
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => setIsEditing(true)}
                                    className={cn(
                                        "flex items-center gap-1",
                                        isDarkMode ? "text-gray-300 hover:text-white hover:bg-gray-800" : ""
                                    )}
                                >
                                    <Edit className="h-4 w-4" />
                                    Edit
                                </Button>
                            ) : (
                                <Button 
                                    variant="default" 
                                    size="sm" 
                                    onClick={handleSaveProfile}
                                    className="flex items-center gap-1"
                                >
                                    <Save className="h-4 w-4" />
                                    Save
                                </Button>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="username" className={isDarkMode ? "text-gray-300" : ""}>
                                    Username
                                </Label>
                                {isEditing ? (
                                    <Input 
                                        id="username" 
                                        value={username} 
                                        onChange={(e) => setUsername(e.target.value)}
                                        className={isDarkMode ? "bg-gray-800 border-gray-700 text-gray-200" : ""}
                                    />
                                ) : (
                                    <div className={cn(
                                        "mt-1 p-2 rounded",
                                        isDarkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-800"
                                    )}>
                                        {user?.username || "Not set"}
                                    </div>
                                )}
                            </div>

                            <div>
                                <Label className={isDarkMode ? "text-gray-300" : ""}>
                                    User ID
                                </Label>
                                <div className={cn(
                                    "mt-1 p-2 rounded font-mono text-sm",
                                    isDarkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"
                                )}>
                                    {user?.id || "Not available"}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={cn(
                        "p-6 rounded-lg shadow-md",
                        isDarkMode ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-200"
                    )}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className={cn(
                                "text-xl font-semibold flex items-center gap-2",
                                isDarkMode ? "text-gray-200" : "text-gray-800"
                            )}>
                                <Key className="h-5 w-5" />
                                Security
                            </h2>
                            {!isChangingPassword ? (
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => setIsChangingPassword(true)}
                                    className={cn(
                                        isDarkMode ? "text-gray-300 hover:text-white hover:bg-gray-800" : ""
                                    )}
                                >
                                    Change Password
                                </Button>
                            ) : (
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => setIsChangingPassword(false)}
                                    className={cn(
                                        isDarkMode ? "text-gray-300 border-gray-700 hover:bg-gray-800" : ""
                                    )}
                                >
                                    Cancel
                                </Button>
                            )}
                        </div>

                        {isChangingPassword && (
                            <div className="space-y-4 mt-4">
                                <div>
                                    <Label htmlFor="current-password" className={isDarkMode ? "text-gray-300" : ""}>
                                        Current Password
                                    </Label>
                                    <Input 
                                        id="current-password" 
                                        type="password" 
                                        value={currentPassword} 
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className={isDarkMode ? "bg-gray-800 border-gray-700 text-gray-200" : ""}
                                    />
                                </div>
                                
                                <Separator className={isDarkMode ? "bg-gray-800" : ""} />
                                
                                <div>
                                    <Label htmlFor="new-password" className={isDarkMode ? "text-gray-300" : ""}>
                                        New Password
                                    </Label>
                                    <Input 
                                        id="new-password" 
                                        type="password" 
                                        value={newPassword} 
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className={isDarkMode ? "bg-gray-800 border-gray-700 text-gray-200" : ""}
                                    />
                                </div>
                                
                                <div>
                                    <Label htmlFor="confirm-password" className={isDarkMode ? "text-gray-300" : ""}>
                                        Confirm New Password
                                    </Label>
                                    <Input 
                                        id="confirm-password" 
                                        type="password" 
                                        value={confirmPassword} 
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={isDarkMode ? "bg-gray-800 border-gray-700 text-gray-200" : ""}
                                    />
                                </div>
                                
                                <div className="flex justify-end">
                                    <Button 
                                        onClick={handleChangePassword}
                                        className={cn(
                                            "mt-2",
                                            isDarkMode ? "bg-amber-600 hover:bg-amber-700 text-white" : ""
                                        )}
                                    >
                                        Update Password
                                    </Button>
                                </div>
                            </div>
                        )}

                        {!isChangingPassword && (
                            <p className={cn(
                                "text-sm",
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                            )}>
                                Manage your account password and security settings.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 