import { useSettings } from "../../hooks/useSettings";
import { SettingsType } from "../../endPointTypes/types";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import { Slider } from "../../components/ui/slider";
import { Switch } from "../../components/ui/switch";
import { useAtom } from "jotai";
import { themeModeAtom } from "../../atoms/themeAtom";
import { useEffect } from "react";
import { cn } from "../../lib/utils";

export default function Settings() {
    const { settings, updateSettings } = useSettings();
    const [themeMode, setThemeMode] = useAtom(themeModeAtom);
    const isDarkMode = themeMode === "dark";

    // Update document theme when theme mode changes
    useEffect(() => {
        if (themeMode === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [themeMode]);

    // Sync dark mode setting with theme mode
    useEffect(() => {
        if (settings?.darkMode !== undefined) {
            setThemeMode(settings.darkMode ? "dark" : "light");
        }
    }, [settings?.darkMode, setThemeMode]);

    const backgroundOptions = [
        { label: "White", value: "#FFFFFF" },
        { label: "Beige", value: "#F5F5DC" },
        { label: "Black", value: "#000000" },
        { label: "Gray", value: "#808080" },
        { label: "Sepia", value: "#704214" },
    ];

    const textColorOptions = [
        { label: "Black", value: "#000000" },
        { label: "Dark Gray", value: "#333333" },
        { label: "White", value: "#FFFFFF" },
        { label: "Sepia", value: "#5B4636" },
    ];

    const fontFamilyOptions = [
        "Arial",
        "Georgia",
        "Times New Roman",
        "Verdana",
        "Helvetica",
        "Courier New",
        "Open Sans",
        "Roboto",
    ];

    const handleSettingChange = <K extends keyof SettingsType>(
        key: K,
        value: SettingsType[K]
    ) => {
        updateSettings({ [key]: value });
        
        // Update theme mode when dark mode setting changes
        if (key === "darkMode") {
            setThemeMode(value ? "dark" : "light");
        }
    };

    if (!settings) return null;

    return (
        <div className="space-y-6">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between">
                <Label className={isDarkMode ? "text-gray-300" : "text-gray-800 font-medium"}>
                    Dark Mode
                </Label>
                <Switch
                    checked={settings.darkMode}
                    onCheckedChange={(checked) =>
                        handleSettingChange("darkMode", checked)
                    }
                />
            </div>

            {/* Background Color */}
            <div>
                <Label className={isDarkMode ? "text-gray-300" : "text-gray-800 font-medium"}>
                    Background Color
                </Label>
                <Select
                    value={settings.backgroundColor}
                    onValueChange={(value) =>
                        handleSettingChange(
                            "backgroundColor",
                            value
                        )
                    }
                >
                    <SelectTrigger className={cn(
                        "w-full mt-1",
                        isDarkMode 
                            ? "bg-zinc-800 border-gray-700 text-gray-200" 
                            : "bg-white border-gray-300 text-gray-800"
                    )}>
                        <SelectValue placeholder="Select background color" />
                    </SelectTrigger>
                    <SelectContent className={isDarkMode ? "bg-zinc-800 border-gray-700" : "bg-white border-gray-300"}>
                        {backgroundOptions.map((option) => (
                            <SelectItem
                                key={option.value}
                                value={option.value}
                                className={isDarkMode ? "text-gray-200" : "text-gray-800"}
                            >
                                <div className="flex items-center">
                                    <div 
                                        className="w-4 h-4 rounded-full mr-2 border border-gray-600" 
                                        style={{ backgroundColor: option.value }}
                                    />
                                    {option.label}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Text Color */}
            <div>
                <Label className={isDarkMode ? "text-gray-300" : "text-gray-800 font-medium"}>
                    Text Color
                </Label>
                <Select
                    value={settings.textColor}
                    onValueChange={(value) =>
                        handleSettingChange("textColor", value)
                    }
                >
                    <SelectTrigger className={cn(
                        "w-full mt-1",
                        isDarkMode 
                            ? "bg-zinc-800 border-gray-700 text-gray-200" 
                            : "bg-white border-gray-300 text-gray-800"
                    )}>
                        <SelectValue placeholder="Select text color" />
                    </SelectTrigger>
                    <SelectContent className={isDarkMode ? "bg-zinc-800 border-gray-700" : "bg-white border-gray-300"}>
                        {textColorOptions.map((option) => (
                            <SelectItem
                                key={option.value}
                                value={option.value}
                                className={isDarkMode ? "text-gray-200" : "text-gray-800"}
                            >
                                <div className="flex items-center">
                                    <div 
                                        className="w-4 h-4 rounded-full mr-2 border border-gray-600" 
                                        style={{ backgroundColor: option.value }}
                                    />
                                    {option.label}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Font Size */}
            <div>
                <Label className={isDarkMode ? "text-gray-300" : "text-gray-800 font-medium"}>
                    Font Size ({settings.fontSize}px)
                </Label>
                <Slider
                    value={[settings.fontSize]}
                    onValueChange={(value) =>
                        handleSettingChange("fontSize", value[0])
                    }
                    min={12}
                    max={50}
                    step={1}
                    className="mt-2"
                />
            </div>

            {/* Font Family */}
            <div>
                <Label className={isDarkMode ? "text-gray-300" : "text-gray-800 font-medium"}>
                    Font Family
                </Label>
                <Select
                    value={settings.fontFamily}
                    onValueChange={(value) =>
                        handleSettingChange("fontFamily", value)
                    }
                >
                    <SelectTrigger className={cn(
                        "w-full mt-1",
                        isDarkMode 
                            ? "bg-zinc-800 border-gray-700 text-gray-200" 
                            : "bg-white border-gray-300 text-gray-800"
                    )}>
                        <SelectValue placeholder="Select font family" />
                    </SelectTrigger>
                    <SelectContent className={isDarkMode ? "bg-zinc-800 border-gray-700" : "bg-white border-gray-300"}>
                        {fontFamilyOptions.map((font) => (
                            <SelectItem 
                                key={font} 
                                value={font} 
                                className={isDarkMode ? "text-gray-200" : "text-gray-800"}
                            >
                                <span style={{ fontFamily: font }}>{font}</span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

           

            {/* Preview */}
            <div className="mt-6 p-4 rounded-md" style={{ 
                backgroundColor: settings.backgroundColor,
                color: settings.textColor,
                fontFamily: settings.fontFamily,
                fontSize: `${settings.fontSize}px`,
                lineHeight: settings.lineHeight,
                border: isDarkMode ? "none" : "1px solid #e5e7eb"
            }}>
                <p>This is a preview of your text settings.</p>
                <p>Adjust the controls above to customize your reading experience.</p>
            </div>

            {/* Reset to Defaults */}
            <div className="flex justify-end">
                <Button
                    variant={isDarkMode ? "outline" : "secondary"}
                    size="sm"
                    className={cn(
                        isDarkMode 
                            ? "text-gray-300 border-gray-700 hover:bg-zinc-700 hover:text-white" 
                            : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                    )}
                    onClick={() => {
                        updateSettings({
                            fontSize: 16,
                            fontFamily: "Arial",
                            lineHeight: 1.5,
                            backgroundColor: "#FFFFFF",
                            textColor: "#000000",
                            darkMode: false,
                        });
                    }}
                >
                    Reset to Defaults
                </Button>
            </div>
        </div>
    );
}
