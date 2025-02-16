import { auth } from '@clerk/nextjs/server';
import { SignedIn } from '@clerk/nextjs';

export default async function Page() {

  const { userId, redirectToSignIn } = await auth()
  if (!userId) {
    return redirectToSignIn();
  } else {
    return (

      <SignedIn>
        <h1 className="text-black">
          Hello, {userId}
        </h1>
      </SignedIn >

    );
  }
}
