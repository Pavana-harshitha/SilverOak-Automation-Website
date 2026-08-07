import { useRef, useState } from "react";
import documentCategories from "../data/documentCategories";
import documentTypes from "../data/documentTypes";
import sourceSystems from "../data/sourceSystems";
import priorities from "../data/priorities";

import "./Upload.css";
import processMappings from "../data/processMappings";
import {createRecord,processDocument,updateRecord,} from "../api/api";

function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result !== "string") {
                reject(new Error("Unable to read the selected PDF."));
                return;
            }

            const base64Content = reader.result.split(",")[1];

            if (!base64Content) {
                reject(new Error("Unable to convert the PDF to Base64."));
                return;
            }

            resolve(base64Content);
        };

        reader.onerror = () => {
            reject(new Error("Failed to read the selected PDF."));
        };

        reader.readAsDataURL(file);
    });
}

function Upload() {
    const [category, setCategory] = useState("");
    const [type, setType] = useState("");
    const [source, setSource] = useState("");
    const [priority, setPriority] = useState("");
    const [file, setFile] = useState(null);

    const [recordId, setRecordId] = useState(null);
    const [isCreatingRecord, setIsCreatingRecord] = useState(false);
    const [recordError, setRecordError] = useState("");
    const [uploadStatus, setUploadStatus] = useState("");

    const [fileError, setFileError] = useState("");
   
    const fileInputRef = useRef(null);
    
    function handleCategoryChange(e) {
        setCategory(e.target.value);
        setType("");
    }

    function handleFileChange(e) {
        const selectedFile = e.target.files?.[0];

        if (!selectedFile) {
            return;
        }

        setFile(selectedFile);
    } 

async function handleCreateRecord() {
    setRecordError("");
    setRecordId(null);
    setUploadStatus("");

    if (!category) {
        setRecordError("Please select a document category.");
        return;
    }

    if (!type) {
        setRecordError("Please select a document type.");
        return;
    }

    if (!file) {
        setRecordError("Please select a PDF file.");
        return;
    }

    const processDetails = processMappings[category]?.[type];

    if (!processDetails) {
        setRecordError(
            "No process mapping was found for the selected document."
        );
        return;
    }

    const recordRequestBody = {
        name: file.name,
        process_name: processDetails.processName,
        process_code: processDetails.processCode,
    };

    let returnedRecordId = null;

    try {
        setIsCreatingRecord(true);

        // ---------------------------
        // STEP 3 - Create Record
        // ---------------------------

        setUploadStatus("Creating record...");

        const createdRecord = await createRecord(
            recordRequestBody
        );

        returnedRecordId =
            createdRecord?.record?.id;

        if (!returnedRecordId) {
            throw new Error(
                "The record was created, but no record ID was returned."
            );
        }

        setRecordId(returnedRecordId);

        // ---------------------------
        // STEP 4 - Convert PDF
        // ---------------------------

        setUploadStatus("Converting PDF...");

        const base64Content =
            await convertFileToBase64(file);

        const processRequestBody = {
            process_name:
                processDetails.processName,

            process_code:
                processDetails.processCode,

            name: file.name,

            content: base64Content,

            id: returnedRecordId,
        };

        // ---------------------------
        // STEP 4 - Process Document
        // ---------------------------

        setUploadStatus(
            "Processing document..."
        );

        try {
            const processResponse =
                await processDocument(
                    processRequestBody
                );

            // ---------------------------
            // STEP 5 - SUCCESS UPDATE
            // ---------------------------

            setUploadStatus(
                "Updating record..."
            );

            await updateRecord(
                returnedRecordId,
                {
                    status: "Success",
                    response: processResponse,
                    error: null,
                }
            );

            setUploadStatus("Completed");

        } catch (processError) {

            // ---------------------------
            // STEP 5 - FAILURE UPDATE
            // ---------------------------

            const errorMessage =
                processError instanceof Error
                    ? processError.message
                    : "Document processing failed.";

            try {
                await updateRecord(
                    returnedRecordId,
                    {
                        status: "Failure",
                        response: null,
                        error: errorMessage,
                    }
                );
            } catch (updateError) {
                console.error(
                    "Failed to update record status:",
                    updateError
                );
            }

            throw processError;
        }

    } catch (error) {

        console.error(
            "Document upload failed:",
            error
        );

        setRecordError(
            error instanceof Error
                ? error.message
                : "Something went wrong while processing the document."
        );

        setUploadStatus("");

    } finally {

        setIsCreatingRecord(false);

    }
}

    function handleRemoveFile() {
        setFile(null);
        setFileError("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    function handleReplaceFile() {
        fileInputRef.current?.click();
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

                {/* File Upload */}

                <div className="form-group">
                    <label htmlFor="pdf-file">Upload PDF</label>

                    <input
                        id="pdf-file"
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleFileChange}
                    />

                    {file && (
                        <p className="selected-file">
                            Selected file: {file.name}
                        </p>
                    )}
                </div>

                <div className="form-group">
                    <label>&nbsp;</label>
                    <button
                        type="button"
                        className="upload-btn"
                        onClick={handleCreateRecord}
                        disabled={isCreatingRecord}
                    >
                        {isCreatingRecord ? uploadStatus : "Upload"}
                    </button>
                    
                    {uploadStatus === "Completed" && recordId && (
                        <p className="record-success">
                            Document submitted successfully. Record ID: {recordId}
                        </p>
                    )}

                    {recordError && (
                        <p className="record-error">
                            {recordError}
                        </p>
                    )}
                    
                    {recordId && (
                        <p className="record-success">
                            Record created successfully. Record ID: {recordId}
                        </p>
                    )}

                    {recordError && (
                        <p className="record-error">
                            {recordError}
                        </p>
                    )}
                </div>

            </div>

        </div>
    );
}

export default Upload;