import { comparePassword, generateToken, hashPassword } from "@/app/lib/auth";
import { Role } from "@/app/types";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
        try{
             const {email,password} = await request.json();

            if(!email || !password){ 
                return NextResponse.json({
                    message : 'Email and password are required'
                    }, {status : 400});
            }

            
            const userFromDb = await prisma.user.findUnique({
                where : {email},
                include : {team : true}
            });

            if (!userFromDb){
                return NextResponse.json({
                    message : "Invalid credentials"
                },{status : 401});      
            }


            const isValidPassword =  await comparePassword(password, userFromDb.password);


            if (!isValidPassword){
                return NextResponse.json({
                    message : "Invalid credentials"
                },{status : 401});      
            }

            // Genetate JWT token for the user (you can implement this function as per your auth strategy)
            const token = generateToken(userFromDb.id)


            // Creating response
            const response = NextResponse.json({
                user : {
                    id : userFromDb.id,
                    name : userFromDb.name,
                    email : userFromDb.email,
                    role : userFromDb.role,
                    teamId : userFromDb.teamId,
                    team : userFromDb.team,
                    token
                }
            });

            // Set Cookie

            response.cookies.set('token',token,{
                httpOnly: true,
                secure : process.env.NODE_ENV === 'production',
                sameSite : 'lax',
                maxAge : 60 * 60 * 24 * 7

            })
            

            return response;
        }



        catch(error){
            console.error('Login error',error);
            return NextResponse.json({
                message : 'An error occurred during login'
            }, {status : 500});
        }   

        

}