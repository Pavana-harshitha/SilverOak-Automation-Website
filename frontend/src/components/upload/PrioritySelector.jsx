import React from "react";

const priorities = [
  "Low",
  "Medium",
  "High",
  "Critical"
];

export default function PrioritySelector({
  value,
  onChange
}) {
  return (
    <div className="priority-selector">
      <label>Priority</label>

      <div className="priority-options">
        {priorities.map((priority) => (
          <label key={priority}>
            <input
              type="radio"
              name="priority"
              value={priority}
              checked={value === priority}
              onChange={(e) => onChange(e.target.value)}
            />

            {priority}
          </label>
        ))}
      </div>
    </div>
  );
}