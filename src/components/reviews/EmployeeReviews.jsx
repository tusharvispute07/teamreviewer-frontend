import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Modal from '../ui/Modal';

const EmployeeReviews = ({ currentUser }) => {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [currentReview, setCurrentReview] = useState(null);
    const [feedbackFormData, setFeedbackFormData] = useState({
        rating: 5,
        comment: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const res = await api.get('/reviews/assigned');
            setReviews(res.data.data);
        } catch (err) {
            setError('Failed to load data.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openFeedbackModal = (review) => {
        setCurrentReview(review);
        setFeedbackFormData({ rating: 5, comment: '' });
        setIsFeedbackModalOpen(true);
    };

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/feedback', {
                review: currentReview._id,
                reviewer: currentUser._id,
                rating: Number(feedbackFormData.rating),
                comment: feedbackFormData.comment
            });
            alert('Feedback submitted successfully!');
            setIsFeedbackModalOpen(false);

            await fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit feedback.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="text-zinc-100 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-white">Performance Reviews</h1>
                    <p className="text-zinc-500 text-sm mt-1">
                        Provide feedback for your peers.
                    </p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64 text-zinc-500 text-sm">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-zinc-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading reviews...
                </div>
            ) : error && reviews.length === 0 ? (
                <div className="text-red-400 text-sm bg-red-500/10 p-4 rounded-md border border-red-500/20">{error}</div>
            ) : (
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden shadow-sm backdrop-blur-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 uppercase tracking-wider text-[11px] font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Title</th>
                                    <th className="px-6 py-4">Subject (Employee)</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {reviews.map((review) => (
                                    <tr key={review._id} className="hover:bg-zinc-800/30 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-zinc-200">{review.title}</td>
                                        <td className="px-6 py-4 text-zinc-500">{review.employee?.name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${review.status === 'completed'
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                }`}>
                                                {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => openFeedbackModal(review)}
                                                disabled={review.status === 'completed'}
                                                className={`px-3 py-1.5 rounded-md transition-colors text-xs font-medium border ${review.status === 'completed'
                                                        ? 'bg-zinc-800/50 text-zinc-500 border-zinc-800 cursor-not-allowed'
                                                        : 'bg-zinc-800 text-white hover:bg-zinc-700 border-zinc-700'
                                                    }`}
                                            >
                                                {review.status === 'completed' ? 'Submitted' : 'Submit Feedback'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {reviews.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                                            You have no pending feedback requests.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <Modal
                isOpen={isFeedbackModalOpen}
                onClose={() => setIsFeedbackModalOpen(false)}
                title="Submit Peer Feedback"
            >
                <form onSubmit={handleFeedbackSubmit} className="p-6 space-y-5">
                    {currentReview && (
                        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-lg mb-4">
                            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Reviewing</p>
                            <p className="text-sm font-medium text-white">{currentReview.employee?.name}</p>
                            <p className="text-xs text-zinc-400 mt-0.5">{currentReview.title}</p>
                        </div>
                    )}

                    <div className="space-y-1.5 group">
                        <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-widest group-focus-within:text-zinc-300 transition-colors">
                            Rating (1-5)
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(num => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => setFeedbackFormData({ ...feedbackFormData, rating: num })}
                                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors border ${feedbackFormData.rating === num
                                        ? 'bg-white text-black border-white'
                                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600'
                                        }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1.5 group">
                        <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-widest group-focus-within:text-zinc-300 transition-colors">
                            Constructive Comments
                        </label>
                        <textarea
                            required
                            rows={4}
                            value={feedbackFormData.comment}
                            onChange={(e) => setFeedbackFormData({ ...feedbackFormData, comment: e.target.value })}
                            className="w-full bg-zinc-900/50 border border-zinc-800 px-3 py-2 text-zinc-100 rounded-md focus:outline-none focus:border-zinc-500 focus:bg-zinc-900 transition-all sm:text-sm resize-none"
                            placeholder="Provide your feedback here..."
                        />
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button
                            type="button"
                            onClick={() => setIsFeedbackModalOpen(false)}
                            className="flex-1 py-2.5 px-4 border border-zinc-800 text-zinc-300 font-medium rounded-md hover:bg-zinc-800 transition-colors sm:text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-2.5 px-4 bg-white text-black font-medium rounded-md hover:bg-zinc-200 disabled:opacity-50 transition-colors sm:text-sm flex justify-center items-center"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default EmployeeReviews;
