from flask import Flask, jsonify, render_template
from flask_cors import CORS
from sqlalchemy import create_engine, func
from sqlalchemy.orm import Session
from main import Recipe, Ingredient, Nutrition, Rating, Result

# Database Setup
engine = create_engine('sqlite:///Resources/DessertPaletteRecipesDB.db')

# Create our session (link) from Python to the DB
session = Session(engine)

# Flask Setup
app = Flask(__name__)
CORS(app)


# Define the root route
@app.route('/')
def index():
    # Define a list of available routes in the API
    available_routes = [
        '/api/v1.0/recipes',
        '/api/v1.0/ingredients',
        '/api/v1.0/nutrition',
        '/api/v1.0/ratings',
        '/api/v1.0/results'
    ]
    # Return the list of available routes as a JSON response
    return jsonify({"available_routes": available_routes})


# Define a route to get recipes
@app.route('/api/v1.0/recipes')
def get_recipes():
    session = Session(engine)
    # Modify the query to sort by recipe_name
    results = session.query(Recipe).order_by(Recipe.recipe_name).all()
    # Convert data to JSON
    results_json = [{'id': result.id,
                     'recipe_name': result.recipe_name,
                     'prep_time': result.prep_time,
                     'cook_time': result.cook_time,
                     'total_time': result.total_time,
                     'servings': result.servings,
                     'directions': result.directions,
                     'url': result.url,
                     'cuisine': result.cuisine,
                     'img_src': result.img_src} for result in results]
    session.close()
    return jsonify(results_json)


# Define a route to get ingredients
@app.route('/api/v1.0/ingredients')
def get_ingredients():
    session = Session(engine)
    results = session.query(Ingredient.meal_id, func.group_concat(
        Ingredient.ingredients).label('ingredient_list')).group_by(Ingredient.meal_id).all()
    # Convert data to JSON
    results_json = [{'meal_id': result.meal_id,
                     'ingredients': result.ingredient_list.split(',')
                     } for result in results]
    session.close()
    return jsonify(results_json)


# Define a route to get nutritions
@app.route('/api/v1.0/nutrition')
def get_nutritions():
    session = Session(engine)
    results = session.query(Nutrition).all()
    # Convert data to JSON
    results_json = [{'id': result.id,
                     'meal_id': result.meal_id,
                     'protein': result.protein,
                     'carbohydrate': result.carbohydrate,
                     'fat': result.fat,
                     'dietary_fiber': result.dietary_fiber
                     } for result in results]
    session.close()
    return jsonify(results_json)


# Define a route to get ratings
@app.route('/api/v1.0/ratings')
def get_ratings():
    session = Session(engine)
    results = session.query(Rating).all()
    # Convert data to JSON
    results_json = [{'id': result.id,
                     'meal_id': result.meal_id,
                     'rating': result.rating
                     } for result in results]
    session.close()
    return jsonify(results_json)


# Define a route to get results
@app.route('/api/v1.0/results')
def get_results():
    session = Session(engine)
    results = session.query(Result).all()
    # Convert data to JSON
    results_json = [{'id': result.id,
                     'ingredient': result.ingredient,
                     'avg_rating': result.avg_rating,
                     'avg_total_time': result.avg_total_time
                     } for result in results]
    session.close()
    return jsonify(results_json)


# Run the app if this script is executed
if __name__ == '__main__':
    app.run(port=5000)
