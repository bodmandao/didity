import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const Layout = ({ children }) => (
  <div>
    <Head>
      <title>My App</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossOrigin="anonymous" />
    </Head>
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link href="/">
            <span className="navbar-brand">My App</span>
          </Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link href="/appointments">
                  <span className="nav-link">Appointments</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/bookings">
                  <span className="nav-link">Bookings</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
    <main className="container mt-4">
      {children}
    </main>
    <footer className="footer mt-auto py-3 bg-light">
      <div className="container">
        <span className="text-muted">© 2024 My App. All rights reserved.</span>
      </div>
    </footer>
  </div>
);

export default Layout;
