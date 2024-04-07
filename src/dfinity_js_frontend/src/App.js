import React, { useEffect, useCallback, useState } from "react";
import { Container, Nav, Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import Wallet from "./components/Wallet";
import coverImg from "./assets/img/sandwich.jpg";
import { login, logout as destroy } from "./utils/auth";
import { balance as principalBalance } from "./utils/ledger"
import Cover from "./components/utils/Cover";
import { Notification } from "./components/utils/Notifications";
// import Link from 'next/link';
// import AllAppointmentsPage from "./components/marketplace/AllAppointmentsPage";
import AllAppointments from "./components/marketplace/AllAppointmentsPage";
import AppointmentCreationPage from "./components/marketplace/AppointmentCreationPage";


const App = function AppWrapper() {
    const isAuthenticated = window.auth.isAuthenticated;
    const principal = window.auth.principalText;

    const [balance, setBalance] = useState("0");

    const getBalance = useCallback(async () => {
        if (isAuthenticated) {
            setBalance(await principalBalance());
        }
    });

    useEffect(() => {
        getBalance();
    }, [getBalance]);

    return (
        <>
            <Notification />
            {isAuthenticated ? (
                <Container fluid="md">
                    <Nav className="justify-content-end pt-3 pb-5">
                        <Nav.Item>
                            <Wallet
                                principal={principal}
                                balance={balance}
                                symbol={"ICP"}
                                isAuthenticated={isAuthenticated}
                                destroy={destroy}
                            />
                        </Nav.Item>
                    </Nav>
                    <>
                    <Container className="mt-4">
                        <h1>Welcome to Appointment System</h1>
                        <AppointmentCreationPage />
                        <AllAppointments />
                        {/* <Link href="/create-appointment">
                            <Button variant="primary" className="mr-2">
                            Create Appointment
                            </Button>
                        </Link>
                        <Link href="/all-appointments">
                            <Button variant="info" className="mr-2">
                            All Appointments
                            </Button>
                        </Link>
                        <Link href="/my-bookings">
                            <Button variant="success">My Bookings</Button>
                        </Link> */}
                    </Container>
                    </>
                </Container>
            
            ) : (
                <Cover name="Street Foods" login={login} coverImg={coverImg} />
            )}
        </>
    );
};

export default App;