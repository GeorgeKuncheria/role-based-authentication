import { checkUserPermission, getCurrentUser } from "@/app/lib/auth";
import { Role } from "@/app/types";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    request : NextRequest,
    context : {params : Promise<{userId : string}>}
){
    try{
        const {userId} = await context.params;
        const user = await getCurrentUser();

        if (!user || !checkUserPermission(user,Role.ADMIN)){
            return NextResponse.json({
                error : "You are not authorized to assign team"
            },{status: 401});
        }


        const {teamId}= await request.json();

        if (teamId){
            const team = await prisma.team.findUnique({
                where : {id : teamId}
            });

            if (!team){
            return NextResponse.json({
                error : 'Team not found!!',
            }, {status : 404});  
            }
        }

        // Update user's team assignment
        const updatedUser = await prisma.user.update({
            where : {id:userId},
            data: {
                teamId: teamId
            },
            include : {
                team : true
            }
        });

        return NextResponse.json({
            user: updatedUser,
            message : teamId ? "User assigned to team successfully" : "User unassigned from team successfully"
        }, {status : 200});
    }

    catch(error){
        console.error("Error assigning team:", error);
        if (error instanceof Error && error.message.includes("Record to update not found")){
            return NextResponse.json({
                message : "User not found!!"
            }, {status : 404});
        }

        return NextResponse.json({
                message : "Internal Server Error"
            }, {status : 500 });
    }
}