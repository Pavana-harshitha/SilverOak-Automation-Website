import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";

function RequestTrendChart({ records }) {

    const requestsPerDay = {};

    records.forEach((record) => {

        const date = new Date(record.created_at).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
            }
        );

        requestsPerDay[date] = (requestsPerDay[date] || 0) + 1;
    });

    const chartData = Object.keys(requestsPerDay).map((date) => ({
        date,
        requests: requestsPerDay[date],
    }));

    return (
        <div className="chart-card">

            <h2>Requests Per Day</h2>

            <ResponsiveContainer width="100%" height={320}>

                <LineChart data={chartData}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="date" />

                    <YAxis allowDecimals={false} />

                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="requests"
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={{ r: 5 }}
                    />

                </LineChart>

            </ResponsiveContainer>

        </div>
    );
}

export default RequestTrendChart;