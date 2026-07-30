import { useEffect, useState } from "react";
import { API } from "../api/api";
import SummaryCard from "../components/dashboard/SummaryCard";
import "./Dashboard.css";
import StatusPieChart from "../components/dashboard/StatusPieChart";

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

    const total = records.length;

    const success = records.filter(
        (record) => record.status === "Success"
    ).length;

    const pending = records.filter(
        (record) => record.status === "Pending"
    ).length;

    const failed = records.filter(
        (record) => record.status === "Failure"
    ).length;

    return (
    <div>

        <h1>Dashboard</h1>

        <div className="summary-container">
            <SummaryCard title="Total Documents" count={total} />
            <SummaryCard title="Success" count={success} />
            <SummaryCard title="Pending" count={pending} />
            <SummaryCard title="Failed" count={failed} />
        </div>

        <StatusPieChart
            success={success}
            pending={pending}
            failed={failed}
        />

    </div>
    );
}

export default Dashboard;