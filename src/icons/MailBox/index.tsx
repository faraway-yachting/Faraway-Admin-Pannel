"use client"
import React from "react";

interface Props {
    width?: string;
    height?: string;
}

const MailBox: React.FC<Props> = ({ width = "20", height = "14" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 20 14"
            fill="none"
        >
            <path d="M2 2L8.94 6.3375C9.5885 6.7428 10.4115 6.7428 11.06 6.3375L18 2M3 13H17C18.1046 13 19 12.1046 19 11V3C19 1.89543 18.1046 1 17 1H3C1.89543 1 1 1.89543 1 3V11C1 12.1046 1.89543 13 3 13Z" stroke="#005292" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

export default MailBox;