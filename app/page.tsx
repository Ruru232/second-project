'use client';
import { SetStateAction, useState, useEffect } from 'react';
import { combinations } from './components/cardDeck';
import Hands from './components/hands';
import { motion } from 'framer-motion';

export default function Home() {
  // Create game
  const [gameDeck, setGameDeck] = useState(combinations);
  const [playerHand, setPlayerHand] = useState<CardType[]>([]);
  const [dealerHand, setDealerHand] = useState<CardType[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState({ type: '', message: '' });
  const [newGame, setNewGame] = useState(false);

  // Get random card from the deck
  const getRandomCardFromDeck = () => {
    const randomIndex = Math.floor(Math.random() * gameDeck.length);
    const card = gameDeck[randomIndex];
    const newDeck = gameDeck.filter((_, index) => index !== randomIndex);
    setGameDeck(newDeck);
    return card;
  };

  // Deal card to the player
  type CardType = {
    suit: string;
    rank: string;
  };

  const dealCardToPlayer = () => {
    const newHand = [...playerHand, getRandomCardFromDeck()];
    setPlayerHand(newHand);
    const playerValue = calculateHandValue(newHand);
    console.log(newHand);
    console.log(playerValue);
    if (playerValue > 21) {
      handleGameover({ type: 'dealer', message: 'Player Lost, Dealer Wins!' });
    } else if (playerValue === 21) {
      handleGameover({ type: 'player', message: 'Player Win, Dealer Lost!' });
    }
  };

  // Deal card to the dealer
  const playerStand = () => {
    if (gameOver) return; // Prevent further action if the game is over
    setGameOver(true);
    const newHand = [...dealerHand, getRandomCardFromDeck()];
    setDealerHand(newHand);
    const dealerValue = calculateHandValue(newHand);
    console.log(dealerValue);
    if (dealerValue > 21) {
      handleGameover({ type: 'player', message: 'Player Win, Dealer Lost!' });
    }
  };

  const calculateHandValue = (hand: { rank: string }[]) => {
    let value = 0;
    let aceCount = 0;

    hand.forEach((card: { rank: string }) => {
      if (card.rank === 'J' || card.rank === 'Q' || card.rank === 'K') {
        value += 10;
      } else if (card.rank === 'A') {
        aceCount += 1;
        value += 11;
      } else {
        value += parseInt(card.rank);
      }
    });

    while (value > 21 && aceCount > 0) {
      value -= 10;
      aceCount -= 1;
    }

    return value;
  };

  const handleGameover = (
    result: SetStateAction<{ type: string; message: string }>
  ) => {
    setGameOver(true);
    setResult(result);
    setNewGame(true);
  };

  // Reset Game
  const resetGame = () => {
    setPlayerHand([]);
    setDealerHand([]);
    setGameOver(false);
    setResult({ type: '', message: '' });
    setNewGame(false);
    setGameDeck(combinations);
  };

  // Player & dealer's hand value
  const playerValue = calculateHandValue(playerHand);
  const dealerValue = calculateHandValue(dealerHand);

  // Game Logic
  useEffect(() => {
    if (playerHand.length === 0 && dealerHand.length === 0) {
      setPlayerHand([getRandomCardFromDeck(), getRandomCardFromDeck()]);
      setDealerHand([getRandomCardFromDeck()]);
    }
  }, [playerHand, dealerHand]);

  // if player wins on first shuffle
  useEffect(() => {
    if (playerHand.length > 0) {
      const playerValue = calculateHandValue(playerHand);
      const dealerValue = calculateHandValue(dealerHand);

      // Check game results when game is over
      if (gameOver) {
        // Dealer's turn
        let updatedDealerHand = [...dealerHand];
        while (calculateHandValue(updatedDealerHand) < 17) {
          updatedDealerHand = [...updatedDealerHand, getRandomCardFromDeck()];
        }
        setDealerHand(updatedDealerHand);

        const finalPlayerValue = calculateHandValue(playerHand);
        const finalDealerValue = calculateHandValue(updatedDealerHand);

        if (finalPlayerValue > 21) {
          handleGameover({
            type: 'dealer',
            message: 'Player Lost, Dealer Wins!',
          });
        } else if (finalDealerValue > 21) {
          handleGameover({
            type: 'player',
            message: 'Player Wins, Dealer Lost!',
          });
        } else if (finalPlayerValue > finalDealerValue) {
          handleGameover({
            type: 'player',
            message: 'Player Wins, Dealer Lost!',
          });
        } else if (finalPlayerValue < finalDealerValue) {
          handleGameover({
            type: 'dealer',
            message: 'Player Lost, Dealer Wins!',
          });
        } else {
          handleGameover({ type: '', message: "It's a Draw!" });
        }
      }
    }
  }, [gameOver, playerHand, dealerHand]);

  // Flip Animation
  const [flip, setFlip] = useState(true);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex"
      >
        <p
          className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-orange-500 
          backdrop-blur-2xl dark:border-neutral-800 dark:bg-orange-500 lg:relative lg:left-[40%] lg:w-auto 
          lg:rounded-xl lg:border lg:bg-orange-500 lg:p-4"
        >
          Simple Black Jack Game
        </p>
      </motion.div>
      <motion.div
        transition={{ duration: 0.7 }}
        animate={{ rotateY: flip ? 0 : 180 }}
      >
        <motion.div
          transition={{ duration: 0.7 }}
          animate={{ rotateY: flip ? 0 : 180 }}
          className="Card"
        >
          <motion.div
            transition={{ duration: 0.7 }}
            animate={{ rotateY: flip ? 0 : 180 }}
            className="back flex justify-center items-center"
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              onClick={() => setFlip((prevState) => !prevState)}
              className="bg-orange-500 rounded-xl px-6 py-2 mt-10 "
            >
              Start Game
            </motion.button>
          </motion.div>
          <motion.div
            initial={{ rotateY: 180 }}
            animate={{ rotateY: flip ? 180 : 0 }}
            transition={{ duration: 0.7 }}
            className="front"
          >
            <div
              className={`text-white font-bold rounded-md text-center mt-4 py-2 ${
                result && result.type === 'player'
                  ? 'bg-green-600'
                  : 'bg-red-700'
              }`}
            >
              {gameOver && (
                <div
                  className={`text-white ${
                    result && result.type === 'player'
                      ? 'bg-green-600'
                      : 'bg-red-700'
                  } font-bold rounded-md
          text-center py-4`}
                >
                  <h2 className="text-2xl ">{result.message}</h2>
                </div>
              )}
            </div>
            <div className="flex justify-center gap-2">
              <Hands
                cards={playerHand}
                title={"Player's Hand"}
                handValue={playerValue}
              />
              <Hands
                cards={dealerHand}
                title={"Dealer's Hand"}
                handValue={dealerValue}
              />
            </div>
            <div className="flex justify-around gap-2 mt-4">
              {!newGame ? (
                <>
                  <motion.button
                    onClick={dealCardToPlayer}
                    whileHover={{
                      scale: 1.1,
                      textShadow: '0px 0px 8px rgb(255,255,255)',
                      boxShadow: '0px 0px 8px rgb(255,255,255)',
                    }}
                    className="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow-md mr-2"
                  >
                    Hit
                  </motion.button>
                  <motion.button
                    onClick={playerStand}
                    whileHover={{
                      scale: 1.1,
                      textShadow: '0px 0px 8px rgb(255,255,255)',
                      boxShadow: '0px 0px 8px rgb(255,255,255)',
                    }}
                    className="bg-red-600 text-white font-medium px-4 py-2 rounded-lg shadow-md mr-2"
                  >
                    Stand
                  </motion.button>
                </>
              ) : (
                <motion.button
                  onClick={resetGame}
                  whileHover={{
                    scale: 1.1,
                    textShadow: '0px 0px 8px rgb(255,255,255)',
                    boxShadow: '0px 0px 8px rgb(255,255,255)',
                  }}
                  className="bg-green-600 text-white font-medium px-4 py-2 rounded-lg shadow-md mr-2"
                >
                  Reset
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </main>
  );
}
