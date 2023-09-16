from sqlalchemy import create_engine, Column, ForeignKey, Integer, String, Float, TEXT
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class Recipe(Base):
    __tablename__ = 'recipes'

    id = Column(Integer, primary_key=True)
    recipe_name = Column(String(100), nullable=False)
    prep_time = Column(Integer)
    cook_time = Column(Integer)
    total_time = Column(Integer)
    servings = Column(Integer)
    directions = Column(TEXT)
    url = Column(TEXT)
    cuisine = Column(String(100))
    img_src = Column(TEXT)

    def __init__(self, id, recipe_name, prep_time,
                 cook_time, total_time, servings,
                 directions, url, cuisine, img_src):
        self.id = id
        self.recipe_name = recipe_name
        self.prep_time = prep_time
        self.cook_time = cook_time
        self.total_time = total_time
        self.servings = servings
        self.directions = directions
        self.url = url
        self.cuisine = cuisine
        self.img_src = img_src


class Ingredient(Base):
    __tablename__ = 'ingredients'

    id = Column(Integer, primary_key=True)
    meal_id = Column(Integer, ForeignKey('recipes.id'), nullable=False)
    ingredients = Column(String(255))

    def __init__(self, id, meal_id, ingredients):
        self.id = id
        self.meal_id = meal_id
        self.ingredients = ingredients


class Rating(Base):
    __tablename__ = 'ratings'

    id = Column(Integer, primary_key=True)
    meal_id = Column(Integer, ForeignKey('recipes.id'), nullable=False)
    rating = Column(Float, nullable=False)

    def __init__(self, id, meal_id, rating):
        self.id = id
        self.meal_id = meal_id
        self.rating = rating


class Nutrition(Base):
    __tablename__ = 'nutritions'

    id = Column(Integer, primary_key=True)
    meal_id = Column(Integer, ForeignKey('recipes.id'), nullable=False)
    protein = Column(Float)
    carbohydrate = Column(Float)
    fat = Column(Float)
    dietary_fiber = Column(Float)

    def __init__(self, id, meal_id,
                 protein, carbohydrate, fat, dietary_fiber):
        self.id = id
        self.meal_id = meal_id
        self.protein = protein
        self.carbohydrate = carbohydrate
        self.fat = fat
        self.dietary_fiber = dietary_fiber


engine = create_engine('sqlite:///Resources/DessertPaletteRecipesDB.db')
Base.metadata.create_all(engine)
