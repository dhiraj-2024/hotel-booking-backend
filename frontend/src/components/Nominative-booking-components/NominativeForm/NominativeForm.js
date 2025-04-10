// src/components/NominativeForm/NominativeForm.js
import React, { useState } from "react";
import Select from "react-select";
import { State } from "country-state-city";
import "./NominativeForm.css";
import { cashfree } from "../../MAG_WAG_booking_compnents/BookingForm/utils/utils.cashfree.js";

const NominativeForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    state: "",
    mobileNumber: "",
    dateOfBirth: "",
    // email: "",
    // teamName: "",
    paymentStatus: "PENDING",
    registrationFee: 0,
  });

  const roles = [
    { value: "gymnast", label: "Gymnast" },
    { value: "hod", label: "HOD" },
    { value: "judge", label: "Judge" },
    { value: "technical_official", label: "Technical Official" },
    { value: "coach", label: "Coach" },
    { value: "manager", label: "Manager" },
  ];

  const baseStates = State.getStatesOfCountry("IN").map((state) => ({
    value: state.isoCode,
    label: state.name,
  }));
  const additionalOptions = [
    { value: "SSCB", label: "SSCB" },
    { value: "Railways", label: "Railways" },
    { value: "Andaman and Nicobar Islands", label: "Andaman and Nicobar Islands" },
    { value: "Chandigarh", label: "Chandigarh" },
    { value: "Dadra and Nagar Haveli and Daman and Diu", label: "Dadra and Nagar Haveli and Daman and Diu" },
    { value: "Delhi", label: "Delhi" },
    { value: "Jammu and Kashmir", label: "Jammu and Kashmir" },
    { value: "Ladakh", label: "Ladakh" },
    { value: "Lakshadweep", label: "Lakshadweep" },
    { value: "Puducherry", label: "Puducherry" },
  ];
    
  const indianStates = [...baseStates, ...additionalOptions];


  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      registrationFee: name === "role" && value === "judge" ? 0 : 1000,
    }));
  };

  const handleRoleChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      role: selectedOption.value,
      registrationFee: selectedOption.value === "judge" ? 0 : 1000,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = "http://localhost:8888/api/nominative/";
      const payload = {
        ...formData,
        // Ensure all required fields are included
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include", // If using cookies/sessions
      });

      if (!response.ok) {
        const errorData = await response.text(); // First try to read as text
        try {
          // If it's JSON, parse it
          const jsonError = JSON.parse(errorData);
          throw new Error(jsonError.message || "Registration failed");
        } catch {
          // If not JSON, use the raw text
          throw new Error(errorData || "Registration failed");
        }
      }

      const data = await response.json();

      if (formData.role === "judge") {
        alert("Registration successful!");
        // Optionally reset form or redirect
      } else {
        if (data.success && data.sessionId) {
          let checkoutOptions = {
            paymentSessionId: data.sessionId,
            returnUrl: `http://localhost:8888/api/nominative/status/${data.order_id}`,
          };
          cashfree.checkout(checkoutOptions);
        } else {
          throw new Error(data.message || "Payment initialization failed");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="main-c">
      <div>
      </div>
      <div className="nominative-container">
        <div className="nominative-header">
          <h2>Nominative Entry Form</h2>
          <p className="subtitle">Note: If you need to update any field after submission, an additional fee of ₹1000 will be applicable.</p>
        </div>

        <form onSubmit={handleSubmit} className="nominative-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <Select
              id="role"
              options={roles}
              name="role"
              value={roles.find((r) => r.value === formData.role)}
              onChange={handleRoleChange}
              placeholder="Select your role"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              max={new Date().toISOString().split("T")[0]}
              className="date-input" // Add this if you want specific styling
              onFocus={(e) => (e.target.showPicker = false)} // Prevent immediate popup
            />
          </div>

          {/* <div className="form-group">
            <label htmlFor="teamName">Team Name</label>
            <input 
              type="text" 
              id="teamName" 
              name="teamName" 
              placeholder="Enter your team name" 
              value={formData.teamName} 
              onChange={handleChange} 
              required 
            />
          </div> */}

          <div className="form-group">
            <label htmlFor="state">State</label>
            <Select
              id="state"
              options={indianStates}
              name="state"
              value={indianStates.find((s) => s.value === formData.state)}
              onChange={(selectedOption) =>
                setFormData((prev) => ({
                  ...prev,
                  state: selectedOption.value,
                }))
              }
              placeholder="Select state / Union Territories"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="mobileNumber">Mobile Number</label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              placeholder="Enter 10-digit mobile number"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
              minLength="10"
              maxLength="10"
              pattern="[0-9]{10}"
            />
          </div>

          {/* <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="Enter your email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div> */}

          {formData.role !== "judge" && (
            <div className="price-summary">
              <h3>Registration Fee</h3>
              <p className="total-amount">Rs. {formData.registrationFee}</p>
            </div>
          )}

          <button type="submit" className="submit-button">
            {formData.role === "judge"
              ? "Submit Registration"
              : "Proceed to Pay"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NominativeForm;
