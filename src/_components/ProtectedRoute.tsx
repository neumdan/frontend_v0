import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { GuardedRoute } from '../types';
import { userAtom } from '../_state';

function GuardedLayout({requiresPermission, requiresRole, redirectPath='/login'}:GuardedRoute) {
    const user = useRecoilValue(userAtom)
    const hasRole = ((user?.roles?.gtr?.includes(requiresRole)) || (typeof requiresRole == "undefined"))
    const hasPermission = ((user?.permissions?.gtr?.includes(requiresPermission)) || (typeof requiresPermission == "undefined"))
    return (hasRole && hasPermission) ? 
    <Outlet /> : 
    <Navigate to={redirectPath}/>;
  };

export { GuardedLayout };
