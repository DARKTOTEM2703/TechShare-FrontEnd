import React from "react";

interface UserInformationProps {
    user: {
        id: number;
        userName: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        roles: string[];
    };
    onClose: () => void;
    onSave: () => void;
}

const UserInformation: React.FC<UserInformationProps> = ({ user, onClose, onSave }) => {
    return (
        <div className="modal-overlay">
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-[600px]">
                    <h2 className="text-lg font-semibold mb-4 text-primary">User Info</h2>
                    <hr className="mb-4" />

                    <div className="grid grid-cols-3 gap-6 mb-6">
                        {/* User Image */}
                        <div className="flex-shrink-0 h-full border-2 border-dashed border-primary rounded-lg flex items-center justify-center col-span-1">
                            <span className="text-gray-500">User image</span>
                        </div>

                        {/* User Name Details */}
                        <div className="col-span-2">
                            <div className="mb-4">
                                <h4 className="font-semibold text-sm text-primary">First Name</h4>
                                <div className="border border-primary px-4 py-2 rounded-lg mt-1 text-sm">
                                    <p className="truncate">{user.firstName}</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm text-primary">Last Name</h4>
                                <div className="border border-primary px-4 py-2 rounded-lg mt-1 text-sm">
                                    <p className="truncate">{user.lastName}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Email and Phone Number */}
                    <div className="grid grid-cols-1 gap-4 mb-6">
                        <div>
                            <h4 className="font-semibold text-sm text-primary">Email</h4>
                            <div className="border border-primary px-4 py-2 rounded-lg mt-1 text-sm">
                                <p className="truncate">{user.email}</p>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm text-primary">Phone Number</h4>
                            <div className="border border-primary px-4 py-2 rounded-lg mt-1 text-sm">
                                <p className="truncate">{user.phoneNumber || "N/A"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Roles */}
                    <h4 className="font-semibold text-sm text-primary mb-2">Roles</h4>
                    <div className="border border-primary rounded-lg px-4 py-2 flex flex-wrap gap-2">
                        {user.roles.length > 0 ? (
                            user.roles.map((role, index) => (
                                <span
                                    key={index}
                                    className="bg-tertiary text-white px-3 py-1 rounded-lg text-sm flex items-center gap-2"
                                >
                                    {role}
                                    <button className="text-xs text-white">×</button>
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-500 text-sm">No roles assigned</span>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex justify-end gap-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-white text-primary border border-primary text-sm font-semibold rounded-lg shadow hover:bg-gray-100"
                        >
                            CANCEL
                        </button>
                        <button
                            onClick={onSave}
                            className="px-6 py-2 bg-primary text-white text-sm font-semibold rounded-lg shadow hover:bg-primary-dark"
                        >
                            SAVE
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserInformation;
