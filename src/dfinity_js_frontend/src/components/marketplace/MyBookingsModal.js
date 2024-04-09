import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';

const MyBookingsModal = ({ show, handleClose, bookings }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>My Bookings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Status</th>
                <th>Customer ID</th>
                <th>Appointment ID</th>
                <th>Created At</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.status}</td>
                  <td>{booking.customerId}</td>
                  <td>{booking.appointmentId}</td>
                  <td>{new Date(Number(booking.createdAt)).toLocaleString()}</td>
                  <td>{new Date(Number(booking.updatedAt)).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MyBookingsModal;
