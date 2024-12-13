import { useState, useEffect } from 'react';
import { BatchProgress } from './BatchProgress';

export function ActiveBatches() {
    const [activeBatches, setActiveBatches] = useState(null);

    const startProcessing = async (batchId) => {
        try {
            await fetch(`${process.env.REACT_APP_API_URL}/process-batch/${batchId}`, {
                method: 'POST'
            });
        } catch (error) {
            console.error('Failed to start processing:', error);
        }
    };

    const deleteBatch = async (batchId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/batch/${batchId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Remove the batch from state immediately for better UX
                setActiveBatches(prev => ({
                    ...prev,
                    active_batches: prev.active_batches.filter(b => b.batch_id !== batchId),
                    total_batches: prev.total_batches - 1
                }));
            } else if (response.status === 404) {
                console.error('Batch not found');
            }
        } catch (error) {
            console.error('Failed to delete batch:', error);
        }
    };

    useEffect(() => {
        const fetchActiveBatches = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/active-batches`);
                
                const data = await response.json();
                
                setActiveBatches(data);
            } catch (error) {
                console.error('Failed to fetch active batches:', error);
            }
        };

        fetchActiveBatches();
        const interval = setInterval(fetchActiveBatches, 60000); // Fetch every minute
        return () => clearInterval(interval);
    }, []);

    if (!activeBatches || activeBatches.active_batches.length === 0) return null;

    return (
        <div className="active-batches">
            <div className="active-batches-header">
                <h3>Active Batches ({activeBatches.total_batches})</h3>

            </div>

            {activeBatches.active_batches.map(batch => (
                <div key={batch.batch_id} className="batch-container">
                    <div className="batch-header">
                        <div className="batch-info">
                            <h4>Batch ID: {batch.batch_id}</h4>
                            <span className={`status-badge ${batch.status}`}>{batch.status}</span>
                        </div>
                        <div className="batch-stats">
                            <span>Files: {batch.progress.files_by_status.completed}/{batch.progress.total_files}</span>

                            <span>Elapsed: {batch.timing.elapsed_time_formatted}</span>


                        </div>
                        <div className="batch-actions">
                            {batch.status === 'queued' && (
                                <button
                                    onClick={() => startProcessing(batch.batch_id)}
                                    className="process-button"
                                >
                                    Start Processing
                                </button>
                            )}
                            <button
                                onClick={() => deleteBatch(batch.batch_id)}
                                className="delete-button"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                    {batch.errors.error_count > 0 && (
                        <div className="batch-errors">
                            <h5>Errors ({batch.errors.error_count}):</h5>
                            <ul>
                                {batch.errors.error_details.map((error, index) => (
                                    <li key={index}>{error.error} - {error.file}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <BatchProgress batchId={batch.batch_id} />
                </div>
            ))}
        </div>
    );
} 