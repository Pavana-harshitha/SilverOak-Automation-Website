import React, { useState } from "react";

import DropdownField from "../components/upload/DropdownField";
import PrioritySelector from "../components/upload/PrioritySelector";
import FileUpload from "../components/upload/FileUpload";


import documentCategories from "../data/documentCategories";
import documentTypes from "../data/documentTypes";
import sourceSystems from "../data/sourceSystems";

export default function Upload() {

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedType("");
  };

  const handleReset = () => {
    setSelectedCategory("");
    setSelectedType("");
    setSelectedSource("");
    setSelectedPriority("");
  };

  return (
    <div className="upload-page">

      <h1>Upload</h1>

      <DropdownField
        label="Document Category"
        value={selectedCategory}
        options={documentCategories}
        onChanged={handleCategoryChange}
      />

      <DropdownField
        label="Document Type"
        value={selectedType}
        options={
          selectedCategory
            ? documentTypes[selectedCategory]
            : []
        }
        onChanged={setSelectedType}
      />

      <DropdownField
        label="Source System"
        value={selectedSource}
        options={sourceSystems}
        onChanged={setSelectedSource}
      />

      <PrioritySelector
        value={selectedPriority}
        onChange={setSelectedPriority}
      />

      <FileUpload />
      <button onClick={handleReset}>
        Reset
      </button>

    </div>
  );
}