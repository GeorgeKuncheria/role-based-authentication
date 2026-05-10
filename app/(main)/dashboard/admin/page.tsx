import AdminDashboard from '@/app/components/dashboard/AdminDashboard';
import { checkUserPermission, getCurrentUser } from '@/app/lib/auth'
import { transformTeams, transformUsers } from '@/app/lib/util';
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


    const users=transformUsers(primaUsers);
    const teams=transformTeams(prismaTeams)

    return (
    <AdminDashboard users={users} teams={teams} currentUser={user}/>
    )
}

export default AdminPage