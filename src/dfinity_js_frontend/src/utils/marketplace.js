// Importing Principal from the DFINITY library for working with principals
import { Principal } from "@dfinity/principal";

// Importing the function for transferring ICP from the ledger (assuming it's defined elsewhere)
import { transferICP } from "./ledger";

// Function to register a user
export async function registerUser(initialBalance) {
  return window.canister.marketplace.registerUser(initialBalance);
}

// Function to record a transaction
export async function recordTransaction(from, to, amount, currency, description, transactionType) {
  return window.canister.marketplace.recordTransaction(from, to, amount, currency, description, transactionType);
}

// Function to get account balance
export async function getAccountBalance(principal) {
  try {
    return await window.canister.marketplace.getAccountBalance(principal);
  } catch (err) {
    // Log error if fetching balance fails
    console.error("Error fetching account balance:", err);
    return null; // Return null to indicate error
  }
}

// Function to get transaction details
export async function getTransactionDetails(transactionId) {
  try {
    return await window.canister.marketplace.getTransactionDetails(transactionId);
  } catch (err) {
    // Log error if fetching transaction details fails
    console.error("Error fetching transaction details:", err);
    return null; // Return null to indicate error
  }
}

// Function to get transaction history
export async function getTransactionHistory(principal) {
  try {
    return await window.canister.marketplace.getTransactionHistory(principal);
  } catch (err) {
    // Log error if fetching transaction history fails
    console.error("Error fetching transaction history:", err);
    return []; // Return empty array to indicate error
  }
}

// Function to get cash transactions
export async function getCashTransactions(principal) {
  try {
    return await window.canister.marketplace.getCashTransactions(principal);
  } catch (err) {
    // Log error if fetching cash transactions fails
    console.error("Error fetching cash transactions:", err);
    return []; // Return empty array to indicate error
  }
}

// Function to get debit transactions
export async function getDebitTransactions(principal) {
  try {
    return await window.canister.marketplace.getDebitTransactions(principal);
  } catch (err) {
    // Log error if fetching debit transactions fails
    console.error("Error fetching debit transactions:", err);
    return []; // Return empty array to indicate error
  }
}

// Function to get bank transactions
export async function getBankTransactions(principal) {
  try {
    return await window.canister.marketplace.getBankTransactions(principal);
  } catch (err) {
    // Log error if fetching bank transactions fails
    console.error("Error fetching bank transactions:", err);
    return []; // Return empty array to indicate error
  }
}

// Function to get credit transactions
export async function getCreditTransactions(principal) {
  try {
    return await window.canister.marketplace.getCreditTransactions(principal);
  } catch (err) {
    // Log error if fetching credit transactions fails
    console.error("Error fetching credit transactions:", err);
    return []; // Return empty array to indicate error
  }
}

// Function to transfer funds
export async function transferFunds(from, to, amount, description, transactionType) {
  return window.canister.marketplace.transferFunds(from, to, amount, description, transactionType);
}
