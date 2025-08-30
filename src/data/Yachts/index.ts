import { IconType } from "react-icons";


interface NewYachtsFormField {
  label: string;
  required?: string;
  placeholder?: string;
  type?: "dropdown" | "number" | "text" | "checkbox";
  options?: string[];
  icon?: IconType;
  iconone?: IconType;
}

interface NewYachtsFormSection {
  section: string;
  fields: NewYachtsFormField[];
  btn?: string;
  btnone?: string;
}

export const NewYachtsData: NewYachtsFormSection[] = [
  {
    section: "General",
    fields: [
      { label: "Yacht Type", placeholder: "select type", type: "dropdown",  options: ["crewed", "bareboat"]},
      {
        label: "Boat Type",
        placeholder: "e.g,. Power",
        type: "dropdown",
        options: [
          "Power",
          "Sailing",
        ],
      },
      {
        label: "Category",
        placeholder: "e.g,. Budget",
        type: "dropdown",
        options: [
          "Budget",
          "Midrange",
          "Luxury",
        ],
      },
      {
        label: "Capacity",
        placeholder: "e.g,. Day Charter",
        type: "dropdown",
        options: [
          "Day Charter",
          "Overnight Charter",
          "Day & Overnight Charter",
        ],
      },
      
    ],
  },
  {
    section: "Length Range",
    fields: [
      { label: "< 40", type: "checkbox" },
      { label: "40 To 60", type: "checkbox" },
      { label: "60 To 80", type: "checkbox" },
      { label: "> 80", type: "checkbox" },
      { label: "Title", placeholder: "e.g,. Luxury" },
      { label: "Length", placeholder: "e.g,. 35ft" },
      { label: "Cabins", placeholder: "e.g,. 1" },
      { label: "Bathrooms", placeholder: "e.g,. 2" },
      { label: "Passenger Day Trip", placeholder: "e.g,. 1" },
      { label: "Passenger Overnight", placeholder: "e.g,. 1" },
      { label: "Guests", placeholder: "e.g,. 1" },
      {
        label: "Guests Range",
        required: "*",
        placeholder: "e.g,. ≤6",
        type: "dropdown",
        options: [
          "≤6",
          ">6",
          ">12",
          ">20",
          ">40"
        ],
      },
      { label: "Day Trip Price", placeholder: "e.g,. 30,000 DTP" },
      { label: "Overnight Price", placeholder: "e.g,. 30,000 OP" },
      { label: "Daytrip Price (Euro)", placeholder: "e.g,. 800 EUR" },
      // { label: "Daytrip Price (THB)", placeholder: "e.g,. 800 THB" },
      // { label: "Daytrip Price (USD)", placeholder: "e.g,. 800 USD" },
      { label: "Primary Image", placeholder: "" },
      {
        label: "Video Link",
        placeholder: "e.g,. http://www.youtube.com",
      },
      { label: "Badge", placeholder: "" },
      { label: "Slug", placeholder: "" },
      { label: "Tags", placeholder: "", type:"dropdown" },
    ],
  },
  {
    section: "Yacht Specifications",
    fields: [
      { label: "Design", placeholder: "" },
      { label: "Built", placeholder: "" },
      { label: "Cruising Speed", placeholder: "" },
      { label: "Length Overall", placeholder: "" },
      { label: "Fuel Capacity", placeholder: "" },
      { label: "Water Capacity", placeholder: "" },
      { label: "Code", placeholder: "" },
    
      { label: "Gallery Images", placeholder: "" },
    ],
  },
];

export const RichTextEditorSections = [
  // {
  //   id: "price",
  //   label: "Price",
  //   content: "",
  // },
  // {
  //   id: "tripDetails",
  //   label: "Trip Details",
  //   content: "",
  // },
  {
    id: "dayCharter",
    label: "Day Charter",
    content: "",
  },
  {
    id: "overnightCharter",
    label: "Overnight Charter",
    content: "",
  },
  {
    id: "aboutthisBoat",
    label: "About this Boat",
    content: "",
  },
  {
    id: "specifications",
    label: "Specifications",
    content: "",
  },
  {
    id: "boatLayout",
    label: "Boat Layout",
    content: "",
  },
];

// export const YachtsData: NewYachtsFormSection[] = [
//   {
//     section: "",
//     fields: [
//       {
//         label: "Video Link",
//         placeholder: "e.g,. http://www.youtube.com",
//       },
//       {
//         label: "Video Link 2",
//         placeholder: "e.g,. http://www.youtube.com",
//       },
//       {
//         label: "Video Link 3",
//         placeholder: "e.g,. http://www.youtube.com",
//       },
//       { label: "Badge", placeholder: "" },
//     ],
//   },
//   {
//     section: "Yacht Specifications",
//     fields: [
//       { label: "Design", placeholder: "" },
//       { label: "Built", placeholder: "" },
//       { label: "Cruising Speed", placeholder: "" },
//       { label: "Length Overall", placeholder: "" },
//       { label: "Fuel Capacity", placeholder: "" },
//       { label: "Water Capacity", placeholder: "" },
//       { label: "Code", placeholder: "" },
//       { label: "Type", placeholder: "select type", type: "dropdown",  options: ["crewed", "bareboat"]},
//     ],
//   },
// ];