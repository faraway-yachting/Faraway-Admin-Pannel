"use client";

import React from "react";

interface Props {
    width?: string;
    height?: string;
}

const Save: React.FC<Props> = ({ width = "11", height = "12" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 11 12" fill="none">
            <path d="M8.1665 5.33333V9.98L4.83317 8.55333L1.49984 9.98V1.33333H5.49984V0H1.49984C0.766504 0 0.166504 0.6 0.166504 1.33333V12L4.83317 10L9.49984 12V5.33333H8.1665ZM10.8332 2.66667H9.49984V4H8.1665V2.66667H6.83317V1.33333H8.1665V0H9.49984V1.33333H10.8332V2.66667Z" fill="#0080A7" />
        </svg>
    );
};

export default Save;