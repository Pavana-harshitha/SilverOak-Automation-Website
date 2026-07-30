import "./SummaryCard.css";

function SummaryCard({ title, count }) {
    return (
        <div className="summary-card">
            <h3>{title}</h3>
            <p>{count}</p>
        </div>
    );
}

export default SummaryCard;