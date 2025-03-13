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

export default function Settings() {
    const { settings, updateSettings } = useSettings();
    const [themeMode, setThemeMode] = useAtom(themeModeAtom);

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
                <Label className="text-gray-300 dark:text-gray-300">Dark Mode</Label>
                <Switch
                    checked={settings.darkMode}
                    onCheckedChange={(checked) =>
                        handleSettingChange("darkMode", checked)
                    }
                />
            </div>

            {/* Background Color */}
            <div>
                <Label className="text-gray-300 dark:text-gray-300">Background Color</Label>
                <Select
                    value={settings.backgroundColor}
                    onValueChange={(value) =>
                        handleSettingChange(
                            "backgroundColor",
                            value
                        )
                    }
                >
                    <SelectTrigger className="w-full mt-1 bg-zinc-800 border-gray-700 text-gray-200">
                        <SelectValue placeholder="Select background color" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-gray-700">
                        {backgroundOptions.map((option) => (
                            <SelectItem
                                key={option.value}
                                value={option.value}
                                className="text-gray-200"
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
                <Label className="text-gray-300 dark:text-gray-300">Text Color</Label>
                <Select
                    value={settings.textColor}
                    onValueChange={(value) =>
                        handleSettingChange("textColor", value)
                    }
                >
                    <SelectTrigger className="w-full mt-1 bg-zinc-800 border-gray-700 text-gray-200">
                        <SelectValue placeholder="Select text color" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-gray-700">
                        {textColorOptions.map((option) => (
                            <SelectItem
                                key={option.value}
                                value={option.value}
                                className="text-gray-200"
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
                <Label className="text-gray-300 dark:text-gray-300">Font Size ({settings.fontSize}px)</Label>
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
                <Label className="text-gray-300 dark:text-gray-300">Font Family</Label>
                <Select
                    value={settings.fontFamily}
                    onValueChange={(value) =>
                        handleSettingChange("fontFamily", value)
                    }
                >
                    <SelectTrigger className="w-full mt-1 bg-zinc-800 border-gray-700 text-gray-200">
                        <SelectValue placeholder="Select font family" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-gray-700">
                        {fontFamilyOptions.map((font) => (
                            <SelectItem key={font} value={font} className="text-gray-200">
                                <span style={{ fontFamily: font }}>{font}</span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Line Height */}
            <div>
                <Label className="text-gray-300 dark:text-gray-300">Line Height ({settings.lineHeight})</Label>
                <Slider
                    value={[settings.lineHeight]}
                    onValueChange={(value) =>
                        handleSettingChange("lineHeight", value[0])
                    }
                    min={1}
                    max={2}
                    step={0.05}
                    className="mt-2"
                />
            </div>

            {/* Preview */}
            <div className="mt-6 p-4 rounded-md" style={{ 
                backgroundColor: settings.backgroundColor,
                color: settings.textColor,
                fontFamily: settings.fontFamily,
                fontSize: `${settings.fontSize}px`,
                lineHeight: settings.lineHeight
            }}>
                <p>This is a preview of your text settings.</p>
                <p>Adjust the controls above to customize your reading experience.</p>
            </div>

            {/* Reset to Defaults */}
            <div className="flex justify-end">
                <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-300 border-gray-700 hover:bg-zinc-700 hover:text-white"
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
