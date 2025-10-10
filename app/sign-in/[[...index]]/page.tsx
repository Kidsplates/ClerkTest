import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return <SignIn signUpUrl="/sign-up" afterSignInUrl="/user" />;
}
// app/sign-in/[[...index]]/page.tsx


// app/sign-up/[[...index]]/page.tsx

