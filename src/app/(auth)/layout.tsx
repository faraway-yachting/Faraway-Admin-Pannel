"use client";

import { ReactNode } from "react";
import SailAwayCard from "@/components/SailAwayCard";

interface Props {
  children: ReactNode;
}

const AuthLayout: React.FC<Props> = ({ children }) => {
  
  return (
    <div className="max-w-7xl py-2 lg:py-5 mx-auto sm:px-4 flex items-center justify-center h-screen">
      <div className="flex gap-10 xl:gap-15 2xl:gap-20">
        <div className="w-full lg:w-[955px] xl:w-[1150px] sm:mx-auto px-4 space-y-6 flex flex-col justify-between">
          <div className="flex-grow flex items-center">
            <div className="bg-white w-full px-6 space-y-8">{children}</div>
          </div>
        </div>
        <div className="hidden lg:flex items-center justify-end w-full">
          <SailAwayCard />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
