import React, { useEffect, useState } from 'react';
import AppoinmentCard from './AppoinmentCard';
import { getAllAppointments } from '../../utils/booking';
import Layout from './Layout';

/**
 * Functional component to display all appointments.
 * @returns {JSX.Element} JSX element representing all appointments.
 */
const AllAppointments = () => {
  // State to store appointments
  const [appointments, setAppointments] = useState([]);

  // Fetch appointments on component mount
  useEffect(() => {
    /**
     * Fetches all appointments and updates state.
     * @returns {void}
     */
    const fetchData = async () => {
      try {
        const allAppointments = await getAllAppointments();
        setAppointments(allAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className='text-primary text-left fw-bold my-5'>All Appointments</h1>
      <div className="row">
        {/* Map through appointments and render AppointmentCard component */}
        {appointments.map((appointment) => (
          <div key={appointment.id} className="col-md-4 mb-4">
            <AppoinmentCard appointment={appointment} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAppointments;
