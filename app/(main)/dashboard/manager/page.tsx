import { checkUserPermission, getCurrentUser } from '@/app/lib/auth'
import { Role } from '@/app/types';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

import React from 'react'

const ManagerPage = async () => {
    const user = await getCurrentUser();
    if (!user || !checkUserPermission(user,Role.ADMIN)){
        redirect('/unauthorized');
    }


    // Fetch managers own team members
    const prismaMyTeamMembers=user.teamId 
    ?  prisma.user.findMany({
            where:{
                teamId:user.teamId,
                role :{ not :Role.ADMIN}
            },
            include:{
                team:true,
            }
        }) : []

    
    // Fetch all team members (cross-team view exclude sensitive fields)
    const prismaAllTeamMembers=prisma.user.findMany({
            where:{
                role :{ not :Role.ADMIN}
            },
            include:{
                team:{
                    select:{
                        id:true,
                        name:true,
                        code:true,
                        description:true
                    }
                },
            orderBy:{
                teamId:"desc"
            }
            }
        }) 


    return (
    <ManagerDashboard myTeamMembers={prismaMyTeamMembers} allTeamMembers={prismaAllTeamMembers} currentUser={user}/>
    )
}

export default ManagerPage