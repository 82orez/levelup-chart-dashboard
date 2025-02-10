import { ChartBarIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function LevelupLogo() {
  return (
    <Link href="/">
      <div className="flex flex-row items-center text-white">
        <ChartBarIcon className="mr-1 h-4 w-4 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 xl:h-14 xl:w-14" />
        <div>
          <p className="hidden whitespace-nowrap hover:underline sm:block md:text-xl lg:text-2xl xl:text-3xl">
            레벨업 <br />
            Dashboard
          </p>
          <p className="block whitespace-nowrap text-xl hover:underline sm:hidden">레벨업 Dashboard</p>
        </div>
      </div>
    </Link>
  );
}
