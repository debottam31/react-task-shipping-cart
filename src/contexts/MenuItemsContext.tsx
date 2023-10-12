import {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import { MenuItem as MenuItemType } from "../api/menu";

type MenuItemsContextType = {
  items: Record<string, MenuItemType>;
  addItemsToMenuItemsCatalog: (items: MenuItemType[]) => void;
};

const MenuItemsContext = createContext<MenuItemsContextType>({
  items: {},
  addItemsToMenuItemsCatalog: () => {},
});

type MenuItemsContextProviderProps = {
  children: React.ReactNode;
};

export const MenuItemsContextProvider = ({
  children,
}: MenuItemsContextProviderProps) => {
  const [items, setItems] = useState<Record<string, MenuItemType>>({});

  const addItemsToMenuItemsCatalog = useCallback(
    (newItems: MenuItemType[]) => {
      const newCatalog = { ...items };
      newItems.forEach((item) => {
        newCatalog[item.name] = item;
      });
      setItems(newCatalog);
    },
    [items]
  );

  return (
    <MenuItemsContext.Provider value={{ items, addItemsToMenuItemsCatalog }}>
      {children}
    </MenuItemsContext.Provider>
  );
};

export const useMenuItems = () => useContext(MenuItemsContext);
