import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import Select from "react-select";
import { State } from "country-state-city";
import "./BookingForm.css";
import { cashfree } from "./utils/utils.cashfree.js";

const BookingForm = () => {
  const { state } = useLocation();
  const { accommodation } = state || {};
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    name: "",
    // teamName: "",  // Commented out as per request
    teamType: "",
    state: "",
    mobileNumber: "",
    email: "",
    checkIn: "",
    checkOut: "",
    stayDuration: "4",
    roomType1: 0,
    roomType2: 0,
    // memberDetails: [],  // Commented out as per request
    totalPrice: 0,
    hotelId: id,
    hotelName: accommodation?.name || "",
    accommodationType: accommodation?.type || "hostel" // Default to hostel
  });

//! state additional 
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

  // Mobile and email validation states
  const [validationErrors, setValidationErrors] = useState({
    mobileNumber: false,
    email: false
  });

  // Validate mobile number
  const validateMobile = (number) => {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(number);
  };

  // Validate email
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Determine room types based on accommodation type
  const roomTypes = useMemo(() => {
    return formData.accommodationType === "hostel" 
      ? { 
          type1: "triple-sharing-Rooms", 
          label1: "Triple Sharing (3 persons max)",
          type2: "quad-sharing-Rooms",
          label2: "Quad Sharing (4 persons max)"
        }
      : { 
          type1: "double-sharing-Rooms", 
          label1: "Double Sharing (2 persons max)",
          type2: "triple-sharing-Rooms",
          label2: "Triple Sharing (3 persons max)"
        };
  }, [formData.accommodationType]);

  const teamTypeDates = useMemo(() => ({
    MAG: { 
      4: { checkIn: "2025-04-24", checkOut: "2025-04-28" },
      5: { checkIn: "2025-04-24", checkOut: "2025-04-29" }
    },
    WAG: { 
      4: { checkIn: "2025-04-29", checkOut: "2025-05-03" },
      5: { checkIn: "2025-04-29", checkOut: "2025-05-04" }
    },
  }), []);

  // Calculate price options based on accommodation data
  const priceOptions = useMemo(() => {
    if (!accommodation) return {};
    
    if (formData.accommodationType === "hostel") {
      return {
        type1_4: accommodation.priceOptions.find(opt => opt.nights === 4 && opt.persons === 3)?.price || 0,
        type1_5: accommodation.priceOptions.find(opt => opt.nights === 5 && opt.persons === 3)?.price || 0,
        type2_4: accommodation.priceOptions.find(opt => opt.nights === 4 && opt.persons === 4)?.price || 0,
        type2_5: accommodation.priceOptions.find(opt => opt.nights === 5 && opt.persons === 4)?.price || 0,
      };
    } else {
      return {
        type1_4: accommodation.priceOptions.find(opt => opt.nights === 4 && opt.persons === 2)?.price || 0,
        type1_5: accommodation.priceOptions.find(opt => opt.nights === 5 && opt.persons === 2)?.price || 0,
        type2_4: accommodation.priceOptions.find(opt => opt.nights === 4 && opt.persons === 3)?.price || 0,
        type2_5: accommodation.priceOptions.find(opt => opt.nights === 5 && opt.persons === 3)?.price || 0,
      };
    }
  }, [accommodation, formData.accommodationType]);

  // Update check-in/check-out dates when team type or duration changes
  useEffect(() => {
    if (formData.teamType && formData.stayDuration) {
      const dates = teamTypeDates[formData.teamType][formData.stayDuration];
      setFormData(prev => ({
        ...prev,
        checkIn: dates.checkIn,
        checkOut: dates.checkOut,
      }));
    }
  }, [formData.teamType, formData.stayDuration, teamTypeDates]);

  // Calculate total price when room selections or duration changes
  useEffect(() => {
    if (!accommodation) return;
    
    const nights = formData.stayDuration;
    const type1Price = nights === "4" ? priceOptions.type1_4 : priceOptions.type1_5;
    const type2Price = nights === "4" ? priceOptions.type2_4 : priceOptions.type2_5;
    
    const total = (formData.roomType1 * type1Price) + (formData.roomType2 * type2Price);
    
    setFormData(prev => ({
      ...prev,
      totalPrice: total
    }));
  }, [formData.roomType1, formData.roomType2, formData.stayDuration, priceOptions, accommodation]);

  // Commented out member details update effect as per request
  /*
  // Update member details when room selections change
  useEffect(() => {
    const personsPerType1 = formData.accommodationType === "hostel" ? 3 : 2;
    const personsPerType2 = formData.accommodationType === "hostel" ? 4 : 3;
    
    const totalMembers = (formData.roomType1 * personsPerType1) + (formData.roomType2 * personsPerType2);
    const currentMembers = formData.memberDetails.length;
    
    if (totalMembers > currentMembers) {
      // Add new empty member slots
      const newMembers = Array(totalMembers - currentMembers).fill({ name: "", gender: "" });
      setFormData(prev => ({
        ...prev,
        memberDetails: [...prev.memberDetails, ...newMembers]
      }));
    } else if (totalMembers < currentMembers) {
      // Remove extra member slots
      setFormData(prev => ({
        ...prev,
        memberDetails: prev.memberDetails.slice(0, totalMembers)
      }));
    }
  }, [formData.roomType1, formData.roomType2, formData.accommodationType, formData.memberDetails.length]);
  */

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validate mobile number and email on change
    if (name === "mobileNumber") {
      setValidationErrors(prev => ({
        ...prev,
        mobileNumber: !validateMobile(value)
      }));
    } else if (name === "email") {
      setValidationErrors(prev => ({
        ...prev,
        email: !validateEmail(value)
      }));
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // const indianStates = State.getStatesOfCountry("IN").map(state => ({
  //   value: state.isoCode,
  //   label: state.name,
  // }));

  const handleRoomChange = (roomType, value) => {
    const numValue = parseInt(value) || 0;
    const otherRoomType = roomType === "roomType1" ? "roomType2" : "roomType1";
    
    // Calculate maximum allowed value for this room type (6 - other room type selection)
    const maxAllowed = 6 - formData[otherRoomType];
    
    if (numValue > maxAllowed) {
      alert(`You can book maximum 6 rooms in total. You've already selected ${formData[otherRoomType]} of the other type.`);
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [roomType]: numValue
    }));
  };

  const getMaxSelectable = (currentRoomType) => {
    const otherRoomType = currentRoomType === "roomType1" ? "roomType2" : "roomType1";
    return 6 - formData[otherRoomType];
  };

  // Commented out member detail change handler as per request
  /*
  const handleMemberDetailChange = (index, field, value) => {
    const updatedMembers = [...formData.memberDetails];
    updatedMembers[index] = {
      ...updatedMembers[index],
      [field]: value
    };
    setFormData(prev => ({ ...prev, memberDetails: updatedMembers }));
  };
  */

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate mobile and email before submission
    if (!validateMobile(formData.mobileNumber)) {
      alert("Please enter a valid 10-digit Indian mobile number");
      return;
    }
    
    if (!validateEmail(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }
    
    // Commented out member details validation as per request
    /*
    // Validate all member details are filled
    const incompleteMember = formData.memberDetails.some(member => 
      !member.name || !member.gender
    );
    
    if (incompleteMember) {
      alert("Please fill all member details");
      return;
    }
    */
  
    try {
      const response = await fetch("http://localhost:8888/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          hotelId: id,
          hotelName: accommodation?.name,
          accommodationType: accommodation?.type,
          roomDetails: {
            [roomTypes.type1]: formData.roomType1,
            [roomTypes.type2]: formData.roomType2
          },
          totalMembers: (formData.roomType1 * (formData.accommodationType === "hostel" ? 3 : 2)) + 
                       (formData.roomType2 * (formData.accommodationType === "hostel" ? 4 : 3)),
          totalRooms: formData.roomType1 + formData.roomType2
        })
      });
  
      const data = await response.json();
      
      if (data.success) {
        let checkoutOptions = {
          paymentSessionId: data.sessionId,
          returnUrl: `${window.location.origin}/success?order_id=${data.order_id}`,
          redirectTarget: "_self"
        };
        
        cashfree.checkout(checkoutOptions);
      } else {
        throw new Error(data.message || "Payment initialization failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Payment processing failed");
    }
  };

  // Calculate total members and rooms
  const personsPerType1 = formData.accommodationType === "hostel" ? 3 : 2;
  const personsPerType2 = formData.accommodationType === "hostel" ? 4 : 3;
  const totalMembers = (formData.roomType1 * personsPerType1) + (formData.roomType2 * personsPerType2);
  const totalRooms = formData.roomType1 + formData.roomType2;

  return (
    <div className="main-c">
      <div>
      </div>
      <div className="booking-container">
        <div className="booking-header">
          <h2>Book Your Stay at <br/> <span style={{fontSize:"20px", color:"green"}}>{accommodation?.name}</span></h2>
          <p className="room-type">Available Rooms: {accommodation?.availableRooms}</p>
          <p className="accommodation-type">Type: {formData.accommodationType === "hostel" ? "Hostel" : "Hotel"}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-row">
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

            {/* Commented out team name field as per request */}
            {/* 
            <div className="form-group">
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
            </div>
            */}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="teamType">Team Type</label>
              <select 
                id="teamType" 
                name="teamType" 
                value={formData.teamType} 
                onChange={handleChange} 
                required
              >
                <option value="">Select Team Type</option>
                <option value="MAG">MAG (24/04 - 28/04)</option>
                <option value="WAG">WAG (29/04 - 03/05)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="state">State</label>
              <Select
                id="state"
                options={indianStates}
                name="state"
                value={indianStates.find((s) => s.value === formData.state)}
                onChange={(selectedOption) =>
                  setFormData((prev) => ({ ...prev, state: selectedOption.value }))
                }
                placeholder="Select your state"
                required
              />
            </div>
          </div>

          <div className="form-row">
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
                pattern="[6-9][0-9]{9}"
                className={validationErrors.mobileNumber ? "input-error" : ""}
              />
              {validationErrors.mobileNumber && (
                <small className="error-message">Please enter a valid 10-digit Indian mobile number</small>
              )}
              <small className="input-hint">Must start with 6-9 and 10 digits</small>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="Enter your email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                className={validationErrors.email ? "input-error" : ""}
              />
              {validationErrors.email && (
                <small className="error-message">Please enter a valid email address</small>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="stayDuration">Stay Duration</label>
            <div className="duration-options">
              <label className="duration-option">
                <input 
                  type="radio" 
                  name="stayDuration" 
                  value="4" 
                  checked={formData.stayDuration === "4"}
                  onChange={handleChange}
                  required
                />
                <span>4 Nights</span>
              </label>
              <label className="duration-option">
                <input 
                  type="radio" 
                  name="stayDuration" 
                  value="5" 
                  checked={formData.stayDuration === "5"}
                  onChange={handleChange}
                />
                <span>5 Nights</span>
              </label>
            </div>
          </div>

          <div className="date-display">
            <div className="date-item">
              <span className="date-label">Check-in:</span>
              <span className="date-value">{formData.checkIn}</span>
            </div>
            <div className="date-item">
              <span className="date-label">Check-out:</span>
              <span className="date-value">{formData.checkOut}</span>
            </div>
          </div>

          {/* Hidden date inputs for form submission */}
          <input type="hidden" name="checkIn" value={formData.checkIn} />
          <input type="hidden" name="checkOut" value={formData.checkOut} />

          <div className="room-selection-section">
            <h3>Select Your Rooms</h3>
            
            <div className="room-options">
              <div className="room-type-option">
                <h4>{roomTypes.label1}</h4>
                <p className="price-info">
                  {formData.stayDuration === "4" 
                    ? `₹${priceOptions.type1_4?.toLocaleString()} per room` 
                    : `₹${priceOptions.type1_5?.toLocaleString()} per room`}
                </p>
                <div className="room-quantity">
                  <label>Quantity:</label>
                  <select
                    value={formData.roomType1}
                    onChange={(e) => handleRoomChange("roomType1", e.target.value)}
                  >
                    {[...Array(getMaxSelectable("roomType1") + 1).keys()].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="room-type-option">
                <h4>{roomTypes.label2}</h4>
                <p className="price-info">
                  {formData.stayDuration === "4" 
                    ? `₹${priceOptions.type2_4?.toLocaleString()} per room` 
                    : `₹${priceOptions.type2_5?.toLocaleString()} per room`}
                </p>
                <div className="room-quantity">
                  <label>Quantity:</label>
                  <select
                    value={formData.roomType2}
                    onChange={(e) => handleRoomChange("roomType2", e.target.value)}
                  >
                    {[...Array(getMaxSelectable("roomType2") + 1).keys()].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="room-summary">
              <p>Total Rooms: {totalRooms}</p>
              <p>Total Members: {totalMembers}</p>
            </div>
          </div>

          {/* Commented out member details section as per request */}
          {/*
          {totalMembers > 0 && (
            <div className="member-details-section">
              <h3>Member Details ({totalMembers})</h3>
              <div className="member-grid">
                {formData.memberDetails.map((member, index) => (
                  <div key={index} className="member-form-group">
                    <h4>Member {index + 1}</h4>
                    <div className="form-group">
                      <label htmlFor={`member-name-${index}`}>Full Name</label>
                      <input 
                        type="text" 
                        id={`member-name-${index}`}
                        placeholder={`Enter member ${index + 1} name`} 
                        value={member.name} 
                        onChange={(e) => handleMemberDetailChange(index, "name", e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`member-gender-${index}`}>Gender</label>
                      <select 
                        id={`member-gender-${index}`}
                        value={member.gender} 
                        onChange={(e) => handleMemberDetailChange(index, "gender", e.target.value)} 
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          */}

          <div className="price-summary">
            <h3>Booking Summary</h3>
            <div className="price-details">
              {formData.roomType1 > 0 && (
                <p>
                  {roomTypes.label1}: {formData.roomType1} × 
                  ₹{formData.stayDuration === "4" 
                    ? priceOptions.type1_4?.toLocaleString() 
                    : priceOptions.type1_5?.toLocaleString()} = 
                  ₹{(formData.roomType1 * 
                    (formData.stayDuration === "4" ? priceOptions.type1_4 : priceOptions.type1_5))
                    .toLocaleString()}
                </p>
              )}
              {formData.roomType2 > 0 && (
                <p>
                  {roomTypes.label2}: {formData.roomType2} × 
                  ₹{formData.stayDuration === "4" 
                    ? priceOptions.type2_4?.toLocaleString() 
                    : priceOptions.type2_5?.toLocaleString()} = 
                  ₹{(formData.roomType2 * 
                    (formData.stayDuration === "4" ? priceOptions.type2_4 : priceOptions.type2_5))
                    .toLocaleString()}
                </p>
              )}
              <p className="total-amount">Total Amount: ₹{formData.totalPrice.toLocaleString()}</p>
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={totalRooms === 0 || !formData.teamType}
          >
            Proceed to Pay
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;









// import React, { useState, useEffect, useMemo } from "react";
// import { useLocation, useParams } from "react-router-dom";
// import Select from "react-select";
// import { State } from "country-state-city";
// import "./BookingForm.css";
// import { cashfree } from "./utils/utils.cashfree.js";

// const BookingForm = () => {
//   const { state } = useLocation();
//   const { accommodation } = state || {};
//   const { id } = useParams();
  
//   const [formData, setFormData] = useState({
//     name: "",
//     teamName: "",
//     teamType: "",
//     state: "",
//     mobileNumber: "",
//     email: "",
//     checkIn: "",
//     checkOut: "",
//     stayDuration: "4",
//     roomType1: 0,
//     roomType2: 0,
//     memberDetails: [],
//     totalPrice: 0,
//     hotelId: id,
//     hotelName: accommodation?.name || "",
//     accommodationType: accommodation?.type || "hostel" // Default to hostel
//   });

//   // Determine room types based on accommodation type
//   const roomTypes = useMemo(() => {
//     return formData.accommodationType === "hostel" 
//       ? { 
//           type1: "triple-sharing-Rooms", 
//           label1: "Triple Sharing (3 persons max)",
//           type2: "quad-sharing-Rooms",
//           label2: "Quad Sharing (4 persons max)"
//         }
//       : { 
//           type1: "double-sharing-Rooms", 
//           label1: "Double Sharing (2 persons max)",
//           type2: "triple-sharing-Rooms",
//           label2: "Triple Sharing (3 persons max)"
//         };
//   }, [formData.accommodationType]);

//   const teamTypeDates = useMemo(() => ({
//     MAG: { 
//       4: { checkIn: "2025-04-24", checkOut: "2025-04-27" },
//       5: { checkIn: "2025-04-24", checkOut: "2025-04-28" }
//     },
//     WAG: { 
//       4: { checkIn: "2025-04-29", checkOut: "2025-05-02" },
//       5: { checkIn: "2025-04-29", checkOut: "2025-05-03" }
//     },
//   }), []);

//   // Calculate price options based on accommodation data
//   const priceOptions = useMemo(() => {
//     if (!accommodation) return {};
    
//     if (formData.accommodationType === "hostel") {
//       return {
//         type1_4: accommodation.priceOptions.find(opt => opt.nights === 4 && opt.persons === 3)?.price || 0,
//         type1_5: accommodation.priceOptions.find(opt => opt.nights === 5 && opt.persons === 3)?.price || 0,
//         type2_4: accommodation.priceOptions.find(opt => opt.nights === 4 && opt.persons === 4)?.price || 0,
//         type2_5: accommodation.priceOptions.find(opt => opt.nights === 5 && opt.persons === 4)?.price || 0,
//       };
//     } else {
//       return {
//         type1_4: accommodation.priceOptions.find(opt => opt.nights === 4 && opt.persons === 2)?.price || 0,
//         type1_5: accommodation.priceOptions.find(opt => opt.nights === 5 && opt.persons === 2)?.price || 0,
//         type2_4: accommodation.priceOptions.find(opt => opt.nights === 4 && opt.persons === 3)?.price || 0,
//         type2_5: accommodation.priceOptions.find(opt => opt.nights === 5 && opt.persons === 3)?.price || 0,
//       };
//     }
//   }, [accommodation, formData.accommodationType]);

//   // Update check-in/check-out dates when team type or duration changes
//   useEffect(() => {
//     if (formData.teamType && formData.stayDuration) {
//       const dates = teamTypeDates[formData.teamType][formData.stayDuration];
//       setFormData(prev => ({
//         ...prev,
//         checkIn: dates.checkIn,
//         checkOut: dates.checkOut,
//       }));
//     }
//   }, [formData.teamType, formData.stayDuration, teamTypeDates]);

//   // Calculate total price when room selections or duration changes
//   useEffect(() => {
//     if (!accommodation) return;
    
//     const nights = formData.stayDuration;
//     const type1Price = nights === "4" ? priceOptions.type1_4 : priceOptions.type1_5;
//     const type2Price = nights === "4" ? priceOptions.type2_4 : priceOptions.type2_5;
    
//     const total = (formData.roomType1 * type1Price) + (formData.roomType2 * type2Price);
    
//     setFormData(prev => ({
//       ...prev,
//       totalPrice: total
//     }));
//   }, [formData.roomType1, formData.roomType2, formData.stayDuration, priceOptions,accommodation]);

//   // Update member details when room selections change
//   useEffect(() => {
//     const personsPerType1 = formData.accommodationType === "hostel" ? 3 : 2;
//     const personsPerType2 = formData.accommodationType === "hostel" ? 4 : 3;
    
//     const totalMembers = (formData.roomType1 * personsPerType1) + (formData.roomType2 * personsPerType2);
//     const currentMembers = formData.memberDetails.length;
    
//     if (totalMembers > currentMembers) {
//       // Add new empty member slots
//       const newMembers = Array(totalMembers - currentMembers).fill({ name: "", gender: "" });
//       setFormData(prev => ({
//         ...prev,
//         memberDetails: [...prev.memberDetails, ...newMembers]
//       }));
//     } else if (totalMembers < currentMembers) {
//       // Remove extra member slots
//       setFormData(prev => ({
//         ...prev,
//         memberDetails: prev.memberDetails.slice(0, totalMembers)
//       }));
//     }
//   }, [formData.roomType1, formData.roomType2, formData.accommodationType, formData.memberDetails.length]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const indianStates = State.getStatesOfCountry("IN").map(state => ({
//     value: state.isoCode,
//     label: state.name,
//   }));

//   const handleRoomChange = (roomType, value) => {
//     const numValue = parseInt(value) || 0;
//     const otherRoomType = roomType === "roomType1" ? "roomType2" : "roomType1";
    
//     // Calculate maximum allowed value for this room type (6 - other room type selection)
//     const maxAllowed = 6 - formData[otherRoomType];
    
//     if (numValue > maxAllowed) {
//       alert(`You can book maximum 6 rooms in total. You've already selected ${formData[otherRoomType]} of the other type.`);
//       return;
//     }
    
//     setFormData(prev => ({
//       ...prev,
//       [roomType]: numValue
//     }));
//   };

//   const getMaxSelectable = (currentRoomType) => {
//     const otherRoomType = currentRoomType === "roomType1" ? "roomType2" : "roomType1";
//     return 6 - formData[otherRoomType];
//   };

//   const handleMemberDetailChange = (index, field, value) => {
//     const updatedMembers = [...formData.memberDetails];
//     updatedMembers[index] = {
//       ...updatedMembers[index],
//       [field]: value
//     };
//     setFormData(prev => ({ ...prev, memberDetails: updatedMembers }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Validate all member details are filled
//     const incompleteMember = formData.memberDetails.some(member => 
//       !member.name || !member.gender
//     );
    
//     if (incompleteMember) {
//       alert("Please fill all member details");
//       return;
//     }
  
//     try {
//       const response = await fetch("http://localhost:8888/api/bookings", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...formData,
//           hotelId: id,
//           hotelName: accommodation?.name,
//           accommodationType: accommodation?.type,
//           roomDetails: {
//             [roomTypes.type1]: formData.roomType1,
//             [roomTypes.type2]: formData.roomType2
//           },
//           totalMembers: (formData.roomType1 * (formData.accommodationType === "hostel" ? 3 : 2)) + 
//                        (formData.roomType2 * (formData.accommodationType === "hostel" ? 4 : 3)),
//           totalRooms: formData.roomType1 + formData.roomType2
//         })
//       });
  
//       const data = await response.json();
      
//       if (data.success) {
//         // Update room availability in the backend
//         // await fetch(`http://localhost:8888/api/accommodations/${id}/update-rooms`, {
//         //   method: "PUT",
//         //   headers: { "Content-Type": "application/json" },
//         //   body: JSON.stringify({
//         //     roomsBooked: formData.roomType1 + formData.roomType2
//         //   })
//         // });
  
//         let checkoutOptions = {
//           paymentSessionId: data.sessionId,
//           returnUrl: `${window.location.origin}/booking-status?order_id=${data.order_id}`,
//           redirectTarget: "_self"
//         };
        
//         cashfree.checkout(checkoutOptions);
//       } else {
//         throw new Error(data.message || "Payment initialization failed");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert(error.message || "Payment processing failed");
//     }
//   };

//   // Calculate total members and rooms
//   const personsPerType1 = formData.accommodationType === "hostel" ? 3 : 2;
//   const personsPerType2 = formData.accommodationType === "hostel" ? 4 : 3;
//   const totalMembers = (formData.roomType1 * personsPerType1) + (formData.roomType2 * personsPerType2);
//   const totalRooms = formData.roomType1 + formData.roomType2;

//   return (
//     <div className="main-c">
//       <div>
//       </div>
//       <div className="booking-container">
//         <div className="booking-header">
//           <h2>Book Your Stay at <br/> <span style={{fontSize:"20px", color:"green"}}>{accommodation?.name}</span></h2>
//           <p className="room-type">Available Rooms: {accommodation?.availableRooms}</p>
//           <p className="accommodation-type">Type: {formData.accommodationType === "hostel" ? "Hostel" : "Hotel"}</p>
//         </div>
        
//         <form onSubmit={handleSubmit} className="booking-form">
//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="name">Full Name</label>
//               <input 
//                 type="text" 
//                 id="name" 
//                 name="name" 
//                 placeholder="Enter your full name" 
//                 value={formData.name} 
//                 onChange={handleChange} 
//                 required 
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="teamName">Team Name</label>
//               <input 
//                 type="text" 
//                 id="teamName" 
//                 name="teamName" 
//                 placeholder="Enter your team name" 
//                 value={formData.teamName} 
//                 onChange={handleChange} 
//                 required 
//               />
//             </div>
//           </div>

//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="teamType">Team Type</label>
//               <select 
//                 id="teamType" 
//                 name="teamType" 
//                 value={formData.teamType} 
//                 onChange={handleChange} 
//                 required
//               >
//                 <option value="">Select Team Type</option>
//                 <option value="MAG">MAG (24/04 - 28/04)</option>
//                 <option value="WAG">WAG (29/04 - 03/05)</option>
//               </select>
//             </div>

//             <div className="form-group">
//               <label htmlFor="state">State</label>
//               <Select
//                 id="state"
//                 options={indianStates}
//                 name="state"
//                 value={indianStates.find((s) => s.value === formData.state)}
//                 onChange={(selectedOption) =>
//                   setFormData((prev) => ({ ...prev, state: selectedOption.value }))
//                 }
//                 placeholder="Select your state"
//                 required
//               />
//             </div>
//           </div>

//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="mobileNumber">Mobile Number</label>
//               <input 
//                 type="tel" 
//                 id="mobileNumber" 
//                 name="mobileNumber" 
//                 placeholder="Enter 10-digit mobile number" 
//                 value={formData.mobileNumber} 
//                 onChange={handleChange} 
//                 required 
//                 minLength="10"
//                 maxLength="10"
//                 pattern="[0-9]{10}"
//               />
//               <small className="input-hint">10 digits required</small>
//             </div>

//             <div className="form-group">
//               <label htmlFor="email">Email Address</label>
//               <input 
//                 type="email" 
//                 id="email" 
//                 name="email" 
//                 placeholder="Enter your email" 
//                 value={formData.email} 
//                 onChange={handleChange} 
//                 required 
//               />
//             </div>
//           </div>

//           <div className="form-group">
//             <label htmlFor="stayDuration">Stay Duration</label>
//             <div className="duration-options">
//               <label className="duration-option">
//                 <input 
//                   type="radio" 
//                   name="stayDuration" 
//                   value="4" 
//                   checked={formData.stayDuration === "4"}
//                   onChange={handleChange}
//                   required
//                 />
//                 <span>4 Nights</span>
//               </label>
//               <label className="duration-option">
//                 <input 
//                   type="radio" 
//                   name="stayDuration" 
//                   value="5" 
//                   checked={formData.stayDuration === "5"}
//                   onChange={handleChange}
//                 />
//                 <span>5 Nights</span>
//               </label>
//             </div>
//           </div>

//           <div className="date-display">
//             <div className="date-item">
//               <span className="date-label">Check-in:</span>
//               <span className="date-value">{formData.checkIn}</span>
//             </div>
//             <div className="date-item">
//               <span className="date-label">Check-out:</span>
//               <span className="date-value">{formData.checkOut}</span>
//             </div>
//           </div>

//           {/* Hidden date inputs for form submission */}
//           <input type="hidden" name="checkIn" value={formData.checkIn} />
//           <input type="hidden" name="checkOut" value={formData.checkOut} />

//           <div className="room-selection-section">
//             <h3>Select Your Rooms</h3>
            
//             <div className="room-options">
//               <div className="room-type-option">
//                 <h4>{roomTypes.label1}</h4>
//                 <p className="price-info">
//                   {formData.stayDuration === "4" 
//                     ? `₹${priceOptions.type1_4?.toLocaleString()} per room` 
//                     : `₹${priceOptions.type1_5?.toLocaleString()} per room`}
//                 </p>
//                 <div className="room-quantity">
//                   <label>Quantity:</label>
//                   <select
//                     value={formData.roomType1}
//                     onChange={(e) => handleRoomChange("roomType1", e.target.value)}
//                   >
//                     {[...Array(getMaxSelectable("roomType1") + 1).keys()].map(n => (
//                       <option key={n} value={n}>{n}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="room-type-option">
//                 <h4>{roomTypes.label2}</h4>
//                 <p className="price-info">
//                   {formData.stayDuration === "4" 
//                     ? `₹${priceOptions.type2_4?.toLocaleString()} per room` 
//                     : `₹${priceOptions.type2_5?.toLocaleString()} per room`}
//                 </p>
//                 <div className="room-quantity">
//                   <label>Quantity:</label>
//                   <select
//                     value={formData.roomType2}
//                     onChange={(e) => handleRoomChange("roomType2", e.target.value)}
//                   >
//                     {[...Array(getMaxSelectable("roomType2") + 1).keys()].map(n => (
//                       <option key={n} value={n}>{n}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>

//             <div className="room-summary">
//               <p>Total Rooms: {totalRooms}</p>
//               <p>Total Members: {totalMembers}</p>
//             </div>
//           </div>

//           {/* Member details */}
//           {totalMembers > 0 && (
//             <div className="member-details-section">
//               <h3>Member Details ({totalMembers})</h3>
//               <div className="member-grid">
//                 {formData.memberDetails.map((member, index) => (
//                   <div key={index} className="member-form-group">
//                     <h4>Member {index + 1}</h4>
//                     <div className="form-group">
//                       <label htmlFor={`member-name-${index}`}>Full Name</label>
//                       <input 
//                         type="text" 
//                         id={`member-name-${index}`}
//                         placeholder={`Enter member ${index + 1} name`} 
//                         value={member.name} 
//                         onChange={(e) => handleMemberDetailChange(index, "name", e.target.value)} 
//                         required 
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label htmlFor={`member-gender-${index}`}>Gender</label>
//                       <select 
//                         id={`member-gender-${index}`}
//                         value={member.gender} 
//                         onChange={(e) => handleMemberDetailChange(index, "gender", e.target.value)} 
//                         required
//                       >
//                         <option value="">Select Gender</option>
//                         <option value="Male">Male</option>
//                         <option value="Female">Female</option>
//                       </select>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           <div className="price-summary">
//             <h3>Booking Summary</h3>
//             <div className="price-details">
//               {formData.roomType1 > 0 && (
//                 <p>
//                   {roomTypes.label1}: {formData.roomType1} × 
//                   ₹{formData.stayDuration === "4" 
//                     ? priceOptions.type1_4?.toLocaleString() 
//                     : priceOptions.type1_5?.toLocaleString()} = 
//                   ₹{(formData.roomType1 * 
//                     (formData.stayDuration === "4" ? priceOptions.type1_4 : priceOptions.type1_5))
//                     .toLocaleString()}
//                 </p>
//               )}
//               {formData.roomType2 > 0 && (
//                 <p>
//                   {roomTypes.label2}: {formData.roomType2} × 
//                   ₹{formData.stayDuration === "4" 
//                     ? priceOptions.type2_4?.toLocaleString() 
//                     : priceOptions.type2_5?.toLocaleString()} = 
//                   ₹{(formData.roomType2 * 
//                     (formData.stayDuration === "4" ? priceOptions.type2_4 : priceOptions.type2_5))
//                     .toLocaleString()}
//                 </p>
//               )}
//               <p className="total-amount">Total Amount: ₹{formData.totalPrice.toLocaleString()}</p>
//             </div>
//           </div>

//           <button 
//             type="submit" 
//             className="submit-button"
//             disabled={totalRooms === 0 || !formData.teamType}
//           >
//             Proceed to Pay
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default BookingForm;