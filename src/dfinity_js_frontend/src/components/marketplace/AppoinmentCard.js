import React, { useState ,useEffect} from 'react';
import { Card, Button, Modal, Form } from 'react-bootstrap';
import { toast } from "react-toastify";
import { bookAppointment, cancelBooking, updateAppointment, getCustomerByEmail } from '../../utils/booking';
import { NotificationError, NotificationSuccess } from '../utils/Notifications';

/**
 * Component to display an appointment card.
 * @param {Object} props - Props for the component.
 * @param {Object} props.appointment - Appointment object containing appointment details.
 * @returns {JSX.Element} JSX element representing an appointment card.
 */
const AppointmentCard = ({ appointment }) => {
  const [isCanceling, setIsCanceling] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [title, setTitle] = useState(appointment.title);
  const [description, setDescription] = useState(appointment.description);
  const [date, setDate] = useState(appointment.date);
  const [duration, setDuration] = useState(appointment.duration);
  const [availability, setAvailability] = useState(appointment.available);
  const [email, setEmail] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');

  /**
   * Function to fetch random image URL from Unsplash.
   * @returns {void}
   */
  async function fetchRandomImage() {
    try {
      const response = await fetch('https://source.unsplash.com/random');
      setBackgroundImage(response.url);
    } catch (error) {
      console.error('Error fetching random image:', error);
    }
  }

  useEffect(() => {
    fetchRandomImage(); // Fetch random image when component mounts
  }, []);

  const handleBookClick = () => {
    // Show modal for booking
    setShowBookModal(true);
  };

  /**
   * Handles booking confirmation.
   * @returns {void}
   */
  const handleBookingConfirmed = async () => {
    try {
      // Check if email is registered
      const customer = await getCustomerByEmail(email);
      if (customer.Ok) {
        // If email is registered, proceed with booking
        const booking = await bookAppointment(appointment.id, customer.Ok.id);
        if (booking.Ok) {
          toast(<NotificationSuccess text="Appointment booked successfully." />);
          setShowBookModal(false); // Close the booking modal after booking
        }
        else if(booking.Err.NotFound){
          toast(<NotificationError text={booking.Err.NotFound} />);
        }
        else {
          toast(<NotificationError text="Failed to book appointment." />);
        }
      } else {
        // If email is not registered, show error message
        toast(<NotificationError text="Email is not registered. Please enter a valid email." />);
      }
    } catch (error) {
      console.error(error);
      toast(<NotificationError text="Failed to book appointment." />);
    }
  };

  /**
   * Handles canceling an appointment.
   * @returns {void}
   */
  const handleCancelClick = async () => {
    setIsCanceling(true);
    try {
      const cancel = await cancelBooking(appointment.id);
      cancel.Ok ? toast(<NotificationSuccess text="Appointment cancelled successfully." />) : toast(<NotificationError text="Failed to cancel an appointment." />);
      setIsCanceling(false);
    } catch (error) {
      console.error(error);
      toast(<NotificationError text="Failed to cancel appointment." />);
    }
  };

  /**
   * Handles updating an appointment.
   * @returns {void}
   */
  const handleUpdateClick = async () => {
    try {
      const updatedAppointment = await updateAppointment(appointment.id, title, description, BigInt(date), duration);
      if (updatedAppointment.Ok) {
        setTitle(updatedAppointment.title);
        setDescription(updatedAppointment.description);
        setDate(updatedAppointment.date);
        toast(<NotificationSuccess text="Appointment updated successfully." />);
        setShowUpdateModal(false);
      } else {
        toast(<NotificationError text="Failed to update appointment." />);
      }
    } catch (error) {
      console.error(error);
      toast(<NotificationError text="Failed to update appointment." />);
    }
  };

  return (
    <div style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', padding: '20px' }}>
      <Card className="shadow" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
        <Card.Body>
          <Card.Title>Title : {title}</Card.Title>
          <Card.Text>Description : {description}</Card.Text>
          <Card.Subtitle className="mb-2 text-muted">
            Date : {Number(date)}
          </Card.Subtitle>
          <Card.Subtitle className="mb-2 text-muted">
            Duration : {Number(duration)} minutes
          </Card.Subtitle>
          <Card.Subtitle className="mb-2 text-muted">
            Availability : {availability? 'Available' : 'Not Available'}
          </Card.Subtitle>
          <Button variant="primary" onClick={() => setShowUpdateModal(true)}>Update</Button>
          <Button variant="success" className='mx-2' onClick={handleBookClick}>Book</Button>
          {/* <Button
            variant="danger"
            onClick={handleCancelClick}
            disabled={isCanceling}
          >
            {isCanceling ? 'Cancelling...' : 'Cancel'}
          </Button> */}
        </Card.Body>
      </Card>
      {/* Update Appointment Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="duration">
              <Form.Label>Duration</Form.Label>
              <Form.Control type='text' value={Number(duration)} onChange={(e) => setDuration(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="date">
              <Form.Label>Date</Form.Label>
              <Form.Control type="text" value={Number(date)} onChange={(e) => setDate(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleUpdateClick}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
      {/* Book Appointment Modal */}
      <Modal show={showBookModal} onHide={() => setShowBookModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Book Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="email">
              <Form.Label>Enter your Email</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBookModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleBookingConfirmed}>Book Appointment</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AppointmentCard;