import React from "react";
import LetterBox from "./LetterBox";
import styles from "../styles/Row.module.scss";

const Row = ({ word, handleLetterClick, active = false }) => {
  return (
    <div className={styles.container}>
      {word.map((letter, i) => (
        <LetterBox
          key={Math.random() + i}
          index={i}
          letter={letter}
          handleLetterClick={handleLetterClick}
          active={active}
        />
      ))}
    </div>
  );
};

export default Row;
