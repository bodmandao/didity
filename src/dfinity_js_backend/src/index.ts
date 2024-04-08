import { query, update, text, Record,Variant,Err, Result,StableBTreeMap, Vec,Ok, Principal, nat64, bool, Canister } from "azle";
import { hashCode } from "hashcode";
import { v4 as uuidv4 } from "uuid";

// Define the constructs for Booking, Appointment, and Customer
const Booking = Record({
    id: text,
    customerId: text,
    appointmentId: text,
    status: text,
    createdAt: nat64,
    updatedAt: nat64
});

const Appointment = Record({
    id: text,
    title: text,
    description: text,
    date: nat64,
    duration: nat64,
    available: bool,
    createdAt: nat64,
    updatedAt: nat64
});

const Customer = Record({
    id: text,
    name: text,
    email: text,
    phoneNumber: text,
    createdAt: nat64,
    updatedAt: nat64
});

// Define message variants for error handling and responses
const Message = Variant({
    NotFound: text,
    NotAvailable: text,
});

// Define the data storage locations for bookings, appointments, and customers
const bookingStorage = StableBTreeMap(0, text, Booking);
const appointmentStorage = StableBTreeMap(1, text, Appointment);
const customerStorage = StableBTreeMap(2, text, Customer);

// Create an instance of the booking system canister
export default Canister({

    // Get all appointments available for booking
    getAvailableAppointments: query([], Vec(Appointment), () => {
        const appointments = appointmentStorage.values();
        return appointments.filter(appointment => appointment.available);
    }),

    // Book an appointment
    bookAppointment: update([text, text],Result(text,Message), (appointmentId, customerId) => {
        const appointment = appointmentStorage.get(appointmentId);
        if ("None" in appointment) {
            return Err({NotFound : `Appointment with ID ${appointmentId} not found.`});
        }
        if (!appointment.Some.available) {
            return Err({NotAvailable : `Appointment with ID ${appointmentId} is not available.`});
        }

        const customer = customerStorage.get(customerId);
        if ("None" in customer) {
            return Err({NotFound : `Customer with ID ${customerId} does not exist.`});
        }

        const booking = {
            id: uuidv4(),
            customerId: customerId,
            appointmentId: appointmentId,
            status: "Booked",
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        const updatedAppointment = appointment.Some
        bookingStorage.insert(booking.id, booking);
        appointment.Some.available = false;
        appointmentStorage.insert(updatedAppointment.id, updatedAppointment);

        return Ok(`Booked appointment with ID ${booking.id}`);
    }),

    // Get all bookings for a customer
    getCustomerBookings: query([text], Vec(Booking), (customerId: text) => {
        const bookings = bookingStorage.values();
        return bookings.filter(booking => booking.customerId === customerId);
    }),

    // Cancel a booking
    cancelBooking: update([text], Result(text,Message), (bookingId) => {
        const booking = bookingStorage.get(bookingId);

        if ("None" in booking) {
            return Err({NotFound :`Booking with ID ${bookingId} does not exist.`});
        }

        const appointment = appointmentStorage.get(booking.Some.appointmentId);
        if ("None" in appointment) {
            return Err({NotFound:`Appointment for booking with ID ${bookingId} does not exist.`});
        }

        const updatedBooking = booking.Some
        updatedBooking.status = "Cancelled";
        updatedBooking.updatedAt = Date.now();

        appointment.Some.available = true;
        bookingStorage.insert(updatedBooking.id, updatedBooking);

        appointmentStorage.insert(updatedBooking.appointmentId, appointment.Some);

        return Ok(`Canceled with ID ${booking.Some.id}`);
    }),

    // Create a new appointment
    createAppointment: update([text, text, nat64, nat64], Result(text,Message), (title, description, date, duration: nat64) => {
        const appointment = {
            id: uuidv4(),
            title: title,
            description: description,
            date: date,
            duration: duration,
            available: true,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        appointmentStorage.insert(appointment.id, appointment);
        return Ok(`Created with ID ${appointment.id}`);
    }),

    // Register a new customer
    registerCustomer: update([text, text, text],Result(text,Message), (name, email, phoneNumber) => {
        const customer = {
            id: uuidv4(),
            name: name,
            email: email,
            phoneNumber: phoneNumber,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        customerStorage.insert(customer.id, customer);
        return Ok(`Registered with ID ${customer.id}`);
    }),

     // Update appointment details
     updateAppointment: update([text, text, text, nat64, nat64], Result(text, Message), (appointmentId, title, description, date, duration) => {
        const appointment = appointmentStorage.get(appointmentId);
        if ("None" in appointment) {
            return Err({ NotFound: `Appointment with ID ${appointmentId} does not exist.` });
        }

        appointment.Some.title = title;
        appointment.Some.description = description;
        appointment.Some.date = date;
        appointment.Some.duration = duration;
        appointment.Some.updatedAt = Date.now();

        appointmentStorage.insert(appointmentId, appointment.Some);
        return Ok(`Updated appointment with ID ${appointmentId}`);
    }),

    // Get details of a single appointment by ID
    getAppointmentById: query([text], Result(Appointment, Message), (appointmentId: text) => {
        const appointment = appointmentStorage.get(appointmentId);
        return "None" in appointment ? Err({ NotFound: `Appointment with ID ${appointmentId} not found.` }) : Ok(appointment.Some);
    }),

    // Get details of a single customer by ID
    getCustomerById: query([text], Result(Customer, Message), (customerId: text) => {
        const customer = customerStorage.get(customerId);
        return "None" in customer ? Err({ NotFound: `Customer with ID ${customerId} not found.` }) : Ok(customer.Some) ;
    }),

    // Get details of a single booking by ID
    getBookingById: query([text], Result(Booking, Message), (bookingId: text) => {
        const booking = bookingStorage.get(bookingId);
        return "None" in booking ? Err({ NotFound: `Booking with ID ${bookingId} not found.` }): Ok(booking.Some);
    }),

});
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

