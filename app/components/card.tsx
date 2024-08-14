import { motion } from 'framer-motion';

type CardProps = {
  card?: {
    suit?: string;
    rank?: string;
  };
};

const Card = ({ card }: CardProps) => {
  if (!card) {
    return <div>Card data is missing</div>;
  }

  const { suit = 'Unknown Suit', rank = 'Unknown Rank' } = card;

  return (
    <motion.div
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      className="w-24 h-32 bg-orange-500 border rounded-lg shadow-md flex flex-col items-center justify-items-start text-xl text-slate-800"
    >
      <p className="flex justify-end">{rank}</p>
      <h1 className="text-6xl">{suit}</h1>
    </motion.div>
  );
};

export default Card;
