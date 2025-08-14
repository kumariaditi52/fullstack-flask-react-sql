from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

# MySQL connection
db = mysql.connector.connect(
    host="localhost",
    user="root",       # your mysql username
    password="",       # your mysql password
    database="react_crud"
)

cursor = db.cursor(dictionary=True)

# Get all items
@app.route('/items', methods=['GET'])
def get_items():
    cursor.execute("SELECT * FROM items ORDER BY id DESC")
    return jsonify(cursor.fetchall())

# Add new item
@app.route('/items', methods=['POST'])
def add_item():
    data = request.json
    sql = "INSERT INTO items (name, price, brand, description) VALUES (%s, %s, %s, %s)"
    val = (data['name'], data['price'], data['brand'], data['description'])
    cursor.execute(sql, val)
    db.commit()
    return jsonify({"message": "Item added"}), 201

# Update item
@app.route('/items/<int:id>', methods=['PUT'])
def update_item(id):
    data = request.json
    sql = "UPDATE items SET name=%s, price=%s, brand=%s, description=%s WHERE id=%s"
    val = (data['name'], data['price'], data['brand'], data['description'], id)
    cursor.execute(sql, val)
    db.commit()
    return jsonify({"message": "Item updated"})

# Delete item
@app.route('/items/<int:id>', methods=['DELETE'])
def delete_item(id):
    cursor.execute("DELETE FROM items WHERE id=%s", (id,))
    db.commit()
    return jsonify({"message": "Item deleted"})

if __name__ == '__main__':
    app.run(debug=True)
