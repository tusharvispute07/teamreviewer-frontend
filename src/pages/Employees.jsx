import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEmployeeId, setCurrentEmployeeId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'employee'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, employeeId: null });

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const currentUserEmail = currentUser.email;


    const fetchEmployees = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/employees');
            setEmployees(response.data.data);
        } catch (err) {
            setError('Failed to load employees. Please make sure you have admin privileges.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const openAddModal = () => {
        setIsEditing(false);
        setFormData({ name: '', email: '', password: '', role: 'employee' });
        setError('');
        setIsModalOpen(true);
    };

    const openEditModal = (employee) => {
        setIsEditing(true);
        setCurrentEmployeeId(employee._id);
        setFormData({
            name: employee.name,
            email: employee.email,
            password: '',
            role: employee.role
        });
        setError('');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            if (isEditing) {
                // Update Employee
                await api.put(`/employees/${currentEmployeeId}`, {
                    name: formData.name,
                    email: formData.email,
                    role: formData.role
                });
            } else {
                // Create Employee
                await api.post('/employees', formData);
            }
            await fetchEmployees();
            closeModal();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save employee.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = (id) => {
        setConfirmDialog({ isOpen: true, employeeId: id });
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/employees/${confirmDialog.employeeId}`);
            await fetchEmployees();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete employee.');
        } finally {
            setConfirmDialog({ isOpen: false, employeeId: null });
        }
    };

    return (
        <div className="text-zinc-100 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-white">Employees</h1>
                    <p className="text-zinc-500 text-sm mt-1">Manage team members and their system access roles.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="bg-white text-black px-4 py-2 rounded-md font-medium text-sm hover:bg-zinc-200 transition-colors shadow-sm active:scale-[0.98]"
                >
                    Add Employee
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64 text-zinc-500 text-sm">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-zinc-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading employees...
                </div>
            ) : error && employees.length === 0 ? (
                <div className="text-red-400 text-sm bg-red-500/10 p-4 rounded-md border border-red-500/20">{error}</div>
            ) : (
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden shadow-sm backdrop-blur-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 uppercase tracking-wider text-[11px] font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {[...employees].sort((a, b) => {
                                    if (a.email === currentUserEmail) return -1;
                                    if (b.email === currentUserEmail) return 1;
                                    return 0;
                                }).map((emp) => (
                                    <tr key={emp._id} className="hover:bg-zinc-800/30 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-zinc-200">{emp.name}</td>
                                        <td className="px-6 py-4 text-zinc-500">{emp.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${emp.role === 'admin'
                                                ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                                : 'bg-zinc-800/50 text-zinc-300 border-zinc-700/50'
                                                }`}>
                                                {emp.role.charAt(0).toUpperCase() + emp.role.slice(1)}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-right space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {currentUserEmail !== emp.email && (
                                                <>
                                                    <button
                                                        onClick={() => openEditModal(emp)}
                                                        className="text-zinc-400 hover:text-white transition-colors"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(emp._id)}
                                                        className="text-red-400/80 hover:text-red-400 transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </td>

                                    </tr>
                                ))}
                                {employees.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-zinc-500">
                                            No employees found. Click "Add Employee" to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}


            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={isEditing ? 'Edit Employee' : 'Add Employee'}
            >
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1.5 group">
                        <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-widest group-focus-within:text-zinc-300 transition-colors">
                            Full Name
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-zinc-900/50 border border-zinc-800 px-3 py-2 text-zinc-100 rounded-md focus:outline-none focus:border-zinc-500 focus:bg-zinc-900 transition-all sm:text-sm"
                            placeholder="e.g. John Doe"
                        />
                    </div>

                    <div className="space-y-1.5 group">
                        <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-widest group-focus-within:text-zinc-300 transition-colors">
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-zinc-900/50 border border-zinc-800 px-3 py-2 text-zinc-100 rounded-md focus:outline-none focus:border-zinc-500 focus:bg-zinc-900 transition-all sm:text-sm"
                            placeholder="name@example.com"
                        />
                    </div>

                    {!isEditing && (
                        <div className="space-y-1.5 group">
                            <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-widest group-focus-within:text-zinc-300 transition-colors">
                                Temporary Password
                            </label>
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-zinc-900/50 border border-zinc-800 px-3 py-2 text-zinc-100 rounded-md focus:outline-none focus:border-zinc-500 focus:bg-zinc-900 transition-all sm:text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                    )}

                    <div className="space-y-1.5 group">
                        <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-widest group-focus-within:text-zinc-300 transition-colors">
                            System Role
                        </label>
                        <div className="relative">
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full bg-zinc-900/50 border border-zinc-800 px-3 py-2 text-zinc-100 rounded-md focus:outline-none focus:border-zinc-500 focus:bg-zinc-900 transition-all sm:text-sm appearance-none"
                            >
                                <option value="employee">Employee</option>
                                <option value="admin">Admin</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="flex-1 py-2.5 px-4 border border-zinc-800 text-zinc-300 font-medium rounded-md hover:bg-zinc-800 transition-colors sm:text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-2.5 px-4 bg-white text-black font-medium rounded-md hover:bg-zinc-200 disabled:opacity-50 transition-colors sm:text-sm flex justify-center items-center"
                        >
                            {isSubmitting ? (
                                <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                isEditing ? 'Save Changes' : 'Create Employee'
                            )}
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title="Delete Employee"
                message="Are you sure you want to permanently delete this employee? This cannot be undone."
                confirmLabel="Delete"
                onConfirm={confirmDelete}
                onCancel={() => setConfirmDialog({ isOpen: false, employeeId: null })}
            />
        </div>
    );
};

export default Employees;