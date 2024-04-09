import { query, update, text, Record,Variant,Err, Result,StableBTreeMap, Vec,Ok, Principal, nat64, bool, Canister } from "azle";
import { hashCode } from "hashcode";
import { v4 as uuidv4 } from "uuid";

// Define the constructs for Booking, Appointment, and Customer with improved names
const BookingRecord = Record({
    bookingId: text, // Use bookingId instead of id for clarity
    customerId: text,
    appointmentId: text,
    bookingStatus: text, // Use bookingStatus instead of status for clarity
    createdAt: nat64,
    updatedAt: nat64,
  });
  
  const AppointmentRecord = Record({
    appointmentId: text,
    title: text,
    description: text,
    date: nat64,
    duration: nat64,
    isAvailable: bool, // Use isAvailable instead of available for clarity
    createdAt: nat64,
    updatedAt: nat64,
  });
  
  const CustomerRecord = Record({
    customerId: text,
    name: text,
    email: text,
    phoneNumber: text,
    createdAt: nat64,
    updatedAt: nat64,
  });
  
  // Define message variants for error handling and responses with better naming
  const ErrorMessage = Variant({
    ResourceNotFound: text, // Use ResourceNotFound for consistency
    InvalidInput: text,
    UnauthorizedAccess: text, // Use UnauthorizedAccess for clarity
    DatabaseError: text,
  });
  
  // Define the data storage locations for bookings, appointments, and customers with better naming
  const bookingStore = StableBTreeMap(0, text, BookingRecord);
  const appointmentStore = StableBTreeMap(1, text, AppointmentRecord);
  const customerStore = StableBTreeMap(2, text, CustomerRecord);
  
