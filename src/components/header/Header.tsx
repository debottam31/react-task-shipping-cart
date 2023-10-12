import { Cart } from "../cart";
import styles from "./Header.module.css";

export function Header() {
  return (
    <div className={styles.root}>
      <h1 className={styles.title}>Fred's Diner</h1>
      <Cart />
    </div>
  );
}
