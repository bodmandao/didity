import React, { useRouter } from 'next/router';
import MyBookingsPage from './MyBookingsPage';

/**
 * Component to handle routing and pass customerId to MyBookingsPage.
 * @returns {JSX.Element} JSX element representing the MyBookings component.
 */
const MyBookings = () => {
  const router = useRouter();
  const { customerId } = router.query;

  return <MyBookingsPage customerId={customerId} />;
};

export default MyBookings;
