import { createContext, useContext, useState, useCallback } from "react";
import { MenuItem } from "../api/menu";

type CartContextType = {
  cartItems: Record<string, number>;
  submit: () => void;
  updateCount: (itemName: string, newCount: number) => void;
};

const CartContext = createContext<CartContextType>({
  cartItems: {},
  submit: () => {},
  updateCount: () => {},
});

type CartProviderProps = {
  children: React.ReactNode;
};

export interface CartItem {
  item: MenuItem;
  count: number;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<Record<string, number>>({});

  const updateCount = (itemName: string, count: number) => {
    console.log("Entered updateCount", itemName, count)
    if (count > 0) {
      setCartItems((items) => {
        items[itemName] = count;
        return { ...items };
      });
    } else {
      // Remove upon count = 0
      setCartItems((items) => {
        delete items[itemName];
        return { ...items };
      });
    }
  };

  const submit = () => {
    console.log("submitting order");
    window.alert("Order Placed!");
    setCartItems({});
  };

  return (
    <CartContext.Provider value={{ cartItems, submit, updateCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
