import React from "react";
import styles from "../styles/LoadingBar.module.scss";

const LoadingBar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.loader}></div>
    </div>
  );
};

export default LoadingBar;
