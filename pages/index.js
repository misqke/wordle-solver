import React, { useState, useEffect } from "react";
import Head from "next/head";
import Row from "../components/Row";
import axios from "axios";
import styles from "../styles/Home.module.scss";

export default function Home() {
  const [guessNum, setGuessNum] = useState(1);
  const [currentAnswer, setCurrentAnswer] = useState([
    { answer: "", wrongs: [] },
    { answer: "", wrongs: [] },
    { answer: "", wrongs: [] },
    { answer: "", wrongs: [] },
    { answer: "", wrongs: [] },
  ]);
  const [includedLetters, setIncludedLetters] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState([
    { letter: "L", result: "none" },
    { letter: "A", result: "none" },
    { letter: "T", result: "none" },
    { letter: "E", result: "none" },
    { letter: "R", result: "none" },
  ]);

  const handleReset = () => {
    setGuessNum(1);
    setCurrentAnswer([
      { answer: "", wrongs: [] },
      { answer: "", wrongs: [] },
      { answer: "", wrongs: [] },
      { answer: "", wrongs: [] },
      { answer: "", wrongs: [] },
    ]);
    setIncludedLetters([]);
    setGuesses([]);
    setCurrentGuess([
      { letter: "L", result: "none" },
      { letter: "A", result: "none" },
      { letter: "T", result: "none" },
      { letter: "E", result: "none" },
      { letter: "R", result: "none" },
    ]);
  };

  const handleLetterClick = (index, newResult) => {
    setCurrentGuess((prev) => [
      ...prev.slice(0, index),
      { ...prev[index], result: newResult },
      ...prev.slice(index + 1),
    ]);
  };

  const handleSubmit = async () => {
    const usedLetters = [];
    currentGuess.forEach((letter, i) => {
      if (letter.result === "correct") {
        setCurrentAnswer((prev) => [
          ...prev.slice(0, i),
          { ...prev[i], answer: letter.letter },
          ...prev.slice(i + 1),
        ]);
      } else if (letter.result === "almost") {
        usedLetters.push(letter.letter);
        if (!includedLetters.includes(letter.letter)) {
          setIncludedLetters((prev) => [...prev, letter.letter]);
        }
        const wrongCheckIndex = currentAnswer[i].wrongs.indexOf(letter.letter);
        if (wrongCheckIndex === -1) {
          setCurrentAnswer((prev) => [
            ...prev.slice(0, i),
            { ...prev[i], wrongs: [...prev[i].wrongs, letter.letter] },
            ...prev.slice(i + 1),
          ]);
        }
      } else if (letter.result === "none") {
        if (!usedLetters.includes(letter.letter)) {
          currentAnswer.forEach((answer, i) => {
            setCurrentAnswer((prev) => [
              ...prev.slice(0, i),
              { ...prev[i], wrongs: [...prev[i].wrongs, letter.letter] },
              ...prev.slice(i + 1),
            ]);
          });
        }
      }
    });
    setGuessNum((prev) => prev + 1);
  };

  useEffect(() => {
    const makeGuess = async (currentAnswer, includedLetters) => {
      const res = await axios.post(
        process.env.MODE === "development"
          ? "http://localhost:3000/api/guess"
          : "https://misqke-wordle-solver.netlify.app/api/guess",
        {
          currentAnswer,
          includedLetters,
        }
      );
      const newWord = res.data[0].word;
      let newGuess = [];
      for (let i = 0; i < newWord.length; i++) {
        newGuess.push({
          letter: newWord[i],
          result: `${
            currentAnswer[i].answer === newWord[i] ? "correct" : "none"
          }`,
        });
      }
      setGuesses((prev) => [...prev, currentGuess]);
      setCurrentGuess(newGuess);
    };
    if (guessNum > 1) {
      makeGuess(currentAnswer, includedLetters);
    }
  }, [currentAnswer, includedLetters, guessNum]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Wordle Solver</title>
        <meta name="description" content="An app to solve wordle" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.box}>
        <div className={styles.text}>
          <h1>Wordle Solver</h1>
        </div>
        {guesses.length > 0 &&
          guesses.map((guess, i) => (
            <Row
              key={Math.random() + i}
              word={guess}
              handleLetterClick={handleLetterClick}
            />
          ))}
        <Row word={currentGuess} handleLetterClick={handleLetterClick} active />
        <button className={styles.btn} type="button" onClick={handleSubmit}>
          Submit
        </button>
        <button
          className={`${styles.btn} ${styles.reset}`}
          type="button"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
