'use client';
import { useState, useEffect } from 'react';
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
  const [playerBalance, setPlayerBalance] = useState(1000); // Starting balance
  const [playerBet, setPlayerBet] = useState(0); // Current bet
  const [isBetPlaced, setIsBetPlaced] = useState(false); // Check if the bet is placed

  // Check if the player's balance reaches zero
  useEffect(() => {
    if (playerBalance <= 0) {
      setGameOver(true); // End the game if balance is zero
    }
  }, [playerBalance]);

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

  const handleGameover = (result: { type: string; message: string }) => {
    setGameOver(true);
    setResult(result);

    // Check if the balance has already been updated
    if (!newGame) {
      if (result.type === 'player') {
        setPlayerBalance((prevBalance) => prevBalance + playerBet); // Player wins, add bet to balance
      } else if (result.type === 'dealer') {
        setPlayerBalance((prevBalance) => prevBalance - playerBet); // Player loses, deduct bet
      }

      setNewGame(true); // Mark the game as ended
    }
  };

  // Reset Game
  const resetGame = () => {
    setPlayerHand([]);
    setDealerHand([]);
    setGameOver(false);
    setResult({ type: '', message: '' });
    setNewGame(false);
    setGameDeck(combinations);
    setPlayerBet(0); // Reset bet
    setIsBetPlaced(false); // Allow placing a new bet
  };

  // Player & dealer's hand value
  const playerValue = calculateHandValue(playerHand);
  const dealerValue = calculateHandValue(dealerHand);

  // Game Logic
  useEffect(() => {
    if (isBetPlaced && playerHand.length === 0 && dealerHand.length === 0) {
      setPlayerHand([getRandomCardFromDeck(), getRandomCardFromDeck()]);
      setDealerHand([getRandomCardFromDeck()]);
    }
  }, [isBetPlaced, playerHand, dealerHand]);

  // if player wins on first shuffle
  useEffect(() => {
    if (playerHand.length > 0) {
      const playerValue = calculateHandValue(playerHand);
      const dealerValue = calculateHandValue(dealerHand);

      if (gameOver) {
        let updatedDealerHand = [...dealerHand];

        // Dealer draws until they reach at least 17
        while (calculateHandValue(updatedDealerHand) < 17) {
          updatedDealerHand = [...updatedDealerHand, getRandomCardFromDeck()];
        }

        setDealerHand(updatedDealerHand);

        const finalPlayerValue = calculateHandValue(playerHand);
        const finalDealerValue = calculateHandValue(updatedDealerHand);

        // Determine the winner and call handleGameover
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
                  } font-bold rounded-md text-center py-4`}
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
              {playerBalance > 0 && !newGame ? (
                isBetPlaced ? (
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
                ) : null // Hide Hit and Stand buttons if no bet is placed
              ) : (
                // Reshuffle cards
                <motion.button
                  onClick={resetGame}
                  whileHover={{
                    scale: 1.1,
                    textShadow: '0px 0px 8px rgb(255,255,255)',
                    boxShadow: '0px 0px 8px rgb(255,255,255)',
                  }}
                  className="bg-green-600 text-white font-medium px-4 py-2 rounded-lg shadow-md mr-2"
                >
                  Reshuffle
                </motion.button>
              )}
            </div>
            {/* Betting system */}
            {playerBalance > 0 ? (
              <div className="flex flex-col items-center gap-4 mt-4">
                <div>Player Balance: ${playerBalance}</div>
                {!isBetPlaced ? (
                  <>
                    <div className="flex gap-4">
                      {[1, 10, 100, 500, 1000]
                        .filter((betAmount) => betAmount <= playerBalance)
                        .map((betAmount) => (
                          <motion.button
                            key={betAmount}
                            onClick={() => {
                              const newBet = playerBet + betAmount;
                              if (newBet <= playerBalance) {
                                setPlayerBet(newBet);
                              }
                            }}
                            whileHover={{
                              scale: 1.1,
                              textShadow: '0px 0px 8px rgb(255,255,255)',
                              boxShadow: '0px 0px 12px rgb(255,255,255)',
                            }}
                            className={`flex items-center justify-center w-16 h-16 rounded-full border-4 border-gray-800 bg-gray-900 text-white font-bold text-lg shadow-lg ${
                              playerBet >= betAmount ? 'bg-green-500' : ''
                            }`}
                          >
                            ${betAmount}
                          </motion.button>
                        ))}
                    </div>

                    {/* Display total bet */}
                    <div className="text-white font-bold mt-2">
                      Total Bet: ${playerBet}
                    </div>
                    {/* Clear Bet Button */}
                    <motion.button
                      onClick={() => setPlayerBet(0)} // Clear bet to allow the player to choose again
                      whileHover={{
                        scale: 1.1,
                        textShadow: '0px 0px 8px rgb(255,255,255)',
                        boxShadow: '0px 0px 8px rgb(255,255,255)',
                      }}
                      className="bg-gray-600 text-white font-medium px-6 py-2 rounded-lg mt-2"
                    >
                      Clear Bet
                    </motion.button>
                    {/* Place Bet Button */}
                    <motion.button
                      onClick={() => {
                        if (playerBet >= 1 && playerBet <= playerBalance) {
                          setIsBetPlaced(true);
                        } else {
                          alert(
                            `Bet a chip first! Your Current balance is $${playerBalance}`
                          );
                        }
                      }}
                      whileHover={{
                        scale: 1.1,
                        textShadow: '0px 0px 8px rgb(255,255,255)',
                        boxShadow: '0px 0px 8px rgb(255,255,255)',
                      }}
                      className="bg-orange-600 text-white font-medium px-6 py-2 rounded-lg mt-4"
                    >
                      Place Bet
                    </motion.button>
                  </>
                ) : (
                  <div className="text-white font-bold">
                    Bet Placed: ${playerBet}
                  </div>
                )}
              </div>
            ) : (
              // Show restart button when balance is zero
              <>
                <div className="flex justify-center">
                  <p>Game over your balance is ${playerBalance} </p>
                </div>
                <div className="flex justify-center">
                  <motion.button
                    onClick={() => {
                      setPlayerBalance(1000);
                      resetGame();
                    }}
                    whileHover={{
                      scale: 1.1,
                      textShadow: '0px 0px 8px rgb(255,255,255)',
                      boxShadow: '0px 0px 8px rgb(255,255,255)',
                    }}
                    className="bg-red-600 text-white font-medium px-6 py-2 rounded-lg mt-4"
                  >
                    Restart Game
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </main>
  );
}
