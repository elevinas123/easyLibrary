import { useAtom } from "jotai";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { apiFetch } from "../endPointTypes/apiClient";
import { settingsAtom } from "../Modules/BookPage/Konva/konvaAtoms";
import {
    CreateSettingsDto,
    UpdateSettingsDto,
} from "../Modules/Settings/settings.dto";

import { useAuth } from "./userAuth";

const fetchSettings = async (
    accessToken: string | null,
    userId: string | null
) => {
    if (!accessToken) {
        throw new Error("Access token is null");
    }
    if (!userId) {
        throw new Error("User ID is null");
    }

    // Fetch settings
    const settingsData = await apiFetch(
        `GET /settings/user/:userId`,
        {
            params: { userId },
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    return settingsData.data;
};

const createSettings = async (
    accessToken: string | null,
    userId: string | null
) => {
    if (!accessToken) {
        throw new Error("Access token is null");
    }
    if (!userId) {
        throw new Error("User ID is null");
    }

    // Create default settings
    const defaultSettings: CreateSettingsDto = {
        userId,
        fontSize: 16,
        fontFamily: "Arial",
        lineHeight: 3,
        backgroundColor: "#111111",
        textColor: "#ffffff",
        darkMode: false,
    };

    const settingsData = await apiFetch(
        "POST /settings",
        { body: defaultSettings },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    return settingsData.data;
};

const updateSettingsFunc = async (
    accessToken: string | null,
    userId: string | null,
    updatedSettings: UpdateSettingsDto
) => {
    if (!accessToken) {
        throw new Error("Access token is null");
    }
    if (!userId) {
        throw new Error("User ID is null");
    }

    // Update user settings
    const updatedData = await apiFetch(
        "PATCH /settings/user/:userId",
        {
            params: { userId },
            body: updatedSettings,
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    return updatedData.data;
};

export const useSettings = () => {
    const [settings, setSettings] = useAtom(settingsAtom);
    const { accessToken, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const ensureSettings = async () => {
            if (!user || !accessToken) {
                return;
            }
            try {
                // Fetch existing settings
                const fetchedSettings = await fetchSettings(
                    accessToken,
                    user._id
                );
                setSettings(fetchedSettings);
            } catch (error) {
                console.warn("Settings not found, creating new settings.");
                try {
                    // Create default settings if none exist
                    const newSettings = await createSettings(
                        accessToken,
                        user._id
                    );
                    setSettings(newSettings);
                } catch (creationError) {
                    console.error(
                        "Error creating new settings:",
                        creationError
                    );
                }
            }
        };

        ensureSettings();
    }, [accessToken, user, setSettings, navigate]);

    const updateSettings = async (updatedSettings: UpdateSettingsDto) => {
        if (!user || !accessToken) {
            throw new Error("User or access token is missing");
        }

        try {
            const updated = await updateSettingsFunc(
                accessToken,
                user._id,
                updatedSettings
            );
            setSettings(updated); // Update the atom with the new settings
        } catch (error) {
            console.error("Error updating settings:", error);
        }
    };

    return { settings, updateSettings };
};
