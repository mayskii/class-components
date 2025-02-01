import React from 'react';

interface Item {
  name: string;
  description: string;
}

interface CardListProps {
  results: Item[];
}

const CardList: React.FC<CardListProps> = ({ results }) => {
  console.log('Rendering results:', results);
  return (
    <div className="card-list-container">
      <table className="card-table">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Item Description</th>
          </tr>
        </thead>
        <tbody>
          {results.length === 0 ? (
            <tr>
              <td colSpan={2}>No result found</td>
            </tr>
          ) : (
            results.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.description}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CardList;
