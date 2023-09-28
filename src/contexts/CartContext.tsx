import { createContext, useContext, useState } from "react";
import { CartItem, MenuItem } from "../api/menu";

type CartContextType = {
  items: CartItem[];
  addItem: (item: MenuItem) => void;
  submit: () => void;
  handleDecreaseItemQuantity: (itemName: CartItem["name"]) => void;
  handleIncreaseItemQuantity: (itemName: CartItem["name"]) => void;
};

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  submit: () => {},
  handleDecreaseItemQuantity: () => {},
  handleIncreaseItemQuantity: () => {},
});

type CartProviderProps = {
  children: React.ReactNode;
};

export const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (newItem: MenuItem | CartItem) => {
    const alreadyAddedItem = items.find((item) => item.name === newItem.name);

    if (alreadyAddedItem) {
      const updateItems = items.map((item) => {
        if (item.name === newItem.name)
          return { ...item, quantity: item.quantity + 1 };
        return item;
      });
      setItems(updateItems);
    } else {
      setItems([...items, { ...newItem, quantity: 1 }]);
    }
  };

  const submit = () => {
    console.log("submitting order");
    window.alert("Order Placed!");
    setItems([]);
  };

  const handleDecreaseItemQuantity = (itemName: MenuItem["name"]) => {
    const decreasedItem = items.find(
      (item) => item.name === itemName
    ) as CartItem;
    let updatedCartItems = [];

    if (decreasedItem.quantity === 1)
      updatedCartItems = items.filter((item) => item !== decreasedItem);
    else
      updatedCartItems = items.map((item) =>
        item === decreasedItem ? { ...item, quantity: item.quantity - 1 } : item
      );

    setItems(updatedCartItems);
  };

  const handleIncreaseItemQuantity = (itemName: MenuItem["name"]) => {
    const newItem = items.find((item) => item.name === itemName) as CartItem;
    addItem(newItem);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        submit,
        handleDecreaseItemQuantity,
        handleIncreaseItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
