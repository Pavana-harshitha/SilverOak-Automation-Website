import React, { useState } from "react";

export default function FileUpload({files,onFilesChange}) {
  const [uploadMode, setUploadMode] = useState("single");
  
  const handleUploadModeChange = (mode) => {
    setUploadMode(mode);
    onFilesChange([]); // Clear previous selection when mode changes
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    onFilesChange(selectedFiles);
  };

  return (
    <div className="file-upload">

      <h3>Upload Documents</h3>

      <div className="upload-mode">

        <label>
          <input
            type="radio"
            name="uploadMode"
            value="single"
            checked={uploadMode === "single"}
            onChange={() => handleUploadModeChange("single")}
          />
          Single File
        </label>

        <label>
          <input
            type="radio"
            name="uploadMode"
            value="folder"
            checked={uploadMode === "folder"}
            onChange={() => handleUploadModeChange("folder")}
          />
          Folder
        </label>

      </div>

      {uploadMode === "single" ? (
        <input
          type="file"
          onChange={handleFileChange}
        />
      ) : (
        <input
          type="file"
          multiple
          webkitdirectory=""
          directory=""
          onChange={handleFileChange}
        />
      )}

      

    </div>
  );
}