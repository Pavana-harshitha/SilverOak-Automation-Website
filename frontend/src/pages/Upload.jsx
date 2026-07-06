import React, { useState } from "react";

import DropdownField from "../components/upload/DropdownField";

import formTypes from "../data/formTypes";
import priorities from "../data/priorities";


export default function Upload() {

  const [selectedFormType, setSelectedFormType] = useState("");

  const [selectedPriority, setSelectedPriority] = useState("");

  return (
    <div className="upload-page">

      <h1>Upload</h1>

      <DropdownField
        label="Form Type"
        value={selectedFormType}
        options={formTypes}
        onChanged={setSelectedFormType}
      />

      <DropdownField
        label="Priorities"
        value={selectedPriority}
        options={priorities}
        onChanged={setSelectedPriority}
      />

      

    </div>
  );
}