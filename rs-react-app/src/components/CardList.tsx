import React from 'react';
import Card from './Card';

interface Item {
  name: string;
  description: string;
}

interface CardListProps {
  items: Item[];
}

const CardList: React.FC<CardListProps> = ({ items }) => {
  return (
    <div>
      {items.length === 0 ? (
        <p>No result found</p>
      ) : (
        items.map((item, index) => (
          <Card key={index} name={item.name} description={item.description} />
        ))
      )}
    </div>
  );
};

export default CardList;
