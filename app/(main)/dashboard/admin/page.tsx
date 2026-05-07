import { checkUserPermission, getCurrentUser } from '@/app/lib/auth'
import { Role } from '@/app/types';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

import React from 'react'

const AdminPage = async () => {
    const user = await getCurrentUser();
    if (!user || !checkUserPermission(user,Role.ADMIN)){
        redirect('/unauthorized');
    }

    const [primaUsers, prismaTeams]=await Promise.all([
        prisma.user.findMany({
            include:{
                team:true,
            },
            orderBy:{createdAt:"desc"}
        }),
        prisma.team.findMany({
            include:{
                members:{
                    select:{
                        id:true,
                        name:true,
                        role:true,
                        email: true,
                    }
                }
            }
        })
    ])

    return (
    <AdminDashboard users={primaUsers} teams={prismaTeams} currentUser={user}/>
    )
}

export default AdminPage