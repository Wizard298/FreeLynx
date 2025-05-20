import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import "./Booking.scss";

const Booking = ({ userId, freelancerId, gigId }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookedDates, setBookedDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // (Optional) Fetch already booked dates for this freelancer
    const fetchBookedDates = async () => {
      try {
        const res = await axios.get(
          `/api/bookings/bookedDates/${freelancerId}`
        );
        setBookedDates(
          res.data.bookedDates.map((dateStr) => new Date(dateStr))
        );
      } catch (error) {
        console.error("Failed to load booked dates");
      }
    };

    fetchBookedDates();
  }, [freelancerId]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleBooking = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("/api/bookings", {
        userId,
        freelancerId,
        gigId,
        selectedDateTime: selectedDate,
      });

      if (response.status === 201 || response.status === 200) {
        setMessage("🎉 Booking Confirmed!");
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data.message) {
        setMessage(`❌ ${error.response.data.message}`);
      } else {
        setMessage("❌ Booking Failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="booking-form"
      style={{
        padding: "20px",
        border: "1px solid #eee",
        borderRadius: "12px",
        maxWidth: "400px",
      }}
    >
      <h2 className="text-xl font-bold mb-4">Book our Service</h2>

      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        showTimeSelect
        timeIntervals={30} // Allow booking every 30 mins
        excludeDates={bookedDates}
        minDate={new Date()} // Cannot book in the past
        dateFormat="MMMM d, yyyy h:mm aa"
        className="border p-2 rounded w-full"
      />

      <button
        onClick={handleBooking}
        disabled={loading}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Booking..." : "Book Now"}
      </button>

      {message && <p className="mt-3 text-center">{message}</p>}
    </div>
  );
};

export default Booking;
