import React, { useEffect, useState } from 'react';
import AppoinmentCard from './AppoinmentCard';
import { getAvailableAppointments } from '../../utils/booking';
import Layout from './Layout';

const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allAppointments = await getAvailableAppointments();
        setAppointments(allAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container mt-4">
      <h1>All Appointments</h1>
      <div className="row">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="col-md-4 mb-4">
            <AppoinmentCard booking={appointment} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAppointments;
