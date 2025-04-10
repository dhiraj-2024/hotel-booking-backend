import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { State } from "country-state-city";
import "../../MAG_WAG_booking_compnents/BookingForm/BookingForm.css";
import { cashfree } from "../../MAG_WAG_booking_compnents/BookingForm/utils/utils.cashfree.js";

const InternationalAthleteForm = () => {
  const { state } = useLocation();
  const { hotel } = state || {};
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    email: "",
    teamType: "",
    state: "",
    checkIn: "",
    checkOut: "",
    stayDuration: "4",
    totalPrice: 0,
    hotelId: id,
    hotelName: hotel?.name || "",
    accommodationType: "hotel",
    bookingType: "international"
  });

  const [validationErrors, setValidationErrors] = useState({
    mobileNumber: false,
    email: false
  });

  // Mobile validation
  const validateMobile = (number) => {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(number);
  };

  // Email validation
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

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

  // Calculate total price based on stay duration
  useEffect(() => {
    const price = formData.stayDuration === "4" ? 100 : 200;
    setFormData(prev => ({
      ...prev,
      totalPrice: price
    }));
  }, [formData.stayDuration]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validate fields in real-time
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

  // Get Indian states for dropdown
 
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
   
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    if (!validateMobile(formData.mobileNumber)) {
      alert("Please enter a valid 10-digit Indian mobile number");
      return;
    }
    
    if (!validateEmail(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }
    
    if (!formData.state) {
      alert("Please select your state");
      return;
    }

    try {
      const payload = {
        name: formData.name, 
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        teamType: formData.teamType,
        state: formData.state,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        stayDuration: formData.stayDuration,
        totalPrice: formData.totalPrice,
        hotelId: formData.hotelId,
        hotelName: formData.hotelName
      };

      const response = await fetch("http://localhost:8888/api/international-athletes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Payment initialization failed");
      }

      if (data.success) {
        let checkoutOptions = {
          paymentSessionId: data.sessionId,
          returnUrl: `${window.location.origin}/international-athlete-success?order_id=${data.order_id}`,
          redirectTarget: "_self"
        };
        
        cashfree.checkout(checkoutOptions);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Payment processing failed");
    }
  };

  return (
    <div className="main-c">
      <div className="booking-container">
        <div className="booking-header">
          <h2>International Athlete Booking at <br/> 
            <span style={{fontSize:"20px", color:"green"}}>{hotel?.name}</span>
          </h2>
          {/* <p className="note">Fixed pricing for international athletes</p> */}
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
          </div>

          <div className="form-row">
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
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="state">State</label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              >
                <option value="">Select State</option>
                {indianStates.map(state => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </select>
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
                <span>4 Nights (₹100)</span>
              </label>
              <label className="duration-option">
                <input 
                  type="radio" 
                  name="stayDuration" 
                  value="5" 
                  checked={formData.stayDuration === "5"}
                  onChange={handleChange}
                />
                <span>5 Nights (₹200)</span>
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

          <div className="price-summary">
            <h3>Booking Summary</h3>
            <div className="price-details">
              <p>Selected Duration: {formData.stayDuration} Nights</p>
              <p className="total-amount">Total Amount: ₹{formData.totalPrice.toLocaleString()}</p>
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={!formData.teamType}
          >
            Proceed to Pay
          </button>
        </form>
      </div>
    </div>
  );
};

export default InternationalAthleteForm;








// import React, { useState, useEffect, useMemo } from "react";
// import { useLocation, useParams } from "react-router-dom";
// import "../../MAG_WAG_booking_compnents/BookingForm/BookingForm.css";
// import { cashfree } from "../../MAG_WAG_booking_compnents/BookingForm/utils/utils.cashfree.js";

// const InternationalAthleteForm = () => {
//   const { state } = useLocation();
//   const { hotel } = state || {};
//   const { id } = useParams();
//   // console.log(hotel);
//   const [formData, setFormData] = useState({
//     name: "",
//     mobileNumber: "",
//     email: "",
//     teamType: "",
//     checkIn: "",
//     checkOut: "",
//     stayDuration: "4",
//     doubleRooms: 0,
//     tripleRooms: 0,
//     memberDetails: [],
//     totalPrice: 0,
//     hotelId: id,
//     hotelName: hotel?.name || "",
//     accommodationType: "hotel",
//     bookingType: "international"
//   });

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

//   // Fixed pricing for international athletes
//   const priceOptions = useMemo(() => ({
//     double4: 100,
//     double5: 200,
//     triple4: 100,
//     triple5: 200
//   }), []);

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
//     const nights = formData.stayDuration;
//     const doublePrice = nights === "4" ? priceOptions.double4 : priceOptions.double5;
//     const triplePrice = nights === "4" ? priceOptions.triple4 : priceOptions.triple5;
    
//     const total = (formData.doubleRooms * doublePrice * 2) + (formData.tripleRooms * triplePrice * 3);
    
//     setFormData(prev => ({
//       ...prev,
//       totalPrice: total
//     }));
//   }, [formData.doubleRooms, formData.tripleRooms, formData.stayDuration, priceOptions]);

//   // Update member details when room selections change
//   useEffect(() => {
//     const totalMembers = (formData.doubleRooms * 2) + (formData.tripleRooms * 3);
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
//   }, [formData.doubleRooms, formData.tripleRooms, formData.memberDetails.length]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleRoomChange = (roomType, value) => {
//     const numValue = parseInt(value) || 0;
    
//     // Validate maximum 6 rooms total
//     const otherRoomType = roomType === "doubleRooms" ? "tripleRooms" : "doubleRooms";
//     const totalRooms = numValue + formData[otherRoomType];
    
//     if (totalRooms > 6) {
//       alert("You can book maximum 6 rooms in total");
//       return;
//     }
    
//     setFormData(prev => ({
//       ...prev,
//       [roomType]: numValue
//     }));
//   };

//   const getMaxSelectable = (currentRoomType) => {
//     const otherRoomType = currentRoomType === "doubleRooms" ? "tripleRooms" : "doubleRooms";
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
//       const payload = {
//         name: formData.name, 
//         mobileNumber: formData.mobileNumber,
//         email: formData.email,
//         teamType: formData.teamType,
//         checkIn: formData.checkIn,
//         checkOut: formData.checkOut,
//         stayDuration: formData.stayDuration,
//         doubleRooms: parseInt(formData.doubleRooms),
//         tripleRooms: parseInt(formData.tripleRooms),
//         memberDetails: formData.memberDetails,
//         totalPrice: parseFloat(formData.totalPrice),
//         totalRooms: parseInt(formData.doubleRooms) + parseInt(formData.tripleRooms),
//         hotelId: formData.hotelId,
//         hotelName: formData.hotelName
//       };
  
//       const response = await fetch("http://localhost:8888/api/international-athletes", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       });
  
//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.message || "Payment initialization failed");
//       }
  
//       if (data.success) {
//         let checkoutOptions = {
//           paymentSessionId: data.sessionId,
//           returnUrl: `${window.location.origin}/international-athlete-success?order_id=${data.order_id}`,
//           redirectTarget: "_self"
//         };
        
//         cashfree.checkout(checkoutOptions);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert(error.message || "Payment processing failed");
//     }
//   };
//   // Calculate total members and rooms
//   const totalMembers = (formData.doubleRooms * 2) + (formData.tripleRooms * 3);
//   const totalRooms = formData.doubleRooms + formData.tripleRooms;

//   return (
//     <div className="main-c">
//       <div>
//       </div>
//       <div className="booking-container">
//         <div className="booking-header">
//           <h2>International Athlete Booking at <br/> <span style={{fontSize:"20px", color:"green"}}>{hotel?.name}</span></h2>
//           <p className="room-type">Available Rooms: {hotel?.availableRooms}</p>
//           <p className="note">Note: Such Persons will be accommodated in Hotel in Twin or Triple Sharing.</p>
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
//           </div>

//           <div className="form-row">
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
//                 <span>4 Nights (₹100 per person)</span>
//               </label>
//               <label className="duration-option">
//                 <input 
//                   type="radio" 
//                   name="stayDuration" 
//                   value="5" 
//                   checked={formData.stayDuration === "5"}
//                   onChange={handleChange}
//                 />
//                 <span>5 Nights (₹200 per person)</span>
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

//           <div className="room-selection-section">
//             <h3>Select Your Rooms</h3>
            
//             <div className="room-options">
//               <div className="room-type-option">
//                 <h4>Double Rooms (2 persons max)</h4>
//                 <p className="price-info">
//                   {formData.stayDuration === "4" 
//                     ? "₹100 per person (₹200 per room)" 
//                     : "₹200 per person (₹400 per room)"}
//                 </p>
//                 <div className="room-quantity">
//                   <label>Quantity:</label>
//                   <select
//                     value={formData.doubleRooms}
//                     onChange={(e) => handleRoomChange("doubleRooms", e.target.value)}
//                   >
//                     {[...Array(getMaxSelectable("doubleRooms") + 1).keys()].map(n => (
//                       <option key={n} value={n}>{n}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="room-type-option">
//                 <h4>Triple Rooms (3 persons max)</h4>
//                 <p className="price-info">
//                   {formData.stayDuration === "4" 
//                     ? "₹100 per person (₹300 per room)" 
//                     : "₹200 per person (₹600 per room)"}
//                 </p>
//                 <div className="room-quantity">
//                   <label>Quantity:</label>
//                   <select
//                     value={formData.tripleRooms}
//                     onChange={(e) => handleRoomChange("tripleRooms", e.target.value)}
//                   >
//                     {[...Array(getMaxSelectable("tripleRooms") + 1).keys()].map(n => (
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
//               {formData.doubleRooms > 0 && (
//                 <p>
//                   Double Rooms: {formData.doubleRooms} × 
//                   {formData.stayDuration === "4" ? "₹200" : "₹400"} = 
//                   ₹{(formData.doubleRooms * (formData.stayDuration === "4" ? 200 : 400)).toLocaleString()}
//                 </p>
//               )}
//               {formData.tripleRooms > 0 && (
//                 <p>
//                   Triple Rooms: {formData.tripleRooms} × 
//                   {formData.stayDuration === "4" ? "₹300" : "₹600"} = 
//                   ₹{(formData.tripleRooms * (formData.stayDuration === "4" ? 300 : 600)).toLocaleString()}
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

// export default InternationalAthleteForm;