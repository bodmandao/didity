import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { toast } from "react-toastify";

// import Layout from '../components/Layout';
import { createAppointment } from '../../utils/booking';
import { NotificationError,NotificationSuccess } from '../utils/Notifications';

const AppointmentCreationPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const create = await createAppointment(title, description, BigInt(date), BigInt(duration));
        create.Ok? toast(<NotificationSuccess text="Appointment created successfully." />) :  toast(<NotificationError text="Failed to create an appointment." />);
      
    } catch (error) {
      console.log(error)
      toast(<NotificationError text="Failed to create an appointment." />);
    }
    // Optionally, redirect to another page after appointment creation
  };

  return (
    // <Layout>
      <div className="container mt-4">
        <h1>Create Appointment</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formDate">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="minutes"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formDuration">
            <Form.Label>Duration (in minutes)</Form.Label>
            <Form.Control
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </Form.Group>
          <Button className='mt-2' variant="primary" type="submit">
            Create Appointment
          </Button>
        </Form>
      </div>
    // </Layout>
  );
};

export default AppointmentCreationPage;
