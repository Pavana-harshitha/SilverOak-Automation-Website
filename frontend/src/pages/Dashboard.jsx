import { useEffect, useState } from "react";
import { API } from "../api/api";

function Dashboard() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchRecords();
    }, []);

    async function fetchRecords() {
        try {
            setLoading(true);

            const response = await fetch(API.records);

            if (!response.ok) {
                throw new Error("Failed to fetch records.");
            }

            const data = await response.json();

            setRecords(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <h2>Loading dashboard...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div>
            <h1>Dashboard</h1>

            <p>Total Records: {records.length}</p>
        </div>
    );
}

export default Dashboard;