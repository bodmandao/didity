import React, { useRouter } from 'next/router';
import MyBookingsPage from './MyBookingsPage';

const MyBookings = () => {
  const router = useRouter();
  const { customerId } = router.query;

  return <MyBookingsPage customerId={customerId} />;
};

export default MyBookings;
