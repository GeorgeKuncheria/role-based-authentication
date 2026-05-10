import UserDashboard from '@/app/components/dashboard/UserDashboard';
import { checkUserPermission, getCurrentUser } from '@/app/lib/auth'
import { Role, User } from '@/app/types';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

import React from 'react'

const UserPage = async () => {
    const user = await getCurrentUser();
    if (!user){
        redirect('/login');
    }


    // Fetch user specific data
    const teamMembers=user.teamId 
    ?  await prisma.user.findMany({
            where:{
                teamId:user.teamId
            },
            select:{
                id:true,
                name:true,
                email:true,
                role:true
            }
        }) : []


    return (
    <UserDashboard teamMembers={teamMembers as User[]} currentUser={user}/>
    )
}

export default UserPage