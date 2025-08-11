"use client";
import React, { useState } from "react";
import { FaRegEyeSlash, FaRegEye  } from "react-icons/fa";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  className?: string;
  error?: boolean;
}

const Input: React.FC<InputProps> = ({ icon, className, type, error = false, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div
      className={`flex items-center gap-2 w-full px-3 h-10 2xl:h-[46px] 3xl:h-[52px] rounded-lg 2xl:rounded-[10px] 3xl:rounded-xl border text-[#1E1E1E] 
        ${error ? "border-[#FF4234]" : "border-[#E7E7E7]"
      }`}
      style={{ boxShadow: "0px 4px 4px 0px #E3E3E340" }}
    >
      {icon && <span>{icon}</span>}
      <input
        className={`${
          type === "file" ? "file-input" : ""
        } bg-white w-full h-full outline-0 text-sm 2xl:text-base 3xl:text-lg text-[#1E1E1E] placeholder:text-[#6D6D6D]  ${className}`}
        {...props}
        type={type === "password" && showPassword ? "text" : type}
      />

      {type === "password" && (
        <span onClick={togglePasswordVisibility} className="text-black-100 cursor-pointer">
          {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
        </span>
      )}
    </div>
  );
};

export default Input;