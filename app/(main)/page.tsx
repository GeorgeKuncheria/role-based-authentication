import Link from 'next/link';
import { getCurrentUser } from '../lib/auth';

const Home = async () => {
    const user=await getCurrentUser();
    return (
        <div className='max-w-4xl mx-auto'>
            <h1 className="text-3xl font-bold mb-6 text-white">
                Team Access Control Demo!
            </h1>
            <p className="text-slate-300 mb-8">
                This is a demo application showcasing role-based access control for teams, built with Next.js 16 and Prisma. 
                Explore the features and see how you can manage team access effectively!            
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className='bg-slate-800 p-6 border border-slate-700 rounded-lg'>
                    <h3 className="font-semibold mb-3 text-white">Features Demonstrated</h3>
                        <ul className='list-disc list-inside space-y-1 text-sm text-slate-300'>
                            <li>Role-based Access Control (RBAC)</li>
                            <li>Route protection with Middleware</li>
                            <li>Server-side permissions Checks</li>
                            <li>Client-side permission hooks</li>
                            <li>Dynamic Route Access</li>
                        </ul>
                </div>

                <div className='bg-slate-800 p-6 border border-slate-700 rounded-lg'>
                    <h3 className="font-semibold mb-3 text-white">User Roles</h3>
                        <ul className='list-disc list-inside space-y-1 text-sm text-slate-300'>
                            <li><strong className='text-purple-300'>Super-Admin: </strong> Full Access To All F eatures</li>
                            <li><strong className='text-blue-300'>Admin: </strong> User & Team Management</li>
                            <li><strong className='text-yellow-300'>Manager: </strong> Team-Specific Management</li>
                            <li><strong className='text-green-300'>User: </strong> Basic Dashboard</li>
                        </ul>
                </div>
            </div>

            {user ? 
                <div className='bg-green-900/30 border border-green-600 rounded-lg  p-4'>
                    <p className='text-green-300'>
                        Welcome back <strong className='text-purple-300'>{user.name}!</strong>{" "} You are logged in as {" "} <strong className='text-green-200'>{user.role}</strong>
                    </p>

                    <Link href="/dashboard" className='inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'>
                        Go to Dashboard
                    </Link>
                </div> 
                : 
                <div className='bg-blue-900/30 border border-blue-600 rounded-lg  p-4'> 
                   <p className='text-slate-300 mb-3'>
                        You are not logged in.
                    </p> 
                    <div className='space-x-3'>
                        <Link href="/login" className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'>
                        Login
                        </Link>
                        <Link href="/register" className='px-4 py-2 border border-slate-600 text-slate-300 rounded hover:bg-blue-700 transition-colors'>
                            Register
                        </Link>
                    </div>
                </div>}
        </div>
    )
}

export default Home