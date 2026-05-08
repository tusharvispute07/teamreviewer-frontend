import React from 'react';
import AdminReviews from '../components/reviews/AdminReviews';
import EmployeeReviews from '../components/reviews/EmployeeReviews';

const Reviews = () => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = currentUser.role === 'admin';

    if (!currentUser._id) {
        return <div className="text-zinc-500 text-center p-8">Please log in to view reviews.</div>;
    }

    return isAdmin ? <AdminReviews /> : <EmployeeReviews currentUser={currentUser} />;
};

export default Reviews;
