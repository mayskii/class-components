import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, removeItem } from '../selectedItemsSlice';
import Pagination from './Pagination';
import { useTheme } from '../context/useTheme';

interface PokemonDetails {
  description: string;
  types: string[];
  abilities: string[];
  stats: string[];
}

interface Pokemon {
  name: string;
  url: string;
  description?: PokemonDetails;
}

interface SelectedItemsState {
  selectedItems: Pokemon[];
}

interface RootState {
  selectedItems: SelectedItemsState;
}

const Card: React.FC = () => {
  const {
    pokemon,
    detailsLoading,
    details,
    results,
    currentPage,
    totalPages,
    onPageChange,
  } = useOutletContext<{
    pokemon: Pokemon | null;
    details: PokemonDetails | null;
    detailsLoading: boolean;
    results: Pokemon[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }>();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedItems = useSelector(
    (state: RootState) => state.selectedItems.selectedItems
  );

  const { theme } = useTheme();

  const [isRightSectionVisible, setIsRightSectionVisible] =
    useState<boolean>(true);

  useEffect(() => {
    if (pokemon && pokemon.url) {
      setIsRightSectionVisible(true);
    }
  }, [pokemon]);

  const handlePokemonClick = (selectedPokemon: Pokemon) => {
    setIsRightSectionVisible(true);
    navigate(
      `/class-components/${selectedPokemon.name}?search=y&page=1&id=${selectedPokemon.name}&details=1`
    );
  };

  const handlePageChange = (newPage: number) => {
    onPageChange(newPage);
    navigate(`?page=${newPage}`);
  };

  const handleSelectItem = (pokemon: Pokemon) => {
    dispatch(addItem(pokemon));
  };

  const handleUnselectItem = (pokemon: Pokemon) => {
    dispatch(removeItem(pokemon));
  };

  if (!pokemon || !details) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`card ${theme}`}>
      <div className="left-section">
        <div className="pokemon-summary">
          <table className={`card-table ${theme}`}>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Select</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan={2}>No result found</td>
                </tr>
              ) : (
                results.map((pokemon) => (
                  <tr
                    key={pokemon.name}
                    onClick={() => handlePokemonClick(pokemon)}
                    className={`card-item ${selectedItems.some((item) => item.name === pokemon.name) ? 'selected' : ''}`}
                  >
                    <td>{pokemon.name}</td>

                    <td>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();

                          if (
                            selectedItems.some(
                              (item) => item.name === pokemon.name
                            )
                          ) {
                            handleUnselectItem(pokemon);
                          } else {
                            handleSelectItem(pokemon);
                          }
                        }}
                        className={
                          selectedItems.some(
                            (item) => item.name === pokemon.name
                          )
                            ? 'unselect-button'
                            : 'select-button'
                        }
                      >
                        {selectedItems.some(
                          (item) => item.name === pokemon.name
                        )
                          ? 'Unselect'
                          : 'Select'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {isRightSectionVisible && (
        <div className="right-section">
          <h2 className="pokemon-name">{pokemon.name}</h2>
          {detailsLoading ? (
            <div className="loading-indicator">Loading...</div>
          ) : (
            <div className={`info ${theme}`}>
              {detailsLoading && (
                <div className="pokemon-loader-container">
                  <div className="pokemon-loader"></div>
                </div>
              )}
              <div className="pokemon-types">
                <h3>Types</h3>
                <ul>
                  {details?.types.map((type, index) => (
                    <li key={index}>{type}</li>
                  ))}
                </ul>
              </div>
              <div className="pokemon-abilities">
                <h3>Abilities</h3>
                <ul>
                  {details?.abilities.map((ability, index) => (
                    <li key={index}>{ability}</li>
                  ))}
                </ul>
              </div>
              <div className="pokemon-stats">
                <h3>Stats</h3>
                <ul>
                  {details?.stats.map((stat, index) => (
                    <li key={index}>{stat}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
      {totalPages > 1 && (
        <div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default Card;
