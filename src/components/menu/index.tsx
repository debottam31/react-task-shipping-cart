import { useEffect, useState, useMemo } from "react";
import styles from "./Menu.module.css";
import { MenuFilters } from "./MenuFilters";
import { MemoizedMenuItems } from "./MenuItems";
import * as api from "../../api/menu";
import { MenuLoadingSkeleton } from "./MenuLoadingSkeleton";
import { useMenuItems } from "../../contexts/MenuItemsContext";

export function MenuPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { addItemsToMenuItemsCatalog, items } = useMenuItems();

  const [menuFilters, setMenuFilters] = useState<
    Awaited<ReturnType<(typeof api)["getMenuFilters"]>>
  >([]);

  useEffect(() => {
    let isMounted = true;

    api.getMenuFilters().then((filters) => {
      if (!isMounted) return;
      setMenuFilters(filters);
    });

    api.getMenuItems().then((items) => {
      if (!isMounted) return;
      addItemsToMenuItemsCatalog(items);
    });

    return () => {
      isMounted = false;
    };
  }, [addItemsToMenuItemsCatalog]);

  const loading = useMemo(() => {
    return !menuFilters?.length || !Object.keys(items).length;
  }, [items, menuFilters?.length]);

  const itemsList = useMemo(() => {
    return Object.values(items);
  }, [items]);

  return (
    <div className={styles.root}>
      <h1>Menu</h1>
      {loading ? (
        <MenuLoadingSkeleton />
      ) : (
        <>
          <MenuFilters
            menuFilters={menuFilters}
            onSelected={(key) => setSelectedFilter(key)}
          />
          <MemoizedMenuItems
            selectedFilter={selectedFilter}
            items={itemsList}
          />
        </>
      )}
    </div>
  );
}
