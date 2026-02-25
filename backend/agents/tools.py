from sqlalchemy.orm import Session
from database import SessionLocal
import crud, schemas

def get_product_list(search: str = None, category: str = None):
    """Search for products in the catalog."""
    db = SessionLocal()
    try:
        products = crud.get_products(db, search=search, category=category)
        return [{"id": p.id, "name": p.name, "price": p.price, "stock": p.stock_quantity} for p in products]
    finally:
        db.close()

def add_item_to_cart(user_id: int, product_id: int, quantity: int = 1):
    """Add a specific product to the user's shopping cart."""
    db = SessionLocal()
    try:
        item = schemas.CartItemCreate(product_id=product_id, quantity=quantity)
        crud.add_to_cart(db, user_id=user_id, item=item)
        return f"Successfully added product {product_id} to cart."
    except Exception as e:
        return f"Error adding to cart: {str(e)}"
    finally:
        db.close()

def get_cart_contents(user_id: int):
    """View all items currently in the user's shopping cart."""
    db = SessionLocal()
    try:
        items = crud.get_cart_items(db, user_id=user_id)
        return [{"product": i.product.name, "quantity": i.quantity, "unit_price": i.product.price} for i in items]
    finally:
        db.close()

def perform_checkout(user_id: int, shipping_address: str):
    """Complete the purchase and place an order."""
    db = SessionLocal()
    try:
        order_data = schemas.OrderCreate(shipping_address=shipping_address)
        order = crud.create_order(db, user_id=user_id, order_data=order_data)
        if order:
            return f"Order placed successfully! Order ID: {order.id}, Total: ${order.total_amount}"
        return "Checkout failed. Your cart might be empty."
    except Exception as e:
        return f"Error during checkout: {str(e)}"
    finally:
        db.close()
