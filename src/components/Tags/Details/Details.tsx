"use client";

import { useRouter } from "next/navigation";
import { MdEdit, MdKeyboardArrowLeft } from "react-icons/md";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/Store/store";

interface CustomersProps {
  goToNextTab: () => void;
}

const Details: React.FC<CustomersProps> = ({ goToNextTab }) => {
  const router = useRouter();
  const { tags } = useSelector((state: RootState) => state.tags);

  const GeneralInfoData = [
    {
      array: [
        { label: "Name", data: tags?.Name || "N/A" },
        { label: "Slug", data: tags?.Slug || "N/A" },
      ],
      iconone: MdKeyboardArrowLeft,
      btn: "Back",
      icon: MdEdit,
      btnone: "Edit",
    },
  ];

  return (
    <div className="flex flex-col justify-between h-[calc(100vh-214px)]">
      <div>
        {GeneralInfoData.map((section, Idx) => (
          <div key={Idx}>
            {section.array && (
              <div className="grid md:grid-cols-2 gap-x-6">
                {section.array
                  .filter((item) => item.data !== "N/A")
                  .map((item, idx) => (
                    <div key={idx} className="flex">
                      <div className="w-1/2">
                        <span className="text-[#222222] font-bold">
                          {item.label}
                        </span>
                      </div>
                      <span className="font-inter font-medium text-[#222222] w-1/2 break-words">
                        {item.data}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
        <div className="mt-4 flex items-center">
          <p className="w-[27rem] text-[#222222] font-bold">Description</p>
          <p className="font-inter font-medium text-[#222222] w-full break-words">
            {tags?.Description}
          </p>
        </div>
      </div>
      <div className="flex justify-between">
        <button
          onClick={() => router.push("/tags")}
          className="rounded-full px-[16px] py-[7px] border border-[#666666] text-[#222222] flex items-center gap-1 justify-center cursor-pointer font-medium"
        >
          <MdKeyboardArrowLeft />
          Back
        </button>
        <button
          onClick={goToNextTab}
          className="rounded-full px-[16px] py-[7px] bg-[#012A50] hover:bg-[#5F5C63] text-white text-center cursor-pointer font-medium flex items-center gap-2"
        >
          <MdEdit />
          Edit
        </button>
      </div>
    </div>
  );
};

export default Details;
