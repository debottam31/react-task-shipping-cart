import { useEffect, useState, useMemo } from "react";
import styles from "./Menu.module.css";
import { MenuFilters } from "./MenuFilters";
import { MenuItems } from "./MenuItems";
import * as api from "../../api/menu";
import { MenuLoadingSkeleton } from "./MenuLoadingSkeleton";

type MenuProps = {};

export function MenuPage(props: MenuProps) {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const [menuFilters, setMenuFilters] = useState<
    Awaited<ReturnType<(typeof api)["getMenuFilters"]>>
  >([]);
  const [menuItems, setMenuItems] = useState<
    Awaited<ReturnType<(typeof api)["getMenuItems"]>>
  >([]);

  useEffect(() => {
    let isMounted = true;

    api.getMenuFilters().then((filters) => {
      if (!isMounted) return;
      setMenuFilters(filters);
    });

    api.getMenuItems().then((items) => {
      if (!isMounted) return;
      setMenuItems(items);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const loading = useMemo(() => {
    return !menuFilters?.length || !menuItems?.length;
  }, [menuFilters?.length, menuItems?.length]);

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
          <MenuItems selectedFilter={selectedFilter} items={menuItems} />
        </>
      )}
    </div>
  );
}
