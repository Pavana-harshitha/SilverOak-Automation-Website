import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

const COLORS = [
    "#22c55e", // Success
    "#f59e0b", // Pending
    "#ef4444", // Failure
];

function StatusPieChart({ success, pending, failed }) {

    const data = [
        { name: "Success", value: success },
        { name: "Pending", value: pending },
        { name: "Failure", value: failed },
    ];

    return (
        <div
            style={{
                background: "#fff",
                marginTop: "30px",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}
        >
            <h2>Status Distribution</h2>

            <ResponsiveContainer width="100%" height={320}>
                <PieChart>

                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
                        dataKey="value"
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={index}
                                fill={COLORS[index]}
                            />
                        ))}
                    </Pie>

                    <Tooltip />

                    <Legend />

                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export default StatusPieChart;