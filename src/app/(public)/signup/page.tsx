import SignUp from '@/components/sign-up'; // Adjust path if necessary
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sign Up - DeanMachines AI',
    description: 'Create your DeanMachines AI account.',
};

export default function SignupPage() {
    return (
        // Use a similar layout structure as the login page for consistency
        <div className="container flex min-h-[calc(100vh-var(--header-height))] items-center justify-center py-12">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
                    <CardDescription>
                        Join DeanMachines AI to start building and deploying agents.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Render the SignUp component */}
                    <SignUp />
                </CardContent>
            </Card>
        </div>
    );
}
