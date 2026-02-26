import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCartItems, removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
import { selectToken, selectIsAuthenticated } from '../store/slices/authSlice';
import { placeOrder as placeOrderApi } from '../api/orders';
import './Cart.css';

function Cart() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const token = useSelector(selectToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const total = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  const handlePlaceOrder = async () => {
    if (!isAuthenticated || !token) {
      setOrderError('Please log in to place an order.');
      return;
    }
    if (items.length === 0) {
      setOrderError('Cart is empty.');
      return;
    }
    setOrderError(null);
    setPlacing(true);
    try {
      await placeOrderApi(token, items);
      setOrderSuccess(true);
      dispatch(clearCart());
    } catch (err) {
      setOrderError(err.message || 'Order failed');
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="cart-page">
        <h1 className="cart-title">Cart</h1>
        <p className="cart-empty">Your cart is empty.</p>
        <Link to="/" className="cart-link">Browse medicines</Link>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="cart-page">
        <h1 className="cart-title">Order placed</h1>
        <p className="cart-success">Your order was placed successfully.</p>
        <Link to="/" className="cart-link">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1 className="cart-title">Cart</h1>
        <button type="button" className="cart-clear" onClick={() => dispatch(clearCart())}>
          Clear cart
        </button>
      </div>
      {orderError && <p className="cart-order-error">{orderError}</p>}
      <ul className="cart-list">
        {items.map((item) => (
          <li key={item.medicineId} className="cart-item">
            <div className="cart-item-info">
              <span className="cart-item-name">{item.name}</span>
              <span className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
            <div className="cart-item-actions">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  dispatch(updateQuantity({ medicineId: item.medicineId, quantity: Number(e.target.value) || 1 }))
                }
                className="cart-item-qty"
                aria-label={`Quantity for ${item.name}`}
              />
              <button
                type="button"
                className="cart-item-remove"
                onClick={() => dispatch(removeFromCart(item.medicineId))}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="cart-footer">
        <p className="cart-total">Total: ${total.toFixed(2)}</p>
        {!isAuthenticated && (
          <p className="cart-login-hint">
            <Link to="/login">Log in</Link> to place an order.
          </p>
        )}
        <button
          type="button"
          className="cart-place-btn"
          onClick={handlePlaceOrder}
          disabled={placing || items.length === 0}
        >
          {placing ? 'Placing order…' : 'Place order'}
        </button>
        <Link to="/" className="cart-link">Continue shopping</Link>
      </div>
    </div>
  );
}

export default Cart;
