import React from 'react';
import Card from './Card';

interface Item {
  name: string;
  description: string;
}

interface CardListProps {
  results: Item[];
}

const CardList: React.FC<CardListProps> = ({ results }) => {
  return (
    <div>
      {results.length === 0 ? (
        <p>No result found</p>
      ) : (
        results.map((item, index) => (
          <Card key={index} name={item.name} description={item.description} />
        ))
      )}
    </div>
  );
};

export default CardList;
