'use client'
import { apiClient } from "@/app/lib/apiClient";
import Link from "next/link";
import { useActionState } from "react";


export type LoginState={
    error?: string;
    success?:boolean;
};


const LoginPage = () => {
    const [state, loginAction,isPending]= useActionState(
        async(prevState:LoginState,formData:FormData):Promise<LoginState> =>{
            const email =formData.get("email") as string;
            const password=formData.get("password") as string;
            
            try{
                await apiClient.login(
                    email,
                    password
                );
                window.location.href="/dashboard"

                return {success: true}
            }

            catch(error){
            console.error("Error: ",error);

            return {
                error: error instanceof Error ? error.message : "Login Failed"
            }
        }
        },
        {error:undefined , success:undefined}
    )



    return (
        <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 w-full max-w-md">
            <form action={loginAction}>
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white">
                        Login to Dashboard
                    </h2>

                    <p className="mt-2 text-sm text-slate-400">
                        Or <Link href="/register" className="font-medium text-blue-400 hover:text-blue-300">Register a new account</Link>
                    </p>
                </div>

                {state?.error && (
                    <div className="bg-red-900/50 border-red-700 text-red-300 px- py-3 rounded mb-4 ">{state.error}</div>
                )}

                <div className="space-y-4">
                    
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email</label>  
                        <input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            required
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-500 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your full email "
                        /> 
                    </div>


                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">Password</label>  
                        <input
                            id="password"
                            type="password"
                            name="password"
                            autoComplete="new-password"
                            required
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-500 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your  password "
                        /> 
                    </div>


                </div>

                <button type="submit" disabled={isPending} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors w-full mt-4 cursor-pointer">
                    {isPending ? "Logging In..." : "Login"}
                </button>

            </form>
        </div>
    )
}

export default LoginPage

