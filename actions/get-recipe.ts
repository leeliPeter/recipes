"use server";

import connectDB from "@/lib/db";
import Recipe from "@/models/Recipe";
import { IRecipeData } from "@/models/Recipe";

export async function getRecipe(id: string): Promise<IRecipeData | null> {
  try {
    await connectDB();
    const recipe = (await Recipe.findOne({
      _id: id,
    }).lean()) as unknown as IRecipeData | null;

    if (!recipe) {
      return null;
    }

    return {
      _id: recipe._id,
      name: recipe.name,
      description: recipe.description,
      difficulty: recipe.difficulty,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
    };
  } catch (error) {
    console.error("Error fetching recipe:", error);
    throw new Error("Failed to fetch recipe");
  }
}
