const BASE_URL = import.meta.env.VITE_API_URL;

export const API = {
    records: `${BASE_URL}/records`,
    record: `${BASE_URL}/record`,
    process: `${BASE_URL}/process`,
};

async function getErrorMessage(response, fallbackMessage) {
    try {
        const errorData = await response.json();

        return (
            errorData.detail ||
            errorData.message ||
            errorData.error ||
            fallbackMessage
        );
    } catch {
        return fallbackMessage;
    }
}

export async function createRecord(recordData) {
    const response = await fetch(API.record, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(recordData),
    });

    if (!response.ok) {
        const errorMessage = await getErrorMessage(
            response,
            "Unable to create the record."
        );

        throw new Error(errorMessage);
    }

    return response.json();
}

export async function processDocument(processData) {
    const response = await fetch(API.process, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(processData),
    });

    if (!response.ok) {
        const errorMessage = await getErrorMessage(
            response,
            "Document processing failed."
        );

        throw new Error(errorMessage);
    }

    const data = await response.json();

    return data;
}

export async function updateRecord(recordId, updateData) {
    const response = await fetch(
        `${API.record}/${recordId}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
        }
    );

    if (!response.ok) {
        const errorMessage = await getErrorMessage(
            response,
            "Unable to update the record."
        );

        throw new Error(errorMessage);
    }

    return response.json();
}