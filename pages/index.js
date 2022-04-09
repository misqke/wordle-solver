import React, { useState, useEffect } from "react";
import Head from "next/head";
import Row from "../components/Row";
import LoadingBar from "../components/LoadingBar";
import axios from "axios";
import styles from "../styles/Home.module.scss";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
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
    setLoading(true);
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
        "https://misqke-wordle-solver.netlify.app/api/guess",
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
      setLoading(false);
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
        {loading === true && <LoadingBar />}
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
        <span
          className={styles.infoBtn}
          onClick={() => setShowInfo((prev) => !prev)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-info-circle"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
          </svg>
        </span>
        {showInfo === true && (
          <div className={styles.info}>
            <h3>How to use:</h3>
            <ol>
              <li>
                Enter the word provided by Wordle Solver into your Wordle game.
              </li>
              <li>
                Click the letters on the Wordle Solver to match the results from
                your Wordle game and click &quot;Submit&quot;.
              </li>
              <li>Repeat with the new word provided by Wordle Solver.</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
