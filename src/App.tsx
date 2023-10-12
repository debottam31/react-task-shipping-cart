import "./App.css";
import { Header } from "./components/header/Header";
import { MenuPage } from "./components/menu";
import { CartProvider } from "./contexts/CartContext";
import { MenuItemsContextProvider } from "./contexts/MenuItemsContext";

function App() {
  return (
    <MenuItemsContextProvider>
      <CartProvider>
        <Header />
        <main>
          <MenuPage />
        </main>
      </CartProvider>
    </MenuItemsContextProvider>
  );
}

export default App;
