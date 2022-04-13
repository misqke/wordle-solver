const puppeteer = require("puppeteer");
const answers = require("./answers.json");

const runTest = async () => {
  const browser = await puppeteer.launch({
    // headless: false,
    // slowMo: 10,
  });
  try {
    const page = await browser.newPage();
    await page.goto("http://localhost:3000");

    const guesses = { fails: [] };
    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i].word;
      let guess = "SLATE";
      const currentKnown = {
        0: "",
        1: "",
        2: "",
        3: "",
        4: "",
      };
      let numGuesses = 1;
      while (guess !== answer) {
        const usedLetters = [];
        await page.waitForTimeout(100);
        for (let j = 0; j < answer.length; j++) {
          const [clicks, letter] = await page.evaluate(
            (stuff) => {
              const [j, currentKnown, usedLetters, answer] = stuff;
              const letter = document.querySelector(
                `#letterButton${j}`
              ).innerText;
              if (currentKnown[j] === letter) {
                return [0, letter];
              } else if (letter === answer[j]) {
                return [2, letter];
              } else if (answer.includes(letter)) {
                if (usedLetters.includes(letter)) {
                  return [0, letter];
                } else {
                  usedLetters.push(letter);
                  return [1, letter];
                }
              } else {
                return [0, letter];
              }
            },
            [j, currentKnown, usedLetters, answer]
          );
          if (clicks >= 1) {
            await page.click(`#letterButton${j}`);
            // await page.waitForTimeout(100);
          }
          if (clicks === 2) {
            currentKnown[j] = letter;
            await page.waitForTimeout(100);
            await page.click(`#letterButton${j}`);
          }
        } //end of letter checks and clicks
        await page.click("#submitButton"); // submit input
        await page.waitForTimeout(100);
        const newGuess = await page.evaluate(() => {
          let newGuessWord = "";
          for (let i = 0; i < 5; i++) {
            newGuessWord += document.getElementById(
              `letterButton${i}`
            ).innerText;
          }
          return newGuessWord;
        });
        numGuesses += 1;
        guess = newGuess;
      } // end of while loop
      guesses[numGuesses]
        ? (guesses[numGuesses] += 1)
        : (guesses[numGuesses] = 1);
      if (numGuesses > 6) {
        guesses.fails.push(answer);
      }
      if (i % 100 === 0) {
        console.log(`word #${i}`);
      }
      await page.click("#resetButton");
    }

    console.log(guesses); // log guesses object

    await browser.close();
  } catch (error) {
    console.log(error);
    await browser.close();
  }
};

runTest();
