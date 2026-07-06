import React from "react";

export default function DropdownField({
  label,
  value,
  options,
  onChanged
}) {
  return (
    <div className="dropdown-field">
      <label>{label}</label>

      <select
        value={value}
        onChange={(e) => onChanged(e.target.value)}
      >
        <option value="">Select {label}</option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}