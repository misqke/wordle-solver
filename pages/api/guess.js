import answers from "../../answers.json";

export default function handler(req, res) {
  if (req.method === "POST") {
    const { currentAnswer, includedLetters } = req.body;
    const possibleAnswers = [];
    answers.forEach((answer) => {
      let goodWord = true;
      includedLetters.forEach((letter) => {
        if (!answer.word.includes(letter)) {
          goodWord = false;
        }
      });
      for (let i = 0; i < answer.word.length; i++) {
        if (currentAnswer[i].answer.length > 0) {
          if (answer.word[i] !== currentAnswer[i].answer) {
            goodWord = false;
          }
        } else {
          if (currentAnswer[i].wrongs.includes(answer.word[i])) {
            goodWord = false;
          }
        }
      }
      if (goodWord === true) {
        possibleAnswers.push(answer);
      }
    });
    res.status(200).json(possibleAnswers.slice(0, 5));
  } else {
    res.json("Invalid request method");
  }
}
