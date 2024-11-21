"use server";

import connectDB from "@/lib/db";
import Recipe from "@/models/Recipe";
import { IRecipeData } from "@/models/Recipe";

export async function getRecipes(): Promise<IRecipeData[]> {
  try {
    await connectDB();
    const recipes = (await Recipe.find({}).lean()) as unknown as IRecipeData[];

    return recipes.map((recipe) => ({
      _id: recipe._id,
      name: recipe.name,
      description: recipe.description,
      difficulty: recipe.difficulty,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
    }));
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw new Error("Failed to fetch recipes");
  }
}
