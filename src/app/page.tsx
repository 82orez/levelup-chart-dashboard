import { ArrowRightIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import { shimmer } from "@/ui/animations";
import LevelupLogo from "@/ui/logo";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-4">
      <div className={`${shimmer} relative overflow-hidden`}>
        {/* <div className="relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-shimmer before:from-transparent before:via-white/60 before:to-transparent"> */}
        <div className="flex h-20 items-center rounded-lg bg-blue-500 p-2">
          <LevelupLogo />
        </div>
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-3/5 md:px-20">
          <p className="text-xl text-gray-800 md:text-3xl md:leading-normal">
            <strong>레벨업 대시보드에 오신걸 환영합니다.</strong> <br />
            Next.js 웹 애플리케이션 성능 분석을 위한 대시보드입니다.
          </p>
          <div className="flex gap-2">
            <Link
              href="/users/sign-in"
              className="flex items-center gap-2 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base">
              로그인 <ArrowRightIcon className="w-5 md:w-2 lg:w-6" />
            </Link>

            <Link
              href="/users/email-sign-in"
              className="flex items-center gap-2 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base">
              이메일 로그인 <ArrowRightIcon className="w-5 md:w-2 lg:w-6" />
            </Link>

            <Link
              href="/users/sign-up"
              className="flex items-center gap-2 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base">
              회원가입 <UserPlusIcon className="w-5 md:w-2 lg:w-6" />
            </Link>
          </div>
        </div>
        <div className="md:px-70 flex items-center justify-center p-6 md:w-4/5 md:py-12">
          <Image
            src="/hero-desktop.png"
            width={1000}
            height={760}
            className="hidden md:block"
            alt="Screenshots of the dashboard project showing desktop version"
          />
          <Image
            src="/hero-mobile.png"
            width={560}
            height={620}
            className="block md:hidden"
            alt="Screenshot of the dashboard project showing mobile version"
          />
        </div>
      </div>
    </main>
  );
}
