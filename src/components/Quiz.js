import React, { useState, useEffect } from 'react';

import data from '../data.json';
import Loader from './Loader';
import Result from './Result';
import { ResultContext } from './contexts/ResultContext';

// const duration = data.duration;

function Quiz(props) {
  const [activeIndex, SetActiveIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctOption, setCorrectOption] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);

  const questions = props.questions;

  useEffect(() => {
    function shuffleArray(array) {
      return array.sort(() => Math.random() - 0.5);
    }
    setOptions((prevOption) => {
      if (activeIndex < questions.length) {
        let answers = shuffleArray([
          ...questions[activeIndex].incorrect_answers,
          questions[activeIndex].correct_answer,
        ]);
        return answers;
      }
    });
  }, [activeIndex]);

  console.log(questions);

  if (!questions || questions.length === 0) return <Loader />;

  const correctAnswers = questions.map((question) => {
    return question.correct_answer;
  });

  if (activeIndex === questions.length) {
    return (
      <ResultContext
        value={{
          questions,
          correctAnswers,
          selectedAnswers,
          score,
        }}
      >
        <Result />
      </ResultContext>
    );
  }

  const acitveQuestion = questions[activeIndex];

  let handleNext = () => {
    if (selectedOption === correctOption) {
      setScore((prevScore) => prevScore + 1);
    } else {
      setMistakes((prev) => prev + 1);
    }
    setSelectedAnswers((prevState) => [...prevState, selectedOption]);

    setLoading(true);

    setTimeout(() => {
      setCorrectOption(null);
      setSelectedOption(null);
      setLoading(false); // Hide Loader after question changes
    }, 500); // 1-second delay for smooth transition

    SetActiveIndex((prevIndex) => prevIndex + 1);
  };

  let handleChange = (option) => {
    if (option === questions[activeIndex].correct_answer) {
      setCorrectOption(option);
    }
    setSelectedOption(option);
  };

  return (
    <main>
      <div className="questionContainer">
        <div class="flex">
          <div>Score 💪 : {score}</div>
          <div>{`${activeIndex + 1} of ${questions.length}`}</div>
          <div>Mistakes 😔 : {mistakes} </div>
        </div>
        <div className="progress-bar flex ">
          <div
            className="progress-bar-filled"
            style={{ width: `${(activeIndex / questions.length) * 100}%` }}
          ></div>
          <span>End</span>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <center>
            <h5>{acitveQuestion.question}</h5>
            <ul>
              {options.map((option, i) => (
                <label
                  htmlFor={`answer - ${i}`}
                  key={i}
                  className={selectedOption === option ? 'correct' : ''}
                >
                  <input
                    type="radio"
                    id={`answer - ${i}`}
                    checked={selectedOption === option}
                    onClick={() => handleChange(option)}
                  />
                  {option}
                </label>
              ))}
            </ul>
            <button onClick={handleNext} disabled={!selectedOption}>
              Next
            </button>
          </center>
        )}
      </div>
    </main>
  );
}

export default Quiz;
