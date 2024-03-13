import { query, update, text, Ok, Record, Err, Null, Variant, StableBTreeMap, Principal, nat64, Result, ic, Canister, Vec } from "azle";
import { v4 as uuidv4 } from "uuid";

/**
 * Define a record for Account.
 */
const Account = Record({
    principal: Principal, // Principal identifier for the account
    balance: nat64 // Balance of the account
});

/**
 * Define a variant for different types of transactions.
 */
const TransactionType = Variant({
    Credit: Null, // Credit transaction
    Debit: Null, // Debit transaction
    Cash: Null, // Cash transaction
    Bank: Null // Bank transaction
});

/**
 * Define a record for Transaction.
 */
const Transaction = Record({
    id: text, // Transaction ID
    from: Principal, // Sender's account principal
    to: Principal, // Receiver's account principal
    amount: nat64, // Amount of the transaction
    currency: text, // Currency of the transaction
    transactionType: TransactionType, // Type of transaction (Credit, Debit, Cash, Bank)
    timestamp: nat64, // Timestamp of the transaction
    description: text // Description of the transaction
});

// Storage for storing accounts
const accountsStorage = StableBTreeMap(0, Principal, Account);

// Storage for storing transactions
const transactionsStorage = StableBTreeMap(1, text, Transaction);

// Decentralized Bookkeeping System
export default Canister({
    /**
     * Function to register a user's account.
     */
    registerUser: update([], text, () => {
        const principal = ic.caller();
        const account = {
            principal: principal,
            balance: 0n
        };
        accountsStorage.insert(principal, account);
        return `User account registered successfully with principal ${principal.toText()}`;
    }),

    /**
     * Function to record a transaction.
     */
    recordTransaction: update([Principal, Principal, nat64, text, text, text], Result(text, text), (from, to, amount, currency, description, transactionType) => {
        const fromAccountOpt = accountsStorage.get(from);
        const toAccountOpt = accountsStorage.get(to);
        if ("None" in fromAccountOpt || "None" in toAccountOpt) {
            return Err("One of the accounts involved in the transaction doesn't exist.");
        }

        const fromAccount = fromAccountOpt.Some;
        const toAccount = toAccountOpt.Some;

        // Ensure sufficient balance in the sender's account
        if (fromAccount.balance < amount) {
            return Err("Insufficient balance in the sender's account.");
        }

        // Update account balances
        fromAccount.balance -= amount;
        toAccount.balance += amount;

        // Update account balances in storage
        accountsStorage.insert(from, fromAccount);
        accountsStorage.insert(to, toAccount);

        // Record the transaction
        const transactionId = uuidv4();
        const transaction = {
            id: transactionId,
            from: from,
            to: to,
            amount: amount,
            currency: currency,
            transactionType: transactionType, // Provided transaction type
            timestamp: ic.time(),
            description: description
        };
        transactionsStorage.insert(transactionId, transaction);

        return Ok(`Transaction recorded successfully with ID ${transactionId}`);
    }),

    /**
     * Function to get account balance.
     */
    getAccountBalance: query([Principal], Result(nat64, text), (principal) => {
        const accountOpt = accountsStorage.get(principal);
        if ("None" in accountOpt) {
            return Err("Account not found.");
        }
        return Ok(accountOpt.Some.balance);
    }),

    /**
     * Function to get transaction details.
     */
    getTransactionDetails: query([text], Result(Transaction, text), (transactionId) => {
        const transactionOpt = transactionsStorage.get(transactionId);
        if ("None" in transactionOpt) {
            return Err("Transaction not found.");
        }
        return Ok(transactionOpt.Some);
    }),

    /**
     * Function to get transaction history of an account.
     */
    getTransactionHistory: query([Principal], Vec(Transaction), (principal) => {
        const transactions = transactionsStorage.values();
        const accountTransactions = transactions.filter(transaction => transaction.from.equals(principal) || transaction.to.equals(principal));
        return accountTransactions;
    }),

    /**
     * Function to get cash transactions associated with an account.
     */
    getCashTransactions: query([Principal], Vec(Transaction), (principal) => {
        const transactions = transactionsStorage.values();
        const cashTransactions = transactions.filter(transaction => transaction.transactionType.isSome("Cash") && (transaction.from.equals(principal) || transaction.to.equals(principal)));
        return cashTransactions;
    }),

    /**
     * Function to get debit transactions associated with an account.
     */
    getDebitTransactions: query([Principal], Vec(Transaction), (principal) => {
        const transactions = transactionsStorage.values();
        const debitTransactions = transactions.filter(transaction => transaction.transactionType.isSome("Debit") && (transaction.from.equals(principal) || transaction.to.equals(principal)));
        return debitTransactions;
    }),

    /**
     * Function to get bank transactions associated with an account.
     */
    getBankTransactions: query([Principal], Vec(Transaction), (principal) => {
        const transactions = transactionsStorage.values();
        const bankTransactions = transactions.filter(transaction => transaction.transactionType.isSome("Bank") && (transaction.from.equals(principal) || transaction.to.equals(principal)));
        return bankTransactions;
    }),

    /**
     * Function to get credit transactions associated with an account.
     */
    getCreditTransactions: query([Principal], Vec(Transaction), (principal) => {
        const transactions = transactionsStorage.values();
        const creditTransactions = transactions.filter(transaction => transaction.transactionType.isSome("Credit") && (transaction.from.equals(principal) || transaction.to.equals(principal)));
        return creditTransactions;
    }),

    /**
     * Function to transfer funds between accounts.
     */
    transferFunds: update([Principal, Principal, nat64, text, text], Result(text, text), (from, to, amount, description, transactionType) => {
        const fromAccountOpt = accountsStorage.get(from);
        const toAccountOpt = accountsStorage.get(to);
        if ("None" in fromAccountOpt || "None" in toAccountOpt) {
            return Err("One of the accounts involved in the transfer doesn't exist.");
        }

        const fromAccount = fromAccountOpt.Some;
        const toAccount = toAccountOpt.Some;

        // Ensure sufficient balance in the sender's account
        if (fromAccount.balance < amount) {
            return Err("Insufficient balance in the sender's account.");
        }

        // Update account balances
        fromAccount.balance -= amount;
        toAccount.balance += amount;

        // Update account balances in storage
        accountsStorage.insert(from, fromAccount);
        accountsStorage.insert(to, toAccount);

        // Record the transaction
        const transactionId = uuidv4();
        const transaction = {
            id: transactionId,
            from: from,
            to: to,
            amount: amount,
            currency: "USD", // Assuming a default currency
            transactionType: transactionType,
            timestamp: ic.time(),
            description: description
        };
        transactionsStorage.insert(transactionId, transaction);

        return Ok(`Funds transferred successfully with ID ${transactionId}`);
    }),
});

// A workaround to make the uuid package work with Azle
globalThis.crypto = {
    // @ts-ignore
    getRandomValues: () => {
        let array = new Uint8Array(32);

        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }

        return array;
    }
};
