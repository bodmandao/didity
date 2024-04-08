// Importing Principal from the DFINITY library for working with principals
import { Principal } from "@dfinity/principal";

// Importing the function for transferring ICP from the ledger (assuming it's defined elsewhere)
import { transferICP } from "./ledger";

// Function to book appointment
export async function bookAppointment(appointmentId,customerId) {
  return window.canister.marketplace.bookAppointment(appointmentId,customerId);
}

// Function to get customer bookings
export async function getCustomerBookings(customerId) {
  try {
    return await window.canister.marketplace.getCustomerBookings(customerId);
  } catch (err) {
    // Log error if fetching customer bookings fails
    console.error("Error fetching customer bookings:", err);
    return null; // Return null to indicate error
  }
}

// Function to get all appointments 
export async function getAvailableAppointments() {
  try {
    return await window.canister.marketplace.getAvailableAppointments();
  } catch (err) {
    // Log error if fetching appointments fails
    console.error("Error fetching appointments :", err);
    return null; // Return null to indicate error
  }
}

// Function to cancel a booking
export async function cancelBooking(bookingId) {
  try {
    return await window.canister.marketplace.cancelBooking(bookingId);
  } catch (err) {
    // Log error if cancelling booking fails
    console.error("Error cancelling booking:", err);
    return []; // Return empty array to indicate error
  }
}

// Function to create appoinment
export async function createAppointment(title,description,date,duration) {
  try {
    return await window.canister.marketplace.createAppointment(title,description,date,duration);
  } catch (err) {
    // Log error if creating appoinment fails
    console.error("Error fetching cash transactions:", err);
    return []; // Return empty array to indicate error
  }
}

// Function to update appointment
export async function updateAppointment(appointmentId, title, description, date, duration) {
  try {
    return await window.canister.marketplace.updateAppointment(appointmentId, title, description, date, duration);
  } catch (err) {
    // Log error if updating appointment fails
    console.error("Error updating appoinment:", err);
    return []; // Return empty array to indicate error
  }
}

// Function to get appoinment by ID
export async function getAppointmentById(appointmentId) {
  try {
    return await window.canister.marketplace.getAppointmentById(appointmentId);
  } catch (err) {
    // Log error if fetching appointment fails
    console.error("Error fetching appoinment:", err);
    return []; // Return empty array to indicate error
  }
}

// Function to register a customer
export async function registerCustomer(name, email, phoneNumber) {
  return window.canister.marketplace.registerCustomer(name, email, phoneNumber);
}

// Function to get customer by ID
export async function getCustomerById(bookingId) {
  try {
    return await window.canister.marketplace.getCustomerById(bookingId);
  } catch (err) {
    // Log error if fetching customer fails
    console.error("Error fetching customer:", err);
    return []; // Return empty array to indicate error
  }
}

// Function to get booking by ID
export async function getBookingById(bookingId) {
  try {
    return await window.canister.marketplace.getBookingById(bookingId);
  } catch (err) {
    // Log error if fetching booking fails
    console.error("Error fetching booking:", err);
    return []; // Return empty array to indicate error
  }
}

