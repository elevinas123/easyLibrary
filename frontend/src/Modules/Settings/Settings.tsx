import { useAtom } from "jotai";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import { Slider } from "../../components/ui/slider";
import { Switch } from "../../components/ui/switch";
import { useSettings } from "../../hooks/useSettings";
import { SettingsType } from "../../../../backend/src/settings/settings.schema";

export default function Settings() {
    const [isOpen, setIsOpen] = useState(false);
    const { settings, updateSettings } = useSettings();

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

    const fontSizeOptions = Array.from({ length: 20 }, (_, i) => 12 + i * 2);
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
    const lineHeightOptions = [1, 1.25, 1.5, 1.75, 2];

    const handleSettingChange = <K extends keyof SettingsType>(
        key: K,
        value: SettingsType[K]
    ) => {
        updateSettings({ [key]: value });
    };

    return (
        <div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">Settings</Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Reader Settings</DialogTitle>
                        <DialogDescription>
                            Customize your reading experience
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 mt-4">
                        {/* Dark Mode Toggle */}
                        <div className="flex items-center justify-between">
                            <Label>Dark Mode</Label>
                            <Switch
                                checked={settings.darkMode}
                                onCheckedChange={(checked) =>
                                    handleSettingChange("darkMode", checked)
                                }
                            />
                        </div>

                        {/* Background Color */}
                        <div>
                            <Label>Background Color</Label>
                            <Select
                                value={settings.backgroundColor}
                                onValueChange={(value) =>
                                    handleSettingChange(
                                        "backgroundColor",
                                        value
                                    )
                                }
                            >
                                <SelectTrigger className="w-full mt-1">
                                    <SelectValue placeholder="Select background color" />
                                </SelectTrigger>
                                <SelectContent>
                                    {backgroundOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Text Color */}
                        <div>
                            <Label>Text Color</Label>
                            <Select
                                value={settings.textColor}
                                onValueChange={(value) =>
                                    handleSettingChange("textColor", value)
                                }
                            >
                                <SelectTrigger className="w-full mt-1">
                                    <SelectValue placeholder="Select text color" />
                                </SelectTrigger>
                                <SelectContent>
                                    {textColorOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Font Size */}
                        <div>
                            <Label>Font Size ({settings.fontSize}px)</Label>
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
                            <Label>Font Family</Label>
                            <Select
                                value={settings.fontFamily}
                                onValueChange={(value) =>
                                    handleSettingChange("fontFamily", value)
                                }
                            >
                                <SelectTrigger className="w-full mt-1">
                                    <SelectValue placeholder="Select font family" />
                                </SelectTrigger>
                                <SelectContent>
                                    {fontFamilyOptions.map((font) => (
                                        <SelectItem key={font} value={font}>
                                            {font}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Line Height */}
                        <div>
                            <Label>Line Height ({settings.lineHeight})</Label>
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

                        {/* Reset to Defaults */}
                        <div className="flex justify-end">
                            <Button
                                variant="ghost"
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
                </DialogContent>
            </Dialog>
        </div>
    );
}
