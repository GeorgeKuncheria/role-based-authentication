import { generateToken, hashPassword } from "@/app/lib/auth";
import { Role } from "@/app/types";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
        try{
             const {name,email,password,teamCode} = await request.json();

            if(!name || !email || !password){ 
                return NextResponse.json({
                    message : 'Name, email and password are required'
                    }, {status : 400});
            }

            //Check if user already exists 
            const existingUser = await prisma.user.findUnique({
                where : {email}
            });


            if (existingUser){
                return NextResponse.json({
                    message : 'User already exists',
                }, {status : 409});
            }


            let teamId : string | undefined;

            if (teamCode){
                const team = await prisma.team.findUnique({
                    where : {code : teamCode}
                });

                if (!team){
                return NextResponse.json({
                    message : 'Please enter a valid team code',
                }, {status : 400});  
                }

                teamId = team.id;
            }

            const hashedPassword =  await hashPassword(password);

            // First USER becomes ADMIN, rest become USER by default.
            const userCount = await prisma.user.count();
            const role = userCount === 0 ? Role.ADMIN : Role.USER;

            const user = await prisma.user.create({
                data : {
                    name,
                    email,
                    password : hashedPassword,
                    teamId,
                    role,
                },
                include :{
                    team : true
                } 
            })

            // Genetate JWT token for the user (you can implement this function as per your auth strategy)
            const token = generateToken(user.id)


            // Creating response
            const response = NextResponse.json({
                user : {
                    id : user.id,
                    name : user.name,
                    email : user.email,
                    role : user.role,
                    teamId : user.teamId,
                    team : user.team,
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
            console.error('Registration error',error);
            return NextResponse.json({
                message : 'An error occurred during registration'
            }, {status : 500});
        }   

        

}