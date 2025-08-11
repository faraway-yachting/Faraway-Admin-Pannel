"use client";

import React from "react";

interface Props {
    width?: string;
    height?: string;
}

const Tick: React.FC<Props> = ({ width = "12", height = "10" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 12 10" fill="none">
            <path d="M3.86663 7.59987L1.06663 4.79987L0.133301 5.7332L3.86663 9.46654L11.8666 1.46654L10.9333 0.533203L3.86663 7.59987Z" fill="currentColor" />
        </svg>
    );
};

export default Tick;