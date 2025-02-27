import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './FileUpload.css';

export function FileUpload() {
    const [uploadStatus, setUploadStatus] = useState({
        isUploading: false,
        successFiles: [],
        failedFiles: {},
        batchId: null,
        isProcessing: false
    });

    const onDrop = useCallback(async (acceptedFiles) => {
        const formData = new FormData();
        acceptedFiles.forEach(file => {
            formData.append('files', file);
        });

        setUploadStatus(prev => ({ ...prev, isUploading: true }));

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/batch-upload`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            setUploadStatus({
                isUploading: false,
                successFiles: result.successful_uploads,
                failedFiles: result.failed_uploads,
                batchId: result.batch_id,
                isProcessing: false
            });
        } catch (error) {
            setUploadStatus(prev => ({
                ...prev,
                isUploading: false,
                failedFiles: {
                    'upload_error': 'Failed to upload files: ' + error.message
                }
            }));
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf']
        },
        multiple: true
    });

    return (
        <section className="centered-content" style={{ height: '20vh', width: '80vw' }}>
            <div className="upload-container">
                <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p>Drop the PDF files here...</p>
                    ) : (
                        <p>Drag & drop PDF files here, or click to select files</p>
                    )}
                </div>

                {uploadStatus.isUploading && <p>Uploading...</p>}

                {uploadStatus.successFiles.length > 0 && (
                    <div id="success-files">
                        <h4>Successfully uploaded:</h4>
                        <ul>
                            {uploadStatus.successFiles.map(file => (
                                <li key={file}>{file}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {Object.keys(uploadStatus.failedFiles).length > 0 && (
                    <div id="failed-files">
                        <h4>Failed uploads:</h4>
                        <ul>
                            {Object.entries(uploadStatus.failedFiles).map(([file, error]) => (
                                <li key={file.toString()}>{file.toString()}: {error.toString()}</li>
                            ))}
                        </ul>
                    </div>
                )}

            </div>
        </section>
    );
} 