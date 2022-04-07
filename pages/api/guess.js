import answers from "../../answers.json";
import words from "../../words.json";
const allWords = [...answers, ...words];

export default function handler(req, res) {
  if (req.method === "POST") {
  } else {
    res.json("Invalid request method");
  }
}
