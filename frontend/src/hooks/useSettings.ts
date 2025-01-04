// src/hooks/useSettings.ts

import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
    CreateSettingsDto,
    UpdateSettingsDto,
} from "../../../backend/src/settings/settings.dto";
import { apiFetch } from "../endPointTypes/apiClient";
import { settingsAtom } from "../Modules/BookPage/Konva/konvaAtoms";

import { useAuth } from "./userAuth";

export const useSettings = () => {
    const [settings, setSettings] = useAtom(settingsAtom);
    const { accessToken, user } = useAuth();
    const navigate = useNavigate();

    const fetchSettings = useCallback(
        async (accessToken: string, userId: string) => {
            if (!accessToken || !userId) {
                return;
            }
            // Fetch settings
            const settingsData = await apiFetch(
                "GET /settings/user/:userId",
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
        },
        []
    );

    const createSettings = useCallback(
        async (accessToken: string, userId: string) => {
            // Create default settings
            const defaultSettings: CreateSettingsDto = {
                userId,
                fontSize: 16,
                fontFamily: "Arial",
                lineHeight: 1.5,
                backgroundColor: "#FFFFFF",
                textColor: "#000000",
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
        },
        []
    );

    const updateSettingsFunc = useCallback(
        async (
            accessToken: string,
            userId: string,
            updatedSettings: UpdateSettingsDto
        ) => {
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
        },
        []
    );

    // Ensure settings are fetched or created when the hook is used
    const ensureSettings = useCallback(async () => {
        if (!user || !accessToken) {
            navigate("/login");
            return;
        }
        try {
            const fetchedSettings = await fetchSettings(accessToken, user._id);
            if (JSON.stringify(fetchedSettings) !== JSON.stringify(settings)) {
                setSettings(fetchedSettings);
            }
        } catch (error) {
            console.warn("Settings not found, creating new settings.");
            try {
                const newSettings = await createSettings(accessToken, user._id);
                setSettings(newSettings);
            } catch (creationError) {
                console.error("Error creating new settings:", creationError);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken, user, setSettings]);

    useEffect(() => {
        ensureSettings();
    }, [ensureSettings]);

    // Optimistic update of settings
    const updateSettings = useCallback(
        async (updatedSettings: UpdateSettingsDto) => {
            if (!user || !accessToken) {
                throw new Error("User or access token is missing");
            }

            // Keep a reference to the previous settings for potential rollback
            const previousSettings = { ...settings };

            // Optimistically update the local settings
            setSettings((oldSettings) => ({
                ...oldSettings,
                ...updatedSettings,
            }));

            try {
                // Make the API call in the background
                await updateSettingsFunc(
                    accessToken,
                    user._id,
                    updatedSettings
                );
                // Optionally, refresh settings from the server to ensure consistency
                // const updatedFromServer = await fetchSettings(accessToken,
                // user._id); setSettings(updatedFromServer);
            } catch (error) {
                console.error("Error updating settings:", error);

                // Roll back to previous settings if the API call fails
                setSettings(previousSettings);

                // Optionally, notify the user about the error
                // e.g., show a toast notification
            }
        },
        [accessToken, user, settings, setSettings, updateSettingsFunc]
    );

    return { settings, updateSettings };
};
