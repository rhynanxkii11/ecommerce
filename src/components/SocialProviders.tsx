import Image from "next/image";

type Props = { variant?: "sign-in" | "sign-up" };

export default function SocialProviders({ variant = "sign-in" }: Props) {
  return (
    <div className="flex flex-col gap-2 mb-10">
      <button
        className="flex items-center justify-center gap-3 w-full rounded-md border border-light-300 px-3 py-2 bg-white text-sm hover:bg-light-100"
        aria-label={`${variant === "sign-in" ? "Continue" : "Sign up"} with Google`}
      >
        <Image src="/google.svg" alt="" width={18} height={18} />
        <span>Continue with Google</span>
      </button>

      <button
        className="flex items-center justify-center gap-3 w-full rounded-md border border-light-300 px-3 py-2 bg-white text-sm hover:bg-light-100"
        aria-label={`${variant === "sign-in" ? "Continue" : "Sign up"} with Apple`}
      >
        <Image src="/apple.svg" alt="" width={18} height={18} />
        <span>Continue with Apple</span>
      </button>
    </div>
  );
}