"use client";

import React from "react";

export interface IconProps {
    width?: string;
    height?: string;
}

const Dashboard: React.FC<IconProps> = ({ width = "19", height = "19" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 19 19"
            fill="none">
            <path d="M16.5 0.645508H2.5C1.4 0.645508 0.5 1.54551 0.5 2.64551V16.6455C0.5 17.7455 1.4 18.6455 2.5 18.6455H16.5C17.6 18.6455 18.5 17.7455 18.5 16.6455V2.64551C18.5 1.54551 17.6 0.645508 16.5 0.645508ZM2.5 16.6455V2.64551H8.5V16.6455H2.5ZM16.5 16.6455H10.5V9.64551H16.5V16.6455ZM16.5 7.64551H10.5V2.64551H16.5V7.64551Z" fill="currentColor" />
        </svg>
    );
};

export default Dashboard;