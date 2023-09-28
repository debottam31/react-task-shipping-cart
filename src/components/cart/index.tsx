import { useEffect, useRef, useState } from "react";
import { ReactComponent as CartIcon } from "../../assets/cart.svg";
import styles from "./Cart.module.css";
import { Button } from "../button/Button";
import { cls } from "../../utils";
import { useOnClickOutside } from "../../hooks/use-onclick-outside";
import { useCart } from "../../contexts/CartContext";
import { CartItem } from "api/menu";

type CartProps = {};

export function Cart(props: CartProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [count, setCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  const flyoutRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useOnClickOutside({
    ref: flyoutRef,
    handler: () => setIsOpen(false),
    captureClicks: false,
    clickCaptureIgnore: [triggerRef],
  });

  const {
    items: cartItems,
    submit,
    handleDecreaseItemQuantity,
    handleIncreaseItemQuantity,
  } = useCart();

  useEffect(() => {
    setItems(cartItems);
    setCount(cartItems.reduce((total, item) => total + item.quantity, 0));
    setCartTotal(
      cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    );
  }, [cartItems]);

  return (
    <div style={{ position: "relative" }}>
      <button
        className={styles.button}
        disabled={!count}
        onClick={() => setIsOpen((state) => !state)}
        ref={triggerRef}
      >
        <CartIcon />
        <p>{count}</p>
      </button>
      <div
        ref={flyoutRef}
        className={cls(styles.flyout, !isOpen && styles.closed)}
      >
        {count ? (
          <ul className={styles.cartItemsList}>
            {items?.map((item) => (
              <li key={item.name} className={styles.cartItem}>
                <div className={styles.cartItemContentWrapper}>
                  <div className={styles.cartItemDescription}>
                    <img
                      src={item.imgUrl}
                      alt={item.name}
                      className={styles.cartItemImage}
                    />

                    <div className={styles.cartItemDetails}>
                      <div>
                        <p className={styles.itemName}>{item.name}</p>
                        <p className={styles.itemDescription}>
                          {item.description}
                        </p>
                      </div>
                      <p className={styles.itemPrice}>{`$ ${(
                        item.price * item.quantity
                      ).toFixed(2)}`}</p>
                    </div>
                  </div>

                  <div className={styles.quantityUpdater}>
                    <button
                      className={styles.qtyButton}
                      onClick={() => handleDecreaseItemQuantity(item.name)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className={styles.qtyButton}
                      onClick={() => handleIncreaseItemQuantity(item.name)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Your order is empty</p>
        )}
        <Button onClick={() => submit()} className={styles.placeOrderButton}>
          <span>Place Order</span>
          <span>{`$ ${cartTotal.toFixed(2)}`}</span>
        </Button>
      </div>
    </div>
  );
}
