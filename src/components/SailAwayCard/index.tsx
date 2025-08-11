import Image from "next/image";


const SailAwayCard: React.FC = () => {

  return (
    <div className="relative w-full">
      <Image src="/images/sailaway.svg" alt="img" width={0} height={917} className="w-full h-[calc(100vh-50px)]" />
    </div>
  );
};

export default SailAwayCard;
