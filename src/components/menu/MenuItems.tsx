import { useMemo, memo, useCallback } from "react";
import { useCart } from "../../contexts/CartContext";
import styles from "./MenuItems.module.css";
import { MenuItem as MenuItemType } from "../../api/menu";

type MenuListProps = {
  items: MenuItemType[];
  selectedFilter: string;
};

function MenuItems({ items, selectedFilter }: MenuListProps) {
  const { cartItems, updateCount } = useCart();

  const handleSelected = useCallback(
    (item: MenuItemType) => {
      updateCount(item.name, (cartItems[item.name] || 0) + 1);
    },
    [cartItems, updateCount]
  );

  const filteredItems = useMemo(() => {
    if (selectedFilter === "all") {
      return items;
    }
    return items.filter((item) =>
      item.tags.some((tag) => tag === selectedFilter)
    );
  }, [items, selectedFilter]);

  return (
    <div className={styles.root}>
      {filteredItems.map((item, idx) => (
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
export const MemoizedMenuItems = memo(MenuItems);
