import React from 'react';
import axios from 'axios';
import './Exportexcle.css';

const ExportBookings = () => {
  const handleExport = async () => {
    try {
      const response = await axios.get('http://localhost:8888/api/export-bookings', {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'bookings.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export bookings');
    }
  };

  return (
    <div className="export-container">
      <h2 className="export-title">Export All Bookings</h2>
      <p className="export-desc">Click below to download the MAG / WAG booking data in Excel format.</p>
      <button onClick={handleExport} className="export-button">
        📥 Download Bookings (MAG / WAG)
      </button>
    </div>
  );
};

export default ExportBookings;
