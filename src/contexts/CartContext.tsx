import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { MenuItem } from "../api/menu";

type CartContextType = {
  items: Record<string, CartItem>;
  addItem: (item: MenuItem) => void;
  submit: () => void;
  updateCount: (itemName: string, count: number) => void;
  totalPrice: number;
};

const CartContext = createContext<CartContextType>({
  items: {},
  addItem: () => {},
  submit: () => {},
  updateCount: () => {},
  totalPrice: 0,
});

type CartProviderProps = {
  children: React.ReactNode;
};

export interface CartItem {
  item: MenuItem;
  count: number;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<Record<string, CartItem>>({});
  // menuItems
  // Record<itemName, count>

  const addItem = useCallback((item: MenuItem) => {
    return setItems((items) => {
      if (!items[item.name]) {
        items[item.name] = {
          item: item,
          count: 1,
        };
      } else {
        items[item.name] = {
          item: item,
          count: items[item.name].count + 1,
        };
      }
      return { ...items };
    });
  }, []);

  const updateCount = (itemName: string, count: number) => {
    if (count > 0) {
      setItems((items) => {
        items[itemName].count = count;
        return { ...items };
      });
    } else {
      // Remove upon count = 0
      setItems((items) => {
        delete items[itemName];
        return { ...items };
      });
    }
  };

  const submit = () => {
    console.log("submitting order");
    window.alert("Order Placed!");
    setItems({});
  };

  const totalPrice = useMemo(() => {
    let sum = 0;
    Object.values(items).forEach((item) => {
      sum += item.count * item.item.price;
    });
    return sum;
  }, [items]);

  return (
    <CartContext.Provider
      value={{ items, addItem, submit, updateCount, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
