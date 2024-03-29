import React from "react";
import Button from "@mui/material/Button";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import "./App.css";
// React
import { useCallback, useEffect, useState } from "react";
// data
import { wordsList } from "./data/words";
// components
import StartScreen from "./components/StartScreen";
import GameOver from "./components/GameOver";
import Game from "./components/Game";

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

const guessesQty = 10;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  const swalGuessedWord = () => {
    Swal.fire({
      title: "Você acertou!",
      html: `A palavra é: ${pickedWord}. 100 pontos adicionados!`,
      icon: "success",
    });
  };

  //escolhendo palavra e categoria
  const pickWordNCategory = useCallback(() => {
    //escolhendo categoria aleatória
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

    //escolhendo palavra aleatoria
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category };
  }, [words]);

  //começar jogo
  const startGame = useCallback(() => {
    clearLetterStates();
    //escolhendo a categoria e a palavra
    const { word, category } = pickWordNCategory(); // declaração de duas variáveis que irão receber, cada uma, os valores advindos da função pickWordNCategory

    // criando array de palavras
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((letters) => letters.toLowerCase());

    //set states
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);
    setGameStage(stages[1].name);
  }, [pickWordNCategory]);

  //processar a letra digitada pelo usuário
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    //verificando se a letra já foi digitada
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    //verificando acertos ou erros
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);
      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

  //useEffect monitora um dado escolhido
  //Checando se as tentativas acabaram
  useEffect(() => {
    if (guesses <= 0) {
      //resetar todos os states
      clearLetterStates();
      //stage=fim do jogo
      setGameStage(stages[2].name);
    }
  }, [guesses]);

  //checando condiçoes de vitória
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    //condição de vitória
    if (guessedLetters.length === uniqueLetters.length && gameStage === stages[1].name ) {
      //add score
      setScore((actualScore) => (actualScore += 100));
      swalGuessedWord();
      // restart game com novas palavras
      startGame();
    }
  }, [guessedLetters, letters, startGame, pickedWord]);

  //reinicia o jogo
  const retryGame = () => {
    setScore(0);
    setGuesses(guessesQty);
    setGameStage(stages[0].name);
  };

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && <GameOver retryGame={retryGame} score={score} />}
    </div>
  );
}

export default App;
