import React from "react";
import styles from "../styles/LetterBox.module.scss";

const LetterBox = ({ letter, handleLetterClick, index, active }) => {
  const handleClick = () => {
    if (letter.result === "none") {
      handleLetterClick(index, "almost");
    } else if (letter.result === "almost") {
      handleLetterClick(index, "correct");
    } else if (letter.result === "correct") {
      handleLetterClick(index, "none");
    }
  };

  return (
    <div
      id={active === true ? `letterButton${index}` : undefined}
      className={`${styles.container} ${
        letter.result === "almost"
          ? styles.almost
          : letter.result === "correct"
          ? styles.correct
          : styles.container
      } ${active ? styles.active : styles.inactive}`}
      onClick={active === true ? handleClick : undefined}
    >
      {letter.letter}
    </div>
  );
};

export default LetterBox;
