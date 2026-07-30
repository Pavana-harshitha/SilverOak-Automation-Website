import "./RecentActivity.css";

function RecentActivity({ records }) {

    const recentRecords = records.slice(0, 5);

    function formatDate(date) {
        return new Date(date).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    }

    return (
        <div className="recent-activity">

            <h2>Recent Activity</h2>

            <table>

                <thead>
                    <tr>
                        <th>Filename</th>
                        <th>Process</th>
                        <th>Status</th>
                        <th>Created At</th>
                    </tr>
                </thead>

                <tbody>

                    {recentRecords.map((record) => (

                        <tr key={record.id}>

                            <td>{record.filename}</td>

                            <td>{record.process_name}</td>

                            <td>
                                <span className={`status ${record.status.toLowerCase()}`}>
                                    {record.status}
                                </span>
                            </td>

                            <td>{formatDate(record.created_at)}</td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default RecentActivity;