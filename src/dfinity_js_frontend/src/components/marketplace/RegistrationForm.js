// RegistrationForm.js
import React, { useState } from 'react';
import { registerUser } from '../../utils/marketplace';

const RegistrationForm = () => {
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [amount, setAmount] = useState(0);

  const handleRegister = async () => {
    try {
      if (amount) {
        const result = await registerUser(BigInt(amount));
        if ('Err' in result) {
          // Handling error case
          console.error("Error registering user:", result.Err);
          setRegistrationStatus(result.Err);
        } else if ('Ok' in result) {
          // Handling success case
          setRegistrationStatus(result.Ok);
          console.log(result.Ok);
        }
      } else {
        setRegistrationStatus("amount is not set.");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      setRegistrationStatus("Registration failed. Please try again.");
    }
  };
  

  return (
    <div>
      <h2>Register User</h2>
      <button onClick={handleRegister}>Register</button>
      <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />

      {registrationStatus && <p>{registrationStatus}</p>}
    </div>
  );
};

export default RegistrationForm;