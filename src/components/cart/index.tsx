import { useRef, useState, useMemo } from "react";
import { ReactComponent as CartIcon } from "../../assets/cart.svg";
import styles from "./Cart.module.css";
import { cls } from "../../utils";
import { useOnClickOutside } from "../../hooks/use-onclick-outside";
import { CartItem, useCart } from "../../contexts/CartContext";
import { Button } from "../button/Button";
import { createPortal } from "react-dom";
import { useMenuItems } from "../../contexts/MenuItemsContext";
import { MenuItem } from "../../api/menu";

export function CartItemComponent({
  menuItem,
  onCountChange,
  count,
}: {
  menuItem: MenuItem;
  onCountChange: (newVal: number) => void;
  count: number;
}) {
  const subtotal = useMemo(() => {
    return count * menuItem.price;
  }, [count, menuItem.price]);

  return (
    <li className={styles.CartItemComponent}>
      {menuItem.imgUrl ? (
        <img
          src={menuItem.imgUrl}
          alt={menuItem.name}
          style={{
            width: "20px",
            height: "20px",
          }}
        />
      ) : (
        <></>
      )}

      <div className={styles.cartItemName}>
        <span>{menuItem.name}</span>
        <span>
          <b>(${subtotal})</b>
        </span>
      </div>

      <div className={styles.buttons}>
        {count > 1 ? (
          <button
            onClick={() => {
              onCountChange(count - 1);
            }}
            disabled={count < 1}
          >
            -
          </button>
        ) : (
          <button
            onClick={() => {
              onCountChange(count - 1);
            }}
          >
            Delete
          </button>
        )}
        <span className="count">{count}</span>
        <button
          onClick={() => {
            onCountChange(count + 1);
          }}
        >
          +
        </button>
      </div>
    </li>
  );
}

export function Cart() {
  const [isOpen, setIsOpen] = useState(false);

  const flyoutRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useOnClickOutside({
    ref: flyoutRef,
    handler: () => setIsOpen(false),
    captureClicks: false,
    clickCaptureIgnore: [triggerRef],
  });

  const { cartItems, submit, updateCount } = useCart();
  const { items } = useMenuItems();
  console.log(cartItems);

  const totalPrice = useMemo(() => {
    return Object.keys(cartItems).reduce((acc, item) => {
      return acc + cartItems[item] * items[item].price;
    }, 0);
  }, [cartItems, items]);

  return (
    <div style={{ position: "relative" }}>
      <button
        className={styles.button}
        disabled={!cartItems}
        onClick={() => setIsOpen((state) => !state)}
        ref={triggerRef}
      >
        <CartIcon />
      </button>
      {createPortal(
        <div
          ref={flyoutRef}
          className={cls(styles.flyout, !isOpen && styles.closed)}
        >
          {cartItems ? (
            Object.keys(cartItems)?.map((itemName) => (
              <CartItemComponent
                key={itemName}
                menuItem={items[itemName]}
                onCountChange={(newCount) => {
                  updateCount(itemName, newCount);
                }}
                count={cartItems[itemName]}
              />
            ))
          ) : (
            <p>Your order is empty</p>
          )}
          <Button onClick={() => submit()}>
            <div>
              {totalPrice > 0 ? (
                <>
                  <span>Place Order</span>
                  <span>${totalPrice}</span>
                </>
              ) : (
                <span>Submit</span>
              )}
            </div>
          </Button>
        </div>,
        document.body
      )}
    </div>
  );
}
