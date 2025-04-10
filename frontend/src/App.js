import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import Layout from "./Layout/Layout.js";


//? MAIN PORTAL PAGE
import BookingPortal from "./pages/BookingPortal/BookingPortal.js";
import Admin from "./pages/Admin/Admin.js";

//? MAG_WAG BOOKING
import Home from "./components/MAG_WAG_booking_compnents/Home/Home.jsx";
import BookingForm from "./components/MAG_WAG_booking_compnents/BookingForm/BookingForm.js";
import BookingStatus from "./components/MAG_WAG_booking_compnents/BookingStatus/BookingStatus.js";
import Failure from "./components/MAG_WAG_booking_compnents/Failure/Failuer.js";
import TermsAndConditions from "./components/TermsAndConditions/TermsAndConditions.js";
import ContactUs from "./components/ContactForm/ContactUs.js";

//? NOMINATIVE BOOKING
import NominativeForm from "./components/Nominative-booking-components/NominativeForm/NominativeForm.js";
import NominativeSuccess from "./components/Nominative-booking-components/Success/NominativeSuccess.js";
import NominativeFailure from "./components/Nominative-booking-components/Failuer/NominativeFailure.js";


//? INTERNATIONAL ATHLETE BOOKING
import InternationalAthleteSuccess from "./components/InternationalAthleat_components/success/InternationalAthleteSuccess.js";
import InternationalAthleteFailure from "./components/InternationalAthleat_components/failure/InternationalAthleteFailure.js";
import InternationalHome from "./components/InternationalAthleat_components/InternationalHome/InternationalHome.js";
import InternationalAthleteForm from "./components/InternationalAthleat_components/InternationalAthleteForm/InternationalAthleteForm.js";

//? EXCEL EXPORT DATA
import ExportBookings from "./components/ExcleExport/ExportBookings.js";

import ExportInternationalAthletes from "./components/ExcleExport/ExportInternationalAthletes.js";





const App = () => {
  return (
    <Router>
    <Routes>
      {/* MAIN PORTAL PAGE */}
      <Route path="/" element={<Layout><BookingPortal /></Layout>} />
      <Route path="/admin" element={<Layout><Admin /></Layout>} />


      {/* COMMONS COMPONENTS ROUTES */}
      <Route path="/terms" element={<Layout><TermsAndConditions /></Layout>} />
      <Route path="/contact" element={<Layout><ContactUs /></Layout>} />

       {/* EXPORT EXCEL DATA */}
      <Route path="/export-bookings" element={<Layout><ExportBookings /></Layout>} />
      <Route path="/export-bookings-int" element={<Layout><ExportInternationalAthletes /></Layout>} />
      

      {/* MAG_WAG BOOKING ROUTES */}
      <Route path="/mag-wag-booking" element={<Layout><Home /></Layout>} />
      <Route path="/booking/:id" element={<Layout><BookingForm /></Layout>} />
      <Route path="/failure" element={<Layout><Failure /></Layout>} />
      <Route path="/success" element={<Layout><BookingStatus /></Layout>} />

      {/* NOMINATIVE BOOKING ROUTES */}
      <Route path="/nominative-booking" element={<Layout><NominativeForm /></Layout>} />
      <Route path="/nominative-success" element={<Layout><NominativeSuccess /></Layout>} />
      <Route path="/nominative-failure" element={<Layout><NominativeFailure /></Layout>} />

      {/* INTERNATIONAL ATHLETE BOOKING ROUTES */}
      <Route path="/international-athlete-booking" element={<Layout><InternationalHome /></Layout>} />
      <Route path="/international-athlete-booking/:id" element={<Layout><InternationalAthleteForm /></Layout>} />
      <Route path="/international-athlete-success" element={<Layout><InternationalAthleteSuccess /></Layout>} />
      <Route path="/international-athlete-failure" element={<Layout><InternationalAthleteFailure /></Layout>} />
    </Routes>
  </Router>
  );
};

export default App;
