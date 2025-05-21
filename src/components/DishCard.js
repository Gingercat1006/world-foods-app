// src/components/DishCard.js
import React from "react";

const DishCard = ({ dish }) => {
  // パブリックURLを使用して画像パスを正しく設定
  const imagePath = process.env.PUBLIC_URL + '/' + dish.image;
  
  return (
    <div className="dish-card">
      <img 
        src={imagePath} 
        alt={dish.name} 
        onError={(e) => {
          console.error(`画像の読み込みに失敗しました: ${imagePath}`);
          // プレースホルダー画像がある場合はそれを表示
          e.target.src = process.env.PUBLIC_URL + '/images/placeholder.jpg';
        }}
      />
      <h2>{dish.name}</h2>
      <p>{dish.country}</p>
      <p>{dish.description}</p>
      <p>{dish.price}／{dish.kcal}</p>
    </div>
  );
};

export default DishCard;