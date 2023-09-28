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

  /**
   * Function to handle add item to cart
   * @param newItem item from menu or cart
   */
  const addItem = (newItem: MenuItem | CartItem): void => {
    const alreadyAddedItem = items.find((item) => item.name === newItem.name);
    // increment the quantity of the cart item if one is already present, else add the new item
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

  /**
   * Function to handle checkout
   */
  const submit = () => {
    console.log("submitting order");
    window.alert("Order Placed!");
    setItems([]);
  };

  /**
   * Handle reduce item quantity in the cart
   * @param itemName name of the item, quantity of which to reduce
   */
  const handleDecreaseItemQuantity = (itemName: MenuItem["name"]): void => {
    const decreasedItem = items.find(
      (item) => item.name === itemName
    ) as CartItem;
    let updatedCartItems = [];

    // if item quantity is 1, remove it from cart, else reduce the quantity by 1
    if (decreasedItem.quantity === 1) {
      updatedCartItems = items.filter((item) => item !== decreasedItem);
    } else {
      updatedCartItems = items.map((item) =>
        item === decreasedItem ? { ...item, quantity: item.quantity - 1 } : item
      );
    }

    setItems(updatedCartItems);
  };

  /**
   * Handle increment item quantity in the cart
   * @param itemName name of the item, quantity of which to reduce
   */
  const handleIncreaseItemQuantity = (itemName: MenuItem["name"]): void => {
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
