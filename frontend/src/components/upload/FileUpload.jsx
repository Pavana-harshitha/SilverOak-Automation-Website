import React, { useState } from "react";

export default function FileUpload() {
  const [uploadMode, setUploadMode] = useState("single");
  const [files, setFiles] = useState([]);

  const handleUploadModeChange = (mode) => {
    setUploadMode(mode);
    setFiles([]); // Clear previous selection when mode changes
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
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

      {files.length > 0 && (
        <div className="selected-files">
          <h4>Selected Files</h4>

          <ul>
            {files.map((file, index) => (
              <li key={index}>
                {file.name}
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}