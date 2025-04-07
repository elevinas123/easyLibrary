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
import { ScrollArea } from "../../components/ui/scroll-area";
import React from "react";

export default function Settings() {
    const { settings, updateSettings } = useSettings();
    const [themeMode, setThemeMode] = useAtom(themeModeAtom);
    const isDarkMode = themeMode === "dark";
    const previousMode = React.useRef(isDarkMode);

    // Define color pairs for automatic switching
    const backgroundColorPairs = {
        // Light mode color => Dark mode color
        "#FFFFFF": "#000000",  // White => Black
        "#F5F5DC": "#333333",  // Beige => Dark Gray
        "#E0E0E0": "#1A1A1A",  // Light Gray => Darker Gray
        "#F4ECD8": "#704214",  // Light Sepia => Dark Sepia
        
        // Dark mode color => Light mode color
        "#000000": "#FFFFFF",  // Black => White
        "#333333": "#F5F5DC",  // Dark Gray => Beige
        "#1A1A1A": "#E0E0E0",  // Darker Gray => Light Gray
        "#704214": "#F4ECD8",  // Dark Sepia => Light Sepia
    };

    const textColorPairs = {
        // Light mode color => Dark mode color
        "#000000": "#FFFFFF",  // Black => White
        "#333333": "#CCCCCC",  // Dark Gray => Light Gray
        "#5B4636": "#D0C0A0",  // Dark Sepia => Light Sepia
        
        // Dark mode color => Light mode color
        "#FFFFFF": "#000000",  // White => Black
        "#CCCCCC": "#333333",  // Light Gray => Dark Gray
        "#D0C0A0": "#5B4636",  // Light Sepia => Dark Sepia
    };

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

    // Handle dark mode change and color swapping
    useEffect(() => {
        if (!settings) return;
        
        // Only proceed if mode actually changed
        if (previousMode.current === isDarkMode) return;
        
        // Update our ref with current mode
        previousMode.current = isDarkMode;
        
        // Batch all updates together
        const updates: Partial<SettingsType> = {};
        
        // Background color swap
        if (settings.backgroundColor && backgroundColorPairs[settings.backgroundColor]) {
            updates.backgroundColor = backgroundColorPairs[settings.backgroundColor];
        }
        
        // Text color swap
        if (settings.textColor && textColorPairs[settings.textColor]) {
            updates.textColor = textColorPairs[settings.textColor];
        }
        
        // Apply updates if we have any
        if (Object.keys(updates).length > 0) {
            updateSettings(updates);
        }
    }, [isDarkMode, settings]);

    // Background color options
    const lightModeBackgroundOptions = [
        { label: "White", value: "#FFFFFF" },
        { label: "Beige", value: "#F5F5DC" },
        { label: "Light Gray", value: "#E0E0E0" },
        { label: "Light Sepia", value: "#F4ECD8" },
    ];

    const darkModeBackgroundOptions = [
        { label: "Black", value: "#000000" },
        { label: "Dark Gray", value: "#333333" },
        { label: "Darker Gray", value: "#1A1A1A" },
        { label: "Dark Sepia", value: "#704214" },
    ];

    // Text color options
    const lightModeTextOptions = [
        { label: "Black", value: "#000000" },
        { label: "Dark Gray", value: "#333333" },
        { label: "Dark Sepia", value: "#5B4636" },
    ];

    const darkModeTextOptions = [
        { label: "White", value: "#FFFFFF" },
        { label: "Light Gray", value: "#CCCCCC" },
        { label: "Light Sepia", value: "#D0C0A0" },
    ];

    // Show appropriate options based on current mode
    const backgroundOptions = isDarkMode 
        ? darkModeBackgroundOptions 
        : lightModeBackgroundOptions;
    
    const textColorOptions = isDarkMode 
        ? darkModeTextOptions 
        : lightModeTextOptions;

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
        <ScrollArea className="h-full pb-4">
            <div className="p-3 space-y-4 w-72">
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
                <div className="space-y-2">
                    <Label className={isDarkMode ? "text-gray-300" : "text-gray-800 font-medium"}>
                        Background Color
                    </Label>
                    <Select
                        value={settings.backgroundColor}
                        onValueChange={(value) =>
                            handleSettingChange("backgroundColor", value)
                        }
                    >
                        <SelectTrigger className={cn(
                            "w-full",
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
                <div className="space-y-2">
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
                            "w-full",
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
                <div className="space-y-2">
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
                    />
                </div>

                {/* Font Family */}
                <div className="space-y-2">
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
                            "w-full",
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
                <div className="space-y-2 mt-2">
                    <Label className={isDarkMode ? "text-gray-300" : "text-gray-800 font-medium"}>
                        Preview
                    </Label>
                    <div className="p-3 rounded-md" style={{ 
                        backgroundColor: settings.backgroundColor,
                        color: settings.textColor,
                        fontFamily: settings.fontFamily,
                        fontSize: `${settings.fontSize}px`,
                        lineHeight: settings.lineHeight,
                        border: isDarkMode ? "1px solid #374151" : "1px solid #e5e7eb"
                    }}>
                        <p>This is a preview of your text settings.</p>
                        <p>Adjust the controls above to customize your reading experience.</p>
                    </div>
                </div>

                {/* Reset to Defaults */}
                <div className="flex justify-end mt-2">
                    <Button
                        variant={isDarkMode ? "outline" : "secondary"}
                        size="sm"
                        className={cn(
                            isDarkMode 
                                ? "text-gray-300 border-gray-700 hover:bg-zinc-700 hover:text-white" 
                                : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                        )}
                        onClick={() => {
                            const defaultSettings = {
                                fontSize: 16,
                                fontFamily: "Arial",
                                lineHeight: 1.5,
                                backgroundColor: isDarkMode ? "#000000" : "#FFFFFF",
                                textColor: isDarkMode ? "#FFFFFF" : "#000000",
                                darkMode: isDarkMode,
                            };
                            updateSettings(defaultSettings);
                        }}
                    >
                        Reset to Defaults
                    </Button>
                </div>
            </div>
        </ScrollArea>
    );
}
