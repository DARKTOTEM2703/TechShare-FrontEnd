import { FaUserCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useRoleCheck } from '@/providers/RoleCheckProvider';
import { cleanRoleName } from '@/utils/roleFormatter';

export default function NavUser({ hamburgerButton }: { hamburgerButton: any }) {
    const { userData } = useRoleCheck();
    const [userName, setUserName] = useState('User Name');
    const [userRole, setUserRole] = useState('Role');

    useEffect(() => {
        if (userData && userData.firstName && userData.lastName) {
            setUserName(`${userData.firstName} ${userData.lastName}`);
            if (userData.roles && Array.isArray(userData.roles) && userData.roles.length > 0) {
                setUserRole(cleanRoleName(userData.roles[0]));
            }
        }
    }, [userData]);

    return (
        <div>
            <div className="flex h-[48px] text-secondary grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3">
                <FaUserCircle size={40} />
                <div>
                    <h2 className="font-bold text-primary text-xl">{userName}</h2>
                    <p className="text-base font-semibold text-slate-600">{userRole}</p>
                </div>
                <hr className="" />
                <button onClick={hamburgerButton} className="ml-auto md:hidden">
                    <svg
                        className="w-6 h-6 text-gray-500 hover:text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16m-7 6h7"
                        ></path>
                    </svg>
                </button>
            </div>
        </div>
    );
}