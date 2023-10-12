import { useMemo, memo, useCallback } from "react";
import { useCart } from "../../contexts/CartContext";
import styles from "./MenuItems.module.css";
import { MenuItem as MenuItemType } from "../../api/menu";

type MenuListProps = {
  items: MenuItemType[];
  selectedFilter: string;
};

export function MenuItems({ items, selectedFilter }: MenuListProps) {
  const { addItem } = useCart();

  const handleSelected = useCallback(
    (item: MenuItemType) => {
      addItem(item);
    },
    [addItem]
  );

  const filteredItems2 = useMemo(() => {
    if (selectedFilter === "all") {
      return items;
    }
    return items.filter((item) =>
      item.tags.some((tag) => tag === selectedFilter)
    );
  }, [items, selectedFilter]);

  return (
    <div className={styles.root}>
      {filteredItems2.map((item, idx) => (
        <MemoizedMenuCard
          key={item.name + idx}
          menuItem={item}
          onClick={handleSelected}
        />
      ))}
    </div>
  );
}

const MenuCard = ({
  menuItem,
  onClick,
}: {
  menuItem: MenuItemType;
  onClick: (item: MenuItemType) => void;
}) => {
  return (
    <div className={styles.item} onClick={() => onClick(menuItem)}>
      {menuItem.imgUrl ? (
        <img
          src={menuItem.imgUrl}
          className={styles.image}
          alt={menuItem.name}
        />
      ) : (
        <div className={styles.image} />
      )}
      <div className={styles.right}>
        <span className={styles.title}>{menuItem.name}</span>
        <span className={styles.description}>{menuItem.description}</span>
        <div className={styles.tags}>
          {menuItem.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const MemoizedMenuCard = memo(MenuCard);
