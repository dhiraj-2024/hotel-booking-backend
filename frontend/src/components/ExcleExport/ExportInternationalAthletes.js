import React from 'react';
import axios from 'axios';
import './Exportexcle.css';

const ExportInternationalAthletes = () => {
  const handleExport = async () => {
    try {
      const response = await axios.get("http://localhost:8888/api/international-athletes/export/excel", {
        responseType: 'blob',
        withCredentials: true,
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `international_athletes_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
      alert(`Export failed: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="export-container">
      <h2 className="export-title">Export International Athletes</h2>
      <p className="export-desc">Download a well-formatted Excel sheet of all international athlete bookings.</p>
      <button onClick={handleExport} className="export-button">
        🌍 Download International Athletes
      </button>
    </div>
  );
};

export default ExportInternationalAthletes;
