import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return (
        <div className="flex flex-col items-center justify-center h-screen w-full">
            <div className="w-full max-w-[500px] p-4">
                <SignIn />
            </div>
        </div>

    )

}