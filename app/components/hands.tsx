import Card from './card';

type CardType = {
  suit: string;
  rank: string;
};

type HandsProps = {
  cards: CardType[];
  title: string;
  handValue: number;
};

export default function Hands({ cards, title, handValue }: HandsProps) {
  return (
    <div className="p-4">
      <h2 className="text-2xl mb-2">
        {title}: {handValue}
      </h2>
      <div className="flex flex-col sm:flex-row gap-1">
        {cards.map((card, index) => (
          <Card key={index} card={card} />
        ))}
      </div>
    </div>
  );
}
