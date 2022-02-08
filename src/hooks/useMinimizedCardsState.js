import { useState } from 'react';

export function useMinimizedCardsState({
  currentLayout,
  setCurrentLayout,
  useUserLocalStorage,
  cards: initialCards = [],
}) {
  const [cards] = useState(initialCards);
  const [minimizedCardIds, setMinimizedCardId] = useUserLocalStorage('minimizedCardIds', []);
  // The preCurrentLayout is the initial layout when the last card was minimized. This is useful to gracefully restore the card to its initial layout.
  const [preCurrentLayout, setPreCurrentLayout] = useUserLocalStorage('preCurrentLayout', null);
  const minimizedCards = cards.filter((card) => minimizedCardIds.includes(card.id));
  // Filter out the minimized cards which are included in the minimizedCardIds array
  const visibleCards = cards.filter((card) => !minimizedCardIds.includes(card.id));

  /**
   * Minimizes the card for the given card id.
   * @param {string} id - Id title of the card to be minimized.
   */
  const minimizeCard = (id) => {
    const updatedLayout = Object.assign({}, currentLayout);
    setPreCurrentLayout(Object.assign(updatedLayout, preCurrentLayout));

    if (!minimizedCardIds.includes(id)) {
      console.log([...minimizedCardIds, id]);
      setMinimizedCardId([...minimizedCardIds, id]);
    }
  };

  /**
   * Maximizes the card for the given card id.
   * @param {string} id - Id title of the card to be minimized.
   */
  const maximizeCard = (id) => {
    if (minimizedCardIds.includes(id)) {
      const newMinimizedCardIds = minimizedCardIds.filter(minimizedCardId => minimizedCardId !== id);
      setMinimizedCardId(newMinimizedCardIds);
    }

    setCurrentLayout(preCurrentLayout);
  };

  return {
    // Adding the minimizeCard method to each visible card
    visibleCards: visibleCards.map((card) => {
      card.onMinimize = minimizeCard;

      return card;
    }),
    minimizeCard,
    maximizeCard,
    minimizedCards,
    minimizedCardIds,
  };
}