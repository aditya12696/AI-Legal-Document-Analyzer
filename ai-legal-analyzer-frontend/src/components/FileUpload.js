import React, { useState } from "react";
import axios from "axios";
import { Button, Typography, CircularProgress } from "@mui/material";
import UploadIcon from "../assets/upload_icon.png";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setResult(null); // clear previous result
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file.");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/documents/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResult(response.data.extractedText);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload file. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "30px", textAlign: "center" }}>
      <img src={UploadIcon} alt="upload" width="80" />
      <div style={{ margin: "20px" }}>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          style={{ marginBottom: "10px" }}
        />
        <br />
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Upload Document"}
        </Button>
      </div>
      {file && (
        <Typography style={{ marginTop: "10px" }}>
          Selected File: {file.name}
        </Typography>
      )}
      {result && (
        <div style={{ marginTop: "30px", textAlign: "left", padding: "0 20px" }}>
          <Typography variant="h6">Extracted Text:</Typography>
          <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
            {result}
          </pre>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
