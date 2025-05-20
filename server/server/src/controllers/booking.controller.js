// Create a new booking
router.post('/api/bookings', async (req, res) => {
    try {
      const { userId, freelancerId, gigId, selectedDateTime } = req.body;
  
      // Check if the slot is already booked
      const existing = await Booking.findOne({
        freelancerId,
        selectedDateTime,
      });
  
      if (existing) {
        return res.status(400).json({ message: "Time slot already booked!" });
      }
  
      const booking = new Booking({
        userId,
        freelancerId,
        gigId,
        selectedDateTime,
        status: "confirmed",
      });
  
      await booking.save();
      res.status(201).json({ message: "Booking confirmed", booking });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  });
  

  // Get booked dates for a freelancer
router.get('/api/bookings/bookedDates/:freelancerId', async (req, res) => {
    try {
      const bookings = await Booking.find({ freelancerId: req.params.freelancerId });
      const bookedDates = bookings.map(b => b.selectedDateTime);
      res.status(200).json({ bookedDates });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  });
  
  