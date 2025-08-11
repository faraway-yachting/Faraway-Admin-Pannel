import YachtsDetail from "@/components/Yachts/Details";

const Yachts = async ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {

    const { id } = await params;

    return (
        <div>
            <YachtsDetail id={id} />
        </div>
    );
};

export default Yachts;