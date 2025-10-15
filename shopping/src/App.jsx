import React, { useReducer, useMemo, useCallback, useRef } from "react";
import "./App.css";

// ------------------ Reducer Setup ------------------
const initialState = [];

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM":
      const existing = state.find(item => item.id === action.payload.id);
      if (existing) {
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];

    case "REMOVE_ITEM":
      return state
        .map(item =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0);

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
}

// ------------------ Product Component ------------------
const Product = React.memo(({ product, addToCart }) => (
  <div className="product-card">
    <h3>{product.name}</h3>
    <p>{product.price}</p>
    <button onClick={() => addToCart(product)}>Add to Cart</button>
  </div>
));

// ------------------ Main App ------------------
function App() {
  const [cart, dispatch] = useReducer(cartReducer, initialState);
  const checkoutRef = useRef(0);

  // Product data
  const products = [
    { id: 1, name: "T-Shirt", price: 20 },
    { id: 2, name: "Jeans", price: 40 },
    { id: 3, name: "Sneakers", price: 60 },
  ];

  // Memoized functions
  const addToCart = useCallback(
    (product) => dispatch({ type: "ADD_ITEM", payload: product }),
    []
  );

  const removeFromCart = useCallback(
    (id) => dispatch({ type: "REMOVE_ITEM", payload: id }),
    []
  );

  // Memoized totals
  const { totalPrice, discount, finalPrice } = useMemo(() => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = total > 100 ? 10 : 0;
    return {
      totalPrice: total,
      discount: (total * discount) / 100,
      finalPrice: total - (total * discount) / 100,
    };
  }, [cart]);

  // Checkout logic (tracked with useRef)
  const handleCheckout = () => {
    checkoutRef.current += 1;
    alert(
      `Checkout clicked ${checkoutRef.current} time(s).\nFinal total: ${finalPrice.toFixed(
        2
      )}`
    );
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <div className="container"
     style={{
    display: "flex",
    justifyContent: "center", // horizontally center
    alignItems: "center", // vertically center
    height: "100vh", // full screen height
    backgroundColor: "#0f172a",
  }}>
      <div className="cart-card" >
        <h1> Shopping Cart</h1>

        <div className="products-container">
          {products.map((p) => (
            <Product key={p.id} product={p} addToCart={addToCart} />
          ))}
        </div>

        <h2> Cart Summary</h2>
        {cart.length === 0 ? (
          <p className="empty">Your cart is empty.</p>
        ) : (
          <ul className="cart-list">
            {cart.map((item) => (
              <li key={item.id}>
                <span>
                  {item.name} × {item.quantity} = {item.price * item.quantity}
                </span>
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
        )}

        <div className="totals">
          <p>Total: {totalPrice.toFixed(2)}</p>
          <p>Discount: {discount.toFixed(2)}</p>
          <h3>Final Price: {finalPrice.toFixed(2)}</h3>
        </div>

        <button className="checkout-btn" onClick={handleCheckout}>
          Checkout
        </button>
      </div>
    </div>
  );
}

export default App;
