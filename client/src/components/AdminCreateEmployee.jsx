import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';

const AdminCreateEmployee = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '', 
        employeeId: '', 
        dateOfJoining: '',
        salary: '',
        role: 'employee', 
        education: '',
        address: '',
        phone: '',
        emergencyContact: '',
        idNumber: '' 
    });

    const [family, setFamily] = useState([{ name: '', relation: '', contact: '' }]);
    const [credentials, setCredentials] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); 
        setSuccessMessage(''); 
    };

    const handleFamilyChange = (index, e) => {
        const updatedFamily = [...family];
        updatedFamily[index][e.target.name] = e.target.value;
        setFamily(updatedFamily);
    };

    const addFamilyMember = () => {
        setFamily([...family, { name: '', relation: '', contact: '' }]);
    };

    const removeFamilyMember = (index) => {
        const updatedFamily = [...family];
        updatedFamily.splice(index, 1);
        setFamily(updatedFamily);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 
        setSuccessMessage(''); 

        if (!formData.name || !formData.email || !formData.password || !formData.employeeId || !formData.dateOfJoining || !formData.salary) {
            setError('Please complete all required fields (Full Name, Email Address, Password, Employee ID, Date of Joining, Base Salary).');
            return;
        }

        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found. Please log in as an administrator.');
                setIsLoading(false);
                return;
            }

            const res = await axios.post(
                `${API_BASE_URL}/api/auth/register`,
                { ...formData, family },
                {
                    headers: { Authorization: `Bearer ${token}`}
                }
            );
            setCredentials(res.data.credentials);
            setSuccessMessage(res.data.message || 'Employee created successfully!');

            setFormData({
                name: '', email: '', password: '', employeeId: '', dateOfJoining: '', salary: '',
                role: 'employee', education: '', address: '', phone: '', emergencyContact: '', idNumber: ''
            });
            setFamily([{ name: '', relation: '', contact: '' }]);

        } catch (err) {
            console.error('Error creating employee:', err);
            setError(err.response?.data?.message || 'Failed to create employee record');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10">
            <div className="glass-panel rounded-3xl p-8 md:p-12 shadow-2xl border border-dark-600/80 bg-dark-900/85 backdrop-blur-2xl">
                
                {/* Header Title Banner */}
                <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-600/60 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
                            <span className="material-symbols-rounded text-3xl">person_add</span>
                        </div>
                        <div>
                            <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">
                                Onboard New Employee
                            </h2>
                            <p className="text-sm text-gray-300 mt-1">Register official credentials and profile records into HRMS</p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold flex items-center gap-3">
                        <span className="material-symbols-rounded text-2xl">error</span>
                        <span>{error}</span>
                    </div>
                )}
                
                {successMessage && (
                    <div className="mb-8 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold flex items-center gap-3">
                        <span className="material-symbols-rounded text-2xl">check_circle</span>
                        <span>{successMessage}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* Primary Credentials Grid */}
                    <div>
                        <h3 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2 text-brand-light">
                            <span className="material-symbols-rounded text-xl">badge</span>
                            Core Profile & Credentials
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-200 mb-2">
                                    Full Name <span className="text-brand-light">*</span>
                                </label>
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="e.g. Anushka Dutta"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="glass-input text-base text-white bg-dark-800/90"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-200 mb-2">
                                    Email Address <span className="text-brand-light">*</span>
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="e.g. anushka@company.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="glass-input text-base text-white bg-dark-800/90"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-200 mb-2">
                                    Temporary Password <span className="text-brand-light">*</span>
                                </label>
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="Set temporary login password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="glass-input text-base text-white bg-dark-800/90"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-200 mb-2">
                                    Employee ID <span className="text-brand-light">*</span>
                                </label>
                                <input
                                    name="employeeId"
                                    type="text"
                                    placeholder="e.g. EMP101"
                                    value={formData.employeeId}
                                    onChange={handleChange}
                                    className="glass-input text-base text-white font-mono bg-dark-800/90"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-200 mb-2">
                                    Date of Joining <span className="text-brand-light">*</span>
                                </label>
                                <input
                                    name="dateOfJoining"
                                    type="date"
                                    value={formData.dateOfJoining}
                                    onChange={handleChange}
                                    className="glass-input text-base text-white bg-dark-800/90 cursor-pointer"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-200 mb-2">
                                    Base Salary (INR) <span className="text-brand-light">*</span>
                                </label>
                                <input
                                    name="salary"
                                    type="number"
                                    placeholder="e.g. 50000"
                                    value={formData.salary}
                                    onChange={handleChange}
                                    className="glass-input text-base text-white font-mono bg-dark-800/90"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Secondary Details Grid */}
                    <div className="pt-6 border-t border-dark-600/60">
                        <h3 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2 text-indigo-400">
                            <span className="material-symbols-rounded text-xl">contact_page</span>
                            Additional Information (Optional)
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-200 mb-2">
                                    Education Qualifications
                                </label>
                                <input
                                    name="education"
                                    type="text"
                                    placeholder="e.g. B.Tech Computer Science"
                                    value={formData.education}
                                    onChange={handleChange}
                                    className="glass-input text-base text-white bg-dark-800/90"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-200 mb-2">
                                    Contact Phone Number
                                </label>
                                <input
                                    name="phone"
                                    type="text"
                                    placeholder="e.g. 9876543210"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="glass-input text-base text-white bg-dark-800/90"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-200 mb-2">
                                    Emergency Contact Number
                                </label>
                                <input
                                    name="emergencyContact"
                                    type="text"
                                    placeholder="e.g. 9876543210"
                                    value={formData.emergencyContact}
                                    onChange={handleChange}
                                    className="glass-input text-base text-white bg-dark-800/90"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-200 mb-2">
                                    ID Proof (Aadhar / PAN)
                                </label>
                                <input
                                    name="idNumber"
                                    type="text"
                                    placeholder="e.g. ABCDE1234F"
                                    value={formData.idNumber}
                                    onChange={handleChange}
                                    className="glass-input text-base text-white font-mono bg-dark-800/90"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-200 mb-2">
                                    Residential Address
                                </label>
                                <input
                                    name="address"
                                    type="text"
                                    placeholder="Enter full street address, city, state"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="glass-input text-base text-white bg-dark-800/90"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Family & Dependents Section */}
                    <div className="pt-6 border-t border-dark-600/60">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-display font-bold text-white flex items-center gap-2 text-emerald-400">
                                <span className="material-symbols-rounded text-xl">groups</span>
                                Family & Dependents
                            </h3>
                            <button
                                type="button"
                                onClick={addFamilyMember}
                                className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 font-semibold text-xs flex items-center gap-1.5 transition-all"
                            >
                                <span className="material-symbols-rounded text-base">add</span> Add Family Member
                            </button>
                        </div>

                        <div className="space-y-4">
                            {family.map((member, index) => (
                                <div
                                    key={index}
                                    className="p-5 rounded-2xl bg-dark-800/80 border border-dark-600/70 shadow-md relative grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
                                >
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={member.name}
                                            onChange={(e) => handleFamilyChange(index, e)}
                                            placeholder="e.g. John Doe"
                                            className="glass-input text-sm py-2.5 text-white bg-dark-900/80"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">Relationship</label>
                                        <input
                                            type="text"
                                            name="relation"
                                            value={member.relation}
                                            onChange={(e) => handleFamilyChange(index, e)}
                                            placeholder="e.g. Spouse / Sister"
                                            className="glass-input text-sm py-2.5 text-white bg-dark-900/80"
                                            required
                                        />
                                    </div>

                                    <div className="relative">
                                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">Contact Phone</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                name="contact"
                                                value={member.contact}
                                                onChange={(e) => handleFamilyChange(index, e)}
                                                placeholder="e.g. 9876543210"
                                                className="glass-input text-sm py-2.5 text-white bg-dark-900/80"
                                                required
                                            />
                                            {family.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeFamilyMember(index)}
                                                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Remove family member"
                                                >
                                                    <span className="material-symbols-rounded text-xl">delete</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary py-4 text-base font-bold shadow-xl flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                <>
                                    <span className="material-symbols-rounded text-2xl">person_add</span>
                                    Onboard Employee Record
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Generated Credentials Alert */}
                {credentials && (
                    <div className="mt-8 p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 font-mono text-sm space-y-2">
                        <div className="font-semibold text-emerald-400 text-base mb-2 flex items-center gap-2 font-display">
                            <span className="material-symbols-rounded text-xl">key</span>
                            Generated Employee Credentials
                        </div>
                        <p><strong>Email:</strong> <span className="text-white">{credentials.email}</span></p>
                        <p><strong>Temporary Password:</strong> <span className="text-white">{credentials.password}</span></p>
                        <p><strong>Employee ID:</strong> <span className="text-white">{credentials.employeeId}</span></p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCreateEmployee;
