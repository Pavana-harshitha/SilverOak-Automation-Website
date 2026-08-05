const BASE_URL = import.meta.env.VITE_API_URL;

export const API = {
    record: `${BASE_URL}/record`,
};

export async function createRecord(recordData) {
    const response = await fetch(API.record, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(recordData),
    });

    if (!response.ok) {
        let errorMessage = "Unable to create the record.";

        try {
            const errorData = await response.json();

            errorMessage =
                errorData.detail ||
                errorData.message ||
                errorMessage;
        } catch {
            // The backend did not return a JSON error response.
        }

        throw new Error(errorMessage);
    }

    return response.json();
}