// Create an instance of the booking system canister
export default Canister({

  // Get all available appointments for booking
  getAllAvailableAppointments: query([], Vec(AppointmentRecord), () => {
    const appointments = appointmentStore.values();
    return appointments.filter((appointment) => appointment.isAvailable);
  }),

     // Book an appointment with security and validation
  bookAppointment: update(
    [text, text],
    Result(text, ErrorMessage),
    (appointmentId, customerId) => {
      const appointment = appointmentStore.get(appointmentId);
      if (!appointment || !appointment.Some.isAvailable) {
        return Err({
          ResourceNotFound: `Appointment with ID ${appointmentId} is not available.`,
        });
      }

      // Validate customer ID (example)
      if (!isValidCustomerId(customerId)) {
        return Err({ InvalidInput: "Invalid customer ID format." });
      }

      const existingBooking = bookingStore.get(appointmentId);
      if (existingBooking) {
          return Err({ ResourceNotFound: `Appointment with ID ${appointmentId} is already booked.` });
      }

      const customer = customerStore.get(customerId);
      if (!customer) {
        return Err({ ResourceNotFound: `Customer with ID ${customerId} does not exist.` });
      }

      const booking = {
        bookingId: uuidv4(), // Use secure random ID generation
        customerId: customerId,
        appointmentId: appointmentId,
        bookingStatus: "Booked",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      bookingStore.insert(booking.bookingId, booking);
      appointment.Some.isAvailable = false;
      appointmentStore.insert(appointmentId, appointment);

      return Ok(`Booked appointment with ID ${booking.bookingId}`);
    }
  ),
     // Get all bookings for a customer
    getCustomerBookings: query([text], Vec(BookingRecord), (customerId) => {
        const bookings = bookingStore.values();
        return bookings.filter((booking) => booking.customerId === customerId);
    }),

  // Cancel a booking
  cancelBooking: update([text], Result(text, ErrorMessage), (bookingId) => {
    const booking = bookingStore.get(bookingId);
    if (!booking) {
      return Err({ ResourceNotFound: `Booking with ID ${bookingId} does not exist.` });
    }

    const appointment = appointmentStore.get(booking.Some.appointmentId);
    if (!appointment) {
      return Err({
        ResourceNotFound: `Appointment for booking with ID ${bookingId} does not exist.`,
      });
    }
        const updatedBooking = { ...booking }; // Avoid modifying original object

        updatedBooking.Some.bookingStatus = "Cancelled";
        updatedBooking.Some.updatedAt = Date.now();

        bookingStore.insert(updatedBooking.Some.bookingId, updatedBooking);
        appointment.Some.Available = true;
        appointmentStore.insert(updatedBooking.Some.appointmentId, appointment);

        return Ok(`Booking with ID ${bookingId} cancelled.`);
  }),

    // Create a new appointment (consider adding authorization)
  createAppointment: update(
    [text, text, nat64, nat64],
    Result(text, ErrorMessage),
    (title, description, date, duration) => {
      const appointment = {
        appointmentId: uuidv4(), // Use secure random ID generation
        title: title,
        description: description,
        date: date,
        duration: duration,
        isAvailable: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      appointmentStore.insert(appointment.appointmentId, appointment);
      return Ok(`Created appointment with ID ${appointment.appointmentId}`);
    }
  ),

   
  // Register a new customer (consider adding authorization)
  registerCustomer: update(
    [text, text, text],
    Result(text, ErrorMessage),
    (name, email, phoneNumber) => {
      const customer = {
        customerId: uuidv4(), // Use secure random ID generation
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      customerStore.insert(customer.customerId, customer);
      return Ok(`Registered customer with ID ${customer.customerId}`);
    }
  ),

     // Update appointment details (consider adding authorization)
  updateAppointment: update(
    [text, text, text, nat64, nat64],
    Result(text, ErrorMessage),
    (appointmentId, title, description, date, duration) => {
      const appointmentOpt = appointmentStore.get(appointmentId);
      if (!appointmentOpt) {
        return Err({ ResourceNotFound: `Appointment with ID ${appointmentId} does not exist.` });
      }

      const appointment = appointmentOpt.Some
      appointment.title = title;
      appointment.description = description;
      appointment.date = date;
      appointment.duration = duration;
      appointment.updatedAt = Date.now();

      appointmentStore.insert(appointmentId, appointment);
      return Ok(`Updated appointment with ID ${appointmentId}`);
    }
  ),

    // Get details of a single appointment by ID
  getAppointmentById: query([text], Result(AppointmentRecord, ErrorMessage), (appointmentId) => {
    const appointment = appointmentStore.get(appointmentId).Some;
    return appointment ? Ok(appointment) : Err({ ResourceNotFound: `Appointment with ID ${appointmentId} not found.` });
  }),

  // Get details of a single customer by ID 
  getCustomerById: query([text], Result(CustomerRecord, ErrorMessage), (customerId) => {
    const customer = customerStore.get(customerId).Some;
    return customer ? Ok(customer) : Err({ ResourceNotFound: `Customer with ID ${customerId} not found.` });
  }),

  // Get details of a single customer by Email (consider adding authorization)
  getCustomerByEmail: query([text], Result(CustomerRecord, ErrorMessage), (email) => {
    const customers = customerStore.values();
    const customer = customers.find((customer) => customer.email === email);
    return customer ? Ok(customer) : Err({ ResourceNotFound: `Customer with email ${email} not found.` });
  }),

  // Get details of a single booking by ID
  getBookingById: query([text], Result(BookingRecord, ErrorMessage), (bookingId) => {
    const booking = bookingStore.get(bookingId).Some;
    return booking ? Ok(booking) : Err({ ResourceNotFound: `Booking with ID ${bookingId} not found.` });
  }),

});

function isValidCustomerId(customerId :string) {
    const regex = /^[a-zA-Z0-9]{8,16}$/; // Example: Allow alphanumeric characters, length 8-16
    return regex.test(customerId);
  }
    // a workaround to make uuid package work with Azle
globalThis.crypto = {
    // @ts-ignore
    getRandomValues: () => {
        let array = new Uint8Array(32);

        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }
        return array;
    }
};
