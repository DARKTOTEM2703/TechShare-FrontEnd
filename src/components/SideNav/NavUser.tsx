import Link from 'next/link';
import links from './navlinks.json';
import { FaUserCircle } from 'react-icons/fa';
import fetchData from '@/services/fetchData';
import endpoints from '@/app/infraestructure/config/configAPI';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getToken } from '@/services/storageService';
import { cleanRoleName } from '@/utils/roleFormatter';

interface UserDetails {
    firstName?: string;
    lastName?: string;
    roles?: string[];
}

export default function NavUser({ hamburgerButton }: { hamburgerButton: any }) {
    useAuth();
    const token = getToken();
    const [userName, setUserName] = useState('User Name');
    const [userRole, setUserRole] = useState('Role');

    const fetchUserDetails = () => {
        fetchData(endpoints.users.getUserDetails, token)
            .then((response) => {
                // Manejar tanto objetos como arrays (defensive)
                const user: UserDetails = Array.isArray(response) ? response[0] : response;
                
                if (user && typeof user === 'object' && user.firstName && user.lastName) {
                    setUserName(`${user.firstName} ${user.lastName}`);
                    if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
                        setUserRole(cleanRoleName(user.roles[0]));
                    }
                }
            })
            .catch((error) => {
                console.error('Error fetching user details:', error);
            });
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);

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