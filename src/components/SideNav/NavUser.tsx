import Link from 'next/link';
import links from './navlinks.json';
import { FaUserCircle } from 'react-icons/fa';
import fetchData from '@/services/fetchData';
import endpoints from '@/app/infraestructure/config/configAPI';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getToken } from '@/services/storageService';

export default function NavUser() {
    useAuth();
    const token = getToken();
    const [userName, setUserName] = useState('User Name');
    const [userRole, setUserRole] = useState('Role');

    const fetchUserId = () => {
        fetchData(endpoints.tokens.getUserId, token)
            .then((data) => {
                const userId = data.id;
                fetchUserDetails(userId);
            });
    };

    const fetchUserDetails = (userId: number) => {
        fetchData(`${endpoints.users.getAll}/${userId}`, token)
            .then((user) => {
                setUserName(`${user.firstName} ${user.lastName}`);
                setUserRole(user.roles.join(', '));
            });
    };

    useEffect(() => {
        fetchUserId();
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
            </div>
        </div>
    );
}