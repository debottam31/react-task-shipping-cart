import { useRef, useState, useMemo } from "react";
import { ReactComponent as CartIcon } from "../../assets/cart.svg";
import styles from "./Cart.module.css";
import { cls } from "../../utils";
import { useOnClickOutside } from "../../hooks/use-onclick-outside";
import { CartItem, useCart } from "../../contexts/CartContext";
import { Button } from "../button/Button";

export function CartItemComponent({
  cartItem,
  onCountChange,
}: {
  cartItem: CartItem;
  onCountChange: (newVal: number) => void;
}) {
  const subtotal = useMemo(() => {
    return cartItem.count * cartItem.item.price;
  }, [cartItem.count, cartItem.item.price]);

  return (
    <li className={styles.CartItemComponent}>
      {cartItem.item.imgUrl ? (
        <img
          src={cartItem.item.imgUrl}
          alt={cartItem.item.name}
          style={{
            width: "20px",
            height: "20px",
          }}
        />
      ) : (
        <></>
      )}

      <div className={styles.cartItemName}>
        <span>{cartItem.item.name}</span>
        <span>
          <b>(${subtotal})</b>
        </span>
      </div>

      <div className={styles.buttons}>
        {cartItem.count > 1 ? (
          <button
            onClick={() => {
              onCountChange(cartItem.count - 1);
            }}
            disabled={cartItem.count < 1}
          >
            -
          </button>
        ) : (
          <button
            onClick={() => {
              onCountChange(cartItem.count - 1);
            }}
          >
            Delete
          </button>
        )}
        <span className="count">{cartItem.count}</span>
        <button
          onClick={() => {
            onCountChange(cartItem.count + 1);
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

  const { items: cartItems, submit, updateCount, totalPrice } = useCart();

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
      <div
        ref={flyoutRef}
        className={cls(styles.flyout, !isOpen && styles.closed)}
      >
        {cartItems ? (
          Object.values(cartItems)?.map((item) => (
            <CartItemComponent
              key={item.item.name}
              cartItem={item}
              onCountChange={(newCount) => {
                updateCount(item.item.name, newCount);
              }}
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
      </div>
    </div>
  );
}
