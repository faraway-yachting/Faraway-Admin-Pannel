
interface NewTagsFormField {
  label: string;
  placeholder?: string;
  type?: "text";
}

interface NewTagsFormSection {
  section: string;
  fields: NewTagsFormField[];
}

export const NewTagsData: NewTagsFormSection[] = [
  {
    section: "Tags Information",
    fields: [
      { label: "Name", placeholder: "e.g,. Super"},
      {
        label: "Slug",
        placeholder: "e.g,. Main"
      },
      {
        label: "Description",
        placeholder: "e.g,. Lorem ipsum"
      },
      
    ],
  },
];