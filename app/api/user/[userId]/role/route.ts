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
        const currentUser = await getCurrentUser();

        if (!currentUser || !checkUserPermission(currentUser,Role.ADMIN)){
            return NextResponse.json({
                error : "You are not authorized to assign team"
            },{status: 401});
        }


        // Prevent users from changing thier own role
        if (userId === currentUser.id){
            return NextResponse.json({
                error : "You cannot change your own role"
            },{status: 401});
        }


        const {role}= await request.json();


        //  Validate role
        const validateRole = [Role.USER , Role.MANAGER];
        if (!validateRole.includes(role)){
            return NextResponse.json({
                error : 'Invalid role provided or you cannot have more than one admin role !!',
            }, {status : 400});  
        }


        // Update user's team assignment
        const updatedUser = await prisma.user.update({
            where : {id:userId},
            data: {
                role : role
            },
            include : {
                team : true
            }
        });



        return NextResponse.json({
            user: updatedUser,
            message : `User role updated to ${role} successfully`
        }, {status : 200});
    }

    catch(error){
        console.error("Role assigning error:", error);
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