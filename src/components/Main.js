import React from 'react';
import { useState, useEffect } from 'react';
import Loader from './Loader';
// import useLoading from './useLoading';
// import { questionsUrl } from './constants/url';
import Quiz from './Quiz';
import Footer from './Footer';

function Main() {
  const [quiz, setQuiz] = useState(false);
  const [loader, setLoader] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [category, setCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');

  useEffect(() => {
    let fetchedCategories = async () => {
      try {
        let res = await fetch('https://opentdb.com/api_category.php');
        let data = await res.json();
        if (!res.ok) throw data;
        console.log(data);

        setCategory(data.trivia_categories);
      } catch (error) {
        console.error(error, Error);
      }
    };
    fetchedCategories();
  }, []);

  let handeCategoryChange = (event) => setSelectedCategory(event.target.value);

  let handeDifficulty = (event) => setDifficulty(event.target.value);

  let handleClick = () => {
    const fetchQuestions = async () => {
      const res = await fetch(
        `https://opentdb.com/api.php?amount=10&category=${selectedCategory}&difficulty=${difficulty}&type=multiple`
      );
      const data = await res.json();
      if (!res.ok) {
        throw data;
      }
      setQuestions(data.results);
      console.log(data.results);
    };
    fetchQuestions();
    setLoader(true);
    setQuiz(true);
    setTimeout(() => {
      setLoader(false);
    }, 1000);
  };
  if (!category) return <Loader />;
  return (
    <>
      <center>
        {quiz ? (
          ''
        ) : (
          <>
            <article className="hero">
              <div className="flex center">
                <select onChange={handeCategoryChange}>
                  <option value="" hidden>
                    Select A Category
                  </option>
                  {category.map((cate) => {
                    return (
                      <option key={cate.id} value={cate.id}>
                        {cate.name}
                      </option>
                    );
                  })}
                </select>
                <select onChange={handeDifficulty}>
                  <option value="" hidden>
                    Select Difficulty
                  </option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <button onClick={handleClick} className="start">
                Start Quiz
              </button>
            </article>
          </>
        )}
      </center>

      {loader && <Loader />}

      {quiz && !loader ? (
        <>
          <Quiz questions={questions} /> <Footer />
        </>
      ) : (
        ''
      )}
    </>
  );
}

export default Main;
