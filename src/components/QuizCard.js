// src/components/QuizCard.js
import React, { useState, useEffect } from "react";
import dishes from "../data";

const getRandomOptions = (correctDish, allDishes, count = 4) => {
  const otherDishes = allDishes.filter(d => d.name !== correctDish.name);
  const randomChoices = [...otherDishes]
    .sort(() => 0.5 - Math.random())
    .slice(0, count - 1);

  randomChoices.push(correctDish);
  return randomChoices.sort(() => 0.5 - Math.random());
};

const QuizCard = () => {
  const [usedDishes, setUsedDishes] = useState([]);
  const [currentDish, setCurrentDish] = useState(null);
  const [options, setOptions] = useState([]);
  const [answerResult, setAnswerResult] = useState(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(1);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const generateNewQuestion = () => {
    const remainingDishes = dishes.filter(d => !usedDishes.includes(d.name));

    if (remainingDishes.length === 0) {
      setIsFinished(true);
      return;
    }

    const randomDish = remainingDishes[Math.floor(Math.random() * remainingDishes.length)];
    const newOptions = getRandomOptions(randomDish, dishes);
    setCurrentDish(randomDish);
    setOptions(newOptions);
    setAnswerResult(null);
    setIsAnswered(false);
  };

  useEffect(() => {
    generateNewQuestion();
  }, []);

  const handleAnswer = (selectedName) => {
    if (isAnswered || isFinished) return;
    setIsAnswered(true);

    if (selectedName === currentDish.name) {
      setAnswerResult("✅ 正解！");
      setScore(prev => prev + 1);
    } else {
      setAnswerResult(`❌ 不正解！正解は「${currentDish.name}」です`);
    }

    setUsedDishes(prev => [...prev, currentDish.name]);
  };

  const nextQuestion = () => {
    setQuestionCount(prev => prev + 1);
    generateNewQuestion();
  };

  const resetQuiz = () => {
    setUsedDishes([]);
    setScore(0);
    setQuestionCount(1);
    setIsFinished(false);
    generateNewQuestion();
  };

  if (isFinished) {
    return (
      <div className="quiz-card">
        <button className="reset-button" onClick={resetQuiz}>🔄 リセット</button>
        <h2>全{dishes.length}問終了！</h2>
        <p>あなたのスコア: {score} 点</p>
      </div>
    );
  }

  if (!currentDish) return <div>読み込み中...</div>;

  const imagePath = process.env.PUBLIC_URL + '/' + currentDish.image;

  return (
    <div className="quiz-card">
      {/* 左上に固定するリセットボタン */}
      <button className="reset-button" onClick={resetQuiz}>
        🔄 リセット
      </button>

      <h2>第 {questionCount} 問</h2>
      <p>得点: {score} 点</p>

      <img
        src={imagePath}
        alt="料理画像"
        onError={(e) => {
          e.target.src = process.env.PUBLIC_URL + '/images/placeholder.jpg';
        }}
        style={{ width: "300px", height: "auto", borderRadius: "8px" }}
      />

      <div className="options">
        {options.map((opt, idx) => (
          <button key={idx} onClick={() => handleAnswer(opt.name)} disabled={isAnswered}>
            {opt.name}
          </button>
        ))}
      </div>

      {answerResult && <p style={{ marginTop: "10px", fontWeight: "bold" }}>{answerResult}</p>}

      {isAnswered && (
        <button style={{ marginTop: "10px" }} onClick={nextQuestion}>
          次の問題へ
        </button>
      )}
    </div>
  );
};

export default QuizCard;
