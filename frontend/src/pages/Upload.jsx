import { useState } from "react";

import documentCategories from "../data/documentCategories";
import documentTypes from "../data/documentTypes";
import sourceSystems from "../data/sourceSystems";
import priorities from "../data/priorities";

import "./Upload.css";

function Upload() {
    const [category, setCategory] = useState("");
    const [type, setType] = useState("");
    const [source, setSource] = useState("");
    const [priority, setPriority] = useState("");
    const [file, setFile] = useState(null);

    function handleCategoryChange(e) {
        setCategory(e.target.value);
        setType("");
    }

    function handleFileChange(e) {
        if (e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    }

    return (

        <div className="upload-page">

            <div className="page-header">
            <h1>Upload Document</h1>

            <p>
                Upload an insurance document for automated processing.
            </p>
            </div>
            

            <div className="upload-card">

                {/* Category */}

                <div className="form-group">
                    <label>Document Category</label>

                    <select
                        value={category}
                        onChange={handleCategoryChange}
                    >
                        <option value="">Select Category</option>

                        {documentCategories.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Type */}

                <div className="form-group">
                    <label>Document Type</label>

                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        disabled={!category}
                    >
                        <option value="">Select Type</option>

                        {category &&
                            documentTypes[category].map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                    </select>
                </div>

                {/* Source */}

                <div className="form-group">
                    <label>Source System</label>

                    <select
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                    >
                        <option value="">Select Source</option>

                        {sourceSystems.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Priority */}

                <div className="form-group">

                    <label>Priority</label>

                    <div className="priority-buttons">

                        {priorities.map((item) => (

                            <button
                                type="button"
                                key={item}
                                className={
                                    priority === item
                                        ? "priority-btn active"
                                        : "priority-btn"
                                }
                                onClick={() => setPriority(item)}
                            >
                                {item}
                            </button>

                        ))}

                    </div>

                </div>

                {/* File */}

                <div className="form-group">
                    
                    <label>Upload PDF</label>

                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                    />

                    {file && (
                        <p className="selected-file">
                            {file.name}
                        </p>
                    )}

                </div>

                <div className="form-group">
                    <label>&nbsp;</label>

                    <button className="upload-btn">
                        Upload
                    </button>
                </div>

            </div>

        </div>
    );
}

export default Upload;