import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { get } from "http";
import { Prisma } from "@prisma/client";
import { Role } from "@/app/types";
import { prisma } from "@/lib/prisma";

export async function GET(request : NextRequest) {
    try{
        const user = await getCurrentUser();

        if (!user){
            return NextResponse.json({
                message : "You are not authorized to access user information"
            },{status : 401});
        }

        const searchParams = request.nextUrl.searchParams;
        const teamId = searchParams.get("teamId");
        const role = searchParams.get("role");

        // Build where cluase based on user role
        const where : Prisma.UserWhereInput = {};
        
        
        if (user.role === Role.ADMIN){
            // Admin see all users, no additional where clause needed

        }

        else if (user.role === Role.MANAGER){
            // Manager see users in their team OR cross team users  but not cross team managers
            where.OR = [
                { teamId : teamId }, // Users in their team
                { role : Role.USER } // Cross team users
            ];
        }

        else{
            // Regular users only see users in their team
            where.teamId = teamId;
            where.role = {not : Role.ADMIN}; // Exclude admins from regular users view
        }


        // Additional filters
        if (teamId){
            where.teamId = teamId;
        }
        
        if (role){
            where.role = role;
        }


        const users = await prisma.user.findMany({
            where,
            select :{
                id : true,
                email: true,
                name : true,
                role : true,
                team:{
                    select:{
                        id:true,
                        name:true
                    }
                },
                createdAt:true
            },
            orderBy:{
                createdAt : "desc"
            }
        });


        return NextResponse.json(users);
    }

    catch(error){
        console.error("Get users error: ", error);
        return NextResponse.json({
            message : "Internal server error, Something went wrong while fetching users"
        },{status : 500});
    }
}