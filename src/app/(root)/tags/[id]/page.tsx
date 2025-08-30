import DetailTags from "@/components/Tags/Details";

const TagsDetails = async ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {

    const { id } = await params;

    return (
        <div>
            <DetailTags id={id} />
        </div>
    );
};

export default TagsDetails;