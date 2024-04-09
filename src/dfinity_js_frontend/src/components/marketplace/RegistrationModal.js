/**
 * Component representing a registration modal for users.
 * @param {object} props - Props for the component.
 * @param {boolean} props.show - Indicates whether the modal should be displayed.
 * @param {Function} props.handleClose - Function to handle closing the modal.
 * @returns {JSX.Element} Registration modal component.
 */
const RegistrationModal = ({ show, handleClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  /**
   * Handles the registration process when the user submits the form.
   */
  const handleRegistration = async () => {
    try {
      const result = await registerCustomer(name, email, phoneNumber);
      if (result.Ok) {
        toast(<NotificationSuccess text="Registration successful. You can now book appointments." />);
        handleClose(); // Close the registration modal after registration
      } else {
        toast(<NotificationError text="Failed to register. Please try again later." />);
      }
    } catch (error) {
      console.error(error);
      toast(<NotificationError text="Failed to register. Please try again later." />);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Register</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="phoneNumber">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control type="text" placeholder="Enter your phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="primary" onClick={handleRegistration}>Register</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RegistrationModal;