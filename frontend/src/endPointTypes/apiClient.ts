import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import InputMap from "./inputMap";
import { ApiResponseTypes, Endpoint } from "./endpointMap";


// Axios instance
const axiosInstance: AxiosInstance = axios.create({
    baseURL: "/api", // Adjust base URL as needed
});

// Generic fetch function accepting the endpoint key and inputs
export async function apiFetch<K extends Endpoint>(
    key: K,
    inputs: InputMap[K],
    config?: AxiosRequestConfig
) {
    try {
        const [method, ...pathParts] = key.split(" ");
        let path = pathParts.join(" "); // Join in case path contains spaces

        // Replace path parameters if any
        if ("params" in inputs && inputs.params) {
            for (const [paramKey, paramValue] of Object.entries(
                inputs.params
            )) {
                path = path.replace(
                    `:${paramKey}`,
                    encodeURIComponent(String(paramValue))
                );
            }
        }

        // Prepare Axios request config
        const axiosConfig: AxiosRequestConfig = {
            method: method.toLowerCase() as AxiosRequestConfig["method"],
            url: path,
            ...config,
        };

        if ("query" in inputs && inputs.query) {
            axiosConfig.params = inputs.query;
        }

        if ("body" in inputs && inputs.body) {
            axiosConfig.data = inputs.body;
        }

        // Perform the Axios request with the inferred type
        const response = await axiosInstance.request<ApiResponseTypes[K]>(
            axiosConfig
        );

        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Handle Axios-specific errors
            console.error(
                `API call to ${key} failed:`,
                error.response?.data || error.message
            );
            throw new Error(error.response?.data?.message || "API call failed");
        } else {
            // Handle non-Axios errors
            console.error(`Unexpected error during API call to ${key}:`, error);
            throw new Error("An unexpected error occurred");
        }
    }
}

