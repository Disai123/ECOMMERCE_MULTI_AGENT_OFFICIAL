from sqlalchemy.orm import Session
import models, auth, database
from database import engine

def seed_db():
    # If using PostgreSQL, we might need a CASCADE drop for dependent objects
    # like foreign keys from tables not defined in our current models.
    from sqlalchemy import text
    
    with engine.connect() as conn:
        try:
            # This is a robust way to clear a dev database in PostgreSQL
            if "postgresql" in str(engine.url):
                conn.execute(text("DROP SCHEMA public CASCADE;"))
                conn.execute(text("CREATE SCHEMA public;"))
                conn.commit()
                print("Database schema reset with CASCADE.")
            else:
                models.Base.metadata.drop_all(bind=engine)
        except Exception as e:
            print(f"Standard drop failed, trying metadata drop: {e}")
            models.Base.metadata.drop_all(bind=engine)

    models.Base.metadata.create_all(bind=engine)
    db = next(database.get_db())

    # Create Admin
    admin = models.User(
        email="admin@shop.com",
        password_hash=auth.get_password_hash("admin123"),
        full_name="System Admin",
        role="admin"
    )
    db.add(admin)

    # Create Customer
    user = models.User(
        email="user@shop.com",
        password_hash=auth.get_password_hash("user123"),
        full_name="John Doe",
        role="customer"
    )
    db.add(user)

    # Sample Products
    products = [
        models.Product(name="Premium Wireless Headphones", description="Noise-cancelling, 40h battery life.", price=299.99, stock_quantity=50, category="Electronics", image_url="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"),
        models.Product(name="Smart Watch Series 7", description="Water-resistant, health tracking.", price=349.99, stock_quantity=30, category="Electronics", image_url="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"),
        models.Product(name="Ergonomic Office Chair", description="Breathable mesh, adjustable height.", price=189.99, stock_quantity=20, category="Furniture", image_url="https://images.unsplash.com/photo-1505744386214-51dba16a26fc?w=500"),
        models.Product(name="Mechanical Keyboard", description="RGB backlit, blue switches.", price=89.99, stock_quantity=100, category="Electronics", image_url="https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500"),
        models.Product(name="Minimalist Desk Lamp", description="Eye-care LED, dimmable levels.", price=45.50, stock_quantity=40, category="Home", image_url="https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=500"),
    ]
    for p in products:
        db.add(p)
    
    db.commit()
    print("Database seeded!")

if __name__ == "__main__":
    seed_db()
