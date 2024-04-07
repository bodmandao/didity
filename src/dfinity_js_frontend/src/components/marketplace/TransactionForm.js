// TransactionForm.js
import React, { useState } from 'react';
import { Principal } from '@dfinity/principal';
import { transferFunds } from '../../utils/booking';


const TransactionForm = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [transactionStatus, setTransactionStatus] = useState(null);

  const handleTransfer = async () => {
    try {
      const result = await transferFunds(Principal.toString(from), Principal.toString(to), BigInt(amount), description, transactionType);
      setTransactionStatus(result);
    } catch (error) {
      console.error("Error transferring funds:", error);
      setTransactionStatus("Transaction failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>Transfer Funds</h2>
      <input type="text" placeholder="From" value={from} onChange={(e) => setFrom(e.target.value)} />
      <input type="text" placeholder="To" value={to} onChange={(e) => setTo(e.target.value)} />
      <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="text" placeholder="Transaction Type" value={transactionType} onChange={(e) => setTransactionType(e.target.value)} />
      <button onClick={handleTransfer}>Transfer</button>
      {transactionStatus && <p>{transactionStatus}</p>}
    </div>
  );
};

export default TransactionForm;
