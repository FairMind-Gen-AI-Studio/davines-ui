import { useState, useEffect } from 'react';

export function BatchProgress({ batchId }) {
    const [details, setDetails] = useState(null);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/batch-status/${batchId}`);
                const data = await response.json();
                setDetails(data);
            } catch (error) {
                console.error('Failed to fetch batch progress:', error);
            }
        };

        if (batchId) {
            fetchProgress();
            const interval = setInterval(fetchProgress, 5000); // Fetch every 5 seconds
            return () => clearInterval(interval);
        }
    }, [batchId]);

    if (!details) return null;

    const formatTime = (seconds) => {
        if (!seconds) return "calculating...";
        if (seconds < 60) return `${Math.round(seconds)}s`;
        return `${Math.round(seconds / 60)}m ${Math.round(seconds % 60)}s`;
    };

    const downloadFile = async (fileId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/download-file/${fileId}`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `processed-file-${fileId}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Failed to download file:', error);
        }
    };

    return (
        <div className="batch-progress">
            <div className="overall-progress">
                <h5>Overall Progress:</h5>
                <div className="progress-bar">
                    <div
                        className={`progress-fill ${details.status === 'completed' ? 'completed' : ''}`}
                        style={{ width: `${details.overall_progress}%` }}
                    />
                </div>
            </div>
            <div className="progress-stats">
                <p>Status: <span className={`status-badge ${details.status}`}>{details.status}</span></p>
                <p>Progress: {details.overall_progress}%</p>
                <p>Files: {details.completed_files} / {details.total_files}</p>
                <p>Started: {new Date(details.started_at).toLocaleString()}</p>
                
            </div>

            <div className="current-files">
                <h5>Files Status:</h5>
                {Object.entries(details.current_files).map(([id, file]) => (
                    <div key={id} id={id} className={`file-status ${file.status.toLowerCase()}`}>
                        <div className="file-header">
                            <strong>{file.current_file}</strong>
                            <span className={`status-badge ${file.status.toLowerCase()}`}>
                                {file.status}
                            </span>
                        </div>
                        {file.progress && (
                            <div className="file-progress">
                                <div className="progress-bar">
                                    <div
                                        className={`progress-fill ${file.status === 'completed' ? 'completed' : ''}`}
                                        style={{ width: `${parseFloat(file.progress)}%` }}
                                    />
                                </div>
                                <span className="progress-text">{file.progress}</span>
                            </div>
                        )}
                        <div className="file-details">
                            {file.current_step && (
                                <span>Step: {file.current_step}</span>
                            )}
                            {file.started_at && (
                                <span>Started: {new Date(file.started_at).toLocaleString()}</span>
                            )}
                            {file.completed_at && (
                                <span>Completed: {new Date(file.completed_at).toLocaleString()}</span>
                            )}
                            {file.processing_time > 0 && (
                                <span>Processing time: {formatTime(file.processing_time)}</span>
                            )}
                            {file.error && <p className="error-message">{file.error}</p>}
                            {file.status === 'completed' && (
                                <button 
                                    onClick={() => downloadFile(id)}
                                    className="process-button"
                                >
                                    Download Result
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 