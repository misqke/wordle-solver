# Wordle Solver

A puzzle solver for the popular game Wordle.

Visit the live site [here](https://misqke-wordle-solver.netlify.app/).

## To use

- Enter the word provided by Wordle Solver into your Wordle game
- Click the letters on the Wordle Solver to match the results from your Wordle game and click "Submit"
- Repeat with the new word provided by Wordle Solver

## To install

```bash
git clone https://github.com/misqke/wordle-solver.git
cd wordle-solver
npm install
npm run dev
```

## Testing

With the development server running on port 3000:

```bash
npm run test
```

This runs a puppeteer application that will use the Wordle Solver against all possible Wordle answers.

#### _THIS WILL TAKE SOME TIME TO COMPLETE_

When completed an object will be logged to the console with keys representing the number of guesses taken to solve and values represnting the number of words solved in that number of guesses.

Currently solves 98.96% of Wordle answers within the games allotted 6 guesses.
