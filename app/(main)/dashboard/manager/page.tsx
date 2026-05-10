import ManagerDashboard from '@/app/components/dashboard/ManagerDashboard';
import { checkUserPermission, getCurrentUser } from '@/app/lib/auth'
import { transformTeams, transformUsers } from '@/app/lib/util';
import { Role, User } from '@/app/types';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

const ManagerPage = async () => {
    const user = await getCurrentUser();
    if (!user || !checkUserPermission(user, Role.MANAGER)) {
        redirect('/unauthorized');
    }

    // 1. You MUST await these calls to get the actual array
    const prismaMyTeamMembers = user.teamId 
    ? await prisma.user.findMany({ // Added await here
            where: {
                teamId: user.teamId,
                role: { not: Role.ADMIN }
            },
            include: { team: true }
        }) 
    : [];

    const prismaAllTeamMembers = await prisma.user.findMany({ // Added await here
        where: {
            role: { not: Role.ADMIN }
        },
        include: {
            team: {
                select: {
                    id: true,
                    name: true,
                    code: true,
                    description: true
                }
            }
        },
        orderBy: {
            teamId: "desc"
        }
    });

    // 2. Now that they are actual arrays, your transform functions will work!
    const myTeamMembers = transformUsers(prismaMyTeamMembers);
    
    // NOTE: Check your logic here—prismaAllTeamMembers returns Users, 
    // so you should likely use transformUsers here too, not transformTeams.
    const allTeamMembers = transformUsers(prismaAllTeamMembers);

    return (
        <ManagerDashboard 
            myTeamMembers={myTeamMembers} // Pass the transformed data
            allTeamMembers={allTeamMembers} // Pass the transformed data
            currentUser={user}
        />
    );
}

export default ManagerPage