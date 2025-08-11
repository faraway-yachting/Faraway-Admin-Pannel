"use client";
import React from "react";

interface Props {
  width?: string;
  height?: string;
}

const Google: React.FC<Props> = ({ width = "22", height = "22" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="none"
      viewBox="0 0 25 25"
    >
      <g clipPath="url(#google_svg__a)">
        <path
          fill="#4285F4"
          d="M23.766 12.466c0-.816-.066-1.636-.207-2.439H12.24v4.621h6.482a5.55 5.55 0 0 1-2.399 3.647v2.998h3.867c2.271-2.09 3.576-5.176 3.576-8.827"
        ></path>
        <path
          fill="#34A853"
          d="M12.24 24.19c3.237 0 5.966-1.062 7.955-2.896l-3.867-2.998c-1.076.731-2.465 1.146-4.083 1.146-3.131 0-5.786-2.112-6.738-4.952h-3.99v3.091a12 12 0 0 0 10.723 6.61"
        ></path>
        <path
          fill="#FBBC04"
          d="M5.503 14.49a7.2 7.2 0 0 1 0-4.594V6.805H1.517a12.01 12.01 0 0 0 0 10.776z"
        ></path>
        <path
          fill="#EA4335"
          d="M12.24 4.94a6.52 6.52 0 0 1 4.603 1.798l3.427-3.426A11.53 11.53 0 0 0 12.24.19 12 12 0 0 0 1.517 6.804l3.986 3.091C6.45 7.051 9.109 4.94 12.24 4.94"
        ></path>
      </g>
      <defs>
        <clipPath id="google_svg__a">
          <path fill="#fff" d="M0 .19h24v24H0z"></path>
        </clipPath>
      </defs>
    </svg>
  );
};

export default Google;