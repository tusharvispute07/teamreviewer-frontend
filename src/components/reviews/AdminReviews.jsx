import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Modal from '../ui/Modal';
import ConfirmDialog from '../ui/ConfirmDialog';

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
    const [isEditingReview, setIsEditingReview] = useState(false);
    const [currentEditReviewId, setCurrentEditReviewId] = useState(null);
    const [adminFormData, setAdminFormData] = useState({
        title: '',
        employee: '',
        assignedReviewers: []
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, reviewId: null });

    const [isFeedbacksModalOpen, setIsFeedbacksModalOpen] = useState(false);
    const [selectedReviewForFeedbacks, setSelectedReviewForFeedbacks] = useState(null);
    const [feedbacksList, setFeedbacksList] = useState([]);
    const [isFeedbacksLoading, setIsFeedbacksLoading] = useState(false);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [reviewsRes, employeesRes] = await Promise.all([
                api.get('/reviews'),
                api.get('/employees').catch(() => ({ data: { data: [] } }))
            ]);
            setReviews(reviewsRes.data.data);
            setEmployees(employeesRes.data.data);
        } catch (err) {
            setError('Failed to load data.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openFeedbacksModal = async (review) => {
        setSelectedReviewForFeedbacks(review);
        setIsFeedbacksModalOpen(true);
        setIsFeedbacksLoading(true);
        try {
            const res = await api.get(`/feedback?reviewId=${review._id}`);
            setFeedbacksList(res.data.data);
        } catch (err) {
            alert('Failed to load feedbacks.');
        } finally {
            setIsFeedbacksLoading(false);
        }
    };

    const openAdminModal = () => {
        setIsEditingReview(false);
        setAdminFormData({ title: '', employee: '', assignedReviewers: [] });
        setIsAdminModalOpen(true);
    };

    const openEditAdminModal = (review) => {
        setIsEditingReview(true);
        setCurrentEditReviewId(review._id);
        setAdminFormData({
            title: review.title,
            employee: review.employee?._id || '',
            assignedReviewers: review.assignedReviewers?.map(r => r._id) || []
        });
        setIsAdminModalOpen(true);
    };

    const handleDeleteReview = (id) => {
        setConfirmDialog({ isOpen: true, reviewId: id });
    };

    const confirmDeleteReview = async () => {
        try {
            await api.delete(`/reviews/${confirmDialog.reviewId}`);
            await fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete review.');
        } finally {
            setConfirmDialog({ isOpen: false, reviewId: null });
        }
    };

    const toggleReviewer = (empId) => {
        setAdminFormData(prev => ({
            ...prev,
            assignedReviewers: prev.assignedReviewers.includes(empId)
                ? prev.assignedReviewers.filter(id => id !== empId)
                : [...prev.assignedReviewers, empId]
        }));
    };

    const handleAdminSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (isEditingReview) {
                await api.put(`/reviews/${currentEditReviewId}`, adminFormData);
            } else {
                await api.post('/reviews', adminFormData);
            }
            await fetchData();
            setIsAdminModalOpen(false);
        } catch (err) {
            alert(err.response?.data?.message || `Failed to ${isEditingReview ? 'update' : 'create'} review.`);
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
                        Manage company-wide performance reviews.
                    </p>
                </div>
                <button
                    onClick={openAdminModal}
                    className="bg-white text-black px-4 py-2 rounded-md font-medium text-sm hover:bg-zinc-200 transition-colors shadow-sm active:scale-[0.98]"
                >
                    Create Review
                </button>
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
                                    <th className="px-6 py-4">Assigned Reviewers</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {reviews.map((review) => (
                                    <tr key={review._id} className="hover:bg-zinc-800/30 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-zinc-200">{review.title}</td>
                                        <td className="px-6 py-4 text-zinc-500">{review.employee?.name}</td>
                                        <td className="px-6 py-4 text-zinc-500">
                                            {review.assignedReviewers?.length || 0} peers
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${review.status === 'completed'
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                }`}>
                                                {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-3">
                                                <button
                                                    onClick={() => openFeedbacksModal(review)}
                                                    className="text-indigo-400/80 hover:text-indigo-400 transition-colors"
                                                >
                                                    View Feedbacks
                                                </button>
                                                <button
                                                    onClick={() => openEditAdminModal(review)}
                                                    className="text-zinc-400 hover:text-white transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteReview(review._id)}
                                                    className="text-red-400/80 hover:text-red-400 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {reviews.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                                            No reviews found. Click "Create Review" to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <Modal
                isOpen={isAdminModalOpen}
                onClose={() => setIsAdminModalOpen(false)}
                title={isEditingReview ? "Edit Performance Review" : "Create Performance Review"}
            >
                <form onSubmit={handleAdminSubmit} className="p-6 space-y-5">
                    <div className="space-y-1.5 group">
                        <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-widest group-focus-within:text-zinc-300 transition-colors">
                            Review Title
                        </label>
                        <input
                            type="text"
                            required
                            value={adminFormData.title}
                            onChange={(e) => setAdminFormData({ ...adminFormData, title: e.target.value })}
                            className="w-full bg-zinc-900/50 border border-zinc-800 px-3 py-2 text-zinc-100 rounded-md focus:outline-none focus:border-zinc-500 focus:bg-zinc-900 transition-all sm:text-sm"
                            placeholder="e.g. Q3 Performance Evaluation"
                        />
                    </div>

                    <div className="space-y-1.5 group">
                        <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-widest group-focus-within:text-zinc-300 transition-colors">
                            Subject (Employee to be reviewed)
                        </label>
                        <select
                            required
                            value={adminFormData.employee}
                            onChange={(e) => setAdminFormData({ ...adminFormData, employee: e.target.value, assignedReviewers: [] })}
                            className="w-full bg-zinc-900/50 border border-zinc-800 px-3 py-2 text-zinc-100 rounded-md focus:outline-none focus:border-zinc-500 focus:bg-zinc-900 transition-all sm:text-sm appearance-none"
                        >
                            <option value="">Select an employee...</option>
                            {employees.map(emp => (
                                <option key={emp._id} value={emp._id}>{emp.name} ({emp.email})</option>
                            ))}
                        </select>
                    </div>

                    {adminFormData.employee && (
                        <div className="space-y-2">
                            <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-widest">
                                Assign Reviewers
                            </label>
                            <div className="max-h-40 overflow-y-auto bg-zinc-900/50 border border-zinc-800 rounded-md p-2 space-y-1">
                                {employees.filter(emp => emp._id !== adminFormData.employee && emp.role !== 'admin').map(emp => (
                                    <label key={emp._id} className="flex items-center space-x-3 p-2 hover:bg-zinc-800/50 rounded-md cursor-pointer transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={adminFormData.assignedReviewers.includes(emp._id)}
                                            onChange={() => toggleReviewer(emp._id)}
                                            className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-white focus:ring-offset-zinc-900 focus:ring-zinc-500"
                                        />
                                        <span className="text-sm text-zinc-300">{emp.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-2 flex gap-3">
                        <button
                            type="button"
                            onClick={() => setIsAdminModalOpen(false)}
                            className="flex-1 py-2.5 px-4 border border-zinc-800 text-zinc-300 font-medium rounded-md hover:bg-zinc-800 transition-colors sm:text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || adminFormData.assignedReviewers.length === 0}
                            className="flex-1 py-2.5 px-4 bg-white text-black font-medium rounded-md hover:bg-zinc-200 disabled:opacity-50 transition-colors sm:text-sm flex justify-center items-center"
                        >
                            {isSubmitting ? (isEditingReview ? 'Saving...' : 'Creating...') : (isEditingReview ? 'Save Changes' : 'Create Review')}
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={isFeedbacksModalOpen}
                onClose={() => setIsFeedbacksModalOpen(false)}
                title="Review Feedbacks"
            >
                <div className="p-6">
                    {selectedReviewForFeedbacks && (
                        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-lg mb-6">
                            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Subject</p>
                            <p className="text-sm font-medium text-white">{selectedReviewForFeedbacks.employee?.name}</p>
                            <p className="text-xs text-zinc-400 mt-0.5">{selectedReviewForFeedbacks.title}</p>
                        </div>
                    )}

                    {isFeedbacksLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <svg className="animate-spin h-5 w-5 text-zinc-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    ) : feedbacksList.length === 0 ? (
                        <p className="text-zinc-500 text-sm text-center py-8">No feedbacks submitted yet.</p>
                    ) : (
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            {feedbacksList.map(fb => (
                                <div key={fb._id} className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="text-sm font-medium text-zinc-200">{fb.reviewer?.name}</p>
                                            <p className="text-xs text-zinc-500">{fb.reviewer?.email}</p>
                                        </div>
                                        <div className="flex items-center bg-zinc-800 px-2 py-1 rounded border border-zinc-700">
                                            <span className="text-amber-400 mr-1 text-xs">★</span>
                                            <span className="text-xs font-medium text-white">{fb.rating}/5</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-zinc-400 whitespace-pre-wrap mt-3">{fb.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="pt-6 flex justify-end">
                        <button
                            onClick={() => setIsFeedbacksModalOpen(false)}
                            className="py-2.5 px-4 bg-zinc-800 text-white font-medium rounded-md hover:bg-zinc-700 transition-colors sm:text-sm"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title="Delete Review"
                message="Are you sure you want to permanently delete this review? This cannot be undone."
                confirmLabel="Delete"
                onConfirm={confirmDeleteReview}
                onCancel={() => setConfirmDialog({ isOpen: false, reviewId: null })}
            />
        </div>
    );
};

export default AdminReviews;
