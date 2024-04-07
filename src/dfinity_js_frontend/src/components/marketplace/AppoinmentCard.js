import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { toast } from "react-toastify";
import { cancelBooking } from '../../utils/booking';
import { NotificationError,NotificationSuccess } from '../utils/Notifications';



const AppointmentCard = ({ booking, onCancelBooking }) => {
  const [isCanceling, setIsCanceling] = useState(false);

  const handleCancelClick = async () => {
    setIsCanceling(true);
    try {
        const cancel = await cancelBooking(booking.id);
        cancel.Ok? toast(<NotificationSuccess text="Appointment cancelled successfully." />) :  toast(<NotificationError text="Failed to cancel an appointment." />);
        setIsCanceling(false);
    } catch (error) {
      console.log(error)
      toast(<NotificationError text="Failed to cancel appointment." />)
    }
    
  };

  return (
    <Card className="shadow">
      <Card.Body>
        <Card.Title>{booking.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {booking.date}
        </Card.Subtitle>
        <Card.Text>{booking.description}</Card.Text>
        <Button
          variant="danger"
          onClick={handleCancelClick}
          disabled={isCanceling}
        >
          {isCanceling ? 'Cancelling...' : 'Cancel'}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default AppointmentCard;
