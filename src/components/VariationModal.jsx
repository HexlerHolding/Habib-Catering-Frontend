import React, { useState, useMemo } from 'react';
import { FaTimes } from 'react-icons/fa';
import { CURRENCY_SYMBOL } from '../data/globalText';

const VariationModal = ({ item, onClose, onSave }) => {
  const [selectedOptions, setSelectedOptions] = useState(() => {
    // Default: select first option for each variation
    const initial = {};
    (item.variations || []).forEach((variation, idx) => {
      initial[variation.name] = variation.options[0]?.name || '';
    });
    return initial;
  });

  // Calculate total price with additional charges
  const totalPrice = useMemo(() => {
    let price = item.price || 0;
    (item.variations || []).forEach((variation) => {
      const selected = selectedOptions[variation.name];
      const option = variation.options.find(opt => opt.name === selected);
      if (option) price += option.additionalCharge || 0;
    });
    return price;
  }, [item, selectedOptions]);

  const handleOptionChange = (variationName, optionName) => {
    setSelectedOptions(prev => ({ ...prev, [variationName]: optionName }));
  };

  const handleSave = () => {
    // Pass selected variations and total price
    onSave({
      ...item,
      selectedVariations: selectedOptions,
      price: totalPrice,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-modal/50 bg-opacity-40">
      <div className="bg-background rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 cursor-pointer text-accent hover:text-primary text-2xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          <FaTimes size={15} />
        </button>
        {/* Product Image */}
        <div className="flex justify-center mb-4">
          <img
            src={item.image}
            alt={item.name}
            className="w-32 h-32 object-cover rounded-lg shadow border border-primary bg-background"
            onError={e => { e.target.src = '/menu1.jpg'; }}
          />
        </div>
        <h2 className="text-xl font-bold mb-4 text-text text-center">Customize: {item.name}</h2>
        {(item.variations || []).map((variation) => (
          <div key={variation.name} className="mb-4">
            <div className="font-medium text-primary mb-2">{variation.name}</div>
            <div className="flex flex-col gap-2">
              {variation.options.map((option) => (
                <label key={option.name} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name={variation.name}
                    value={option.name}
                    checked={selectedOptions[variation.name] === option.name}
                    onChange={() => handleOptionChange(variation.name, option.name)}
                    className="accent-accent mr-2"
                  />
                  <span className="text-text">
                    {option.name}
                    {option.additionalCharge !== 0 && (
                      <span className="ml-2 text-accent text-sm">
                        {option.additionalCharge > 0 ? `+ ${CURRENCY_SYMBOL}${option.additionalCharge}` : `- ${CURRENCY_SYMBOL}${Math.abs(option.additionalCharge)}`}
                      </span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
        <div className="flex justify-between items-center mt-6">
          <span className="font-bold text-lg text-primary">Total: {CURRENCY_SYMBOL} {totalPrice.toFixed(2)}</span>
          <button
            className="bg-primary cursor-pointer text-secondary px-6 py-2 rounded-lg font-medium hover:bg-primary/80 hover:brightness-105 transition-colors"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default VariationModal;
