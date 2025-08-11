import { IconType } from "react-icons";
import { MdEdit } from "react-icons/md";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";


interface SettingsFormSection {
  section: string;
  array?: {
    label: string;
    optional?: string;
    data: string;
  }[];
  btn?: string;
  icon?: IconType;
  btnone?: string;
}

export const SettingsData: SettingsFormSection[] = [
  {
    section: "General Settings Detail",
    array: [
      { label: "Name", data: "Jakon Troff" },
      { label: "Gender", data: "Male" },
      { label: "Phone #", data: "(123) 456 7890" },
      { label: "Address", data: "1285 W.Industrial Drive, Sulte 204 Springfield, OH 45503, USA" },
      { label: "ZIP Code", data: "62701" },
      { label: "Email Address", data: "email@email.com" },
      { label: "Language", data: "English" },
      { label: "Password", data: "********" },
    ],
    btn: "< Back",
    icon: MdEdit,
    btnone: "Edit",
  },
];

interface GeneralSettingsFormField {
  label: string;
  placeholder?: string;
  type?: "dropdown" | "number" | "text";
  options?: string[];
  icon?: IconType;
  iconone?: IconType;
}

interface GeneralSettingsFormSection {
  section: string;
  fields: GeneralSettingsFormField[];
  btn?: string;
  btnone?: string;
}

export const GeneralSettingsData: GeneralSettingsFormSection[] = [
  {
    section: "General Settings",
    fields: [
      { label: "Account Name", placeholder: "Jakob Troff" },
      { label: "Gender", placeholder: "Male" },
      { label: "Phone #", placeholder: "(123) 456-7890" },
      { label: "Address", placeholder: "1234 Maple Street, Springfield, OH 45503, United States" },
      { label: "ZIP Code", placeholder: "62701" },
      { label: "Email Address", placeholder: "email@email.com" },
      {
        label: "Language",
        placeholder: "English",
        type: "dropdown",
        options: [
          "English",
          "French",
          "Hindi"
        ],
      },
      { label: "Current Password", placeholder: "********", type: "number", icon: IoEyeOffOutline, iconone: IoEyeOutline },
      { label: "New Password", placeholder: "********", type: "number", icon: IoEyeOffOutline, iconone: IoEyeOutline },
      { label: "Confirm New Password", placeholder: "********", type: "number", icon: IoEyeOffOutline, iconone: IoEyeOutline },
    ],
    btn: "< Back",
    btnone: "+ Save Changes",
  },
];