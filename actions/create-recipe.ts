"use server";

import connectDB from "@/lib/db";
import Recipe from "@/models/Recipe";
import { IRecipeData } from "@/models/Recipe";
import { v4 as uuidv4 } from "uuid";

export async function createRecipe(
  data: Omit<IRecipeData, "_id">
): Promise<IRecipeData | null> {
  try {
    await connectDB();

    // Generate new recipe ID using UUID
    const newId = uuidv4();

    // Create the recipe with generated ID
    const recipe = await Recipe.create({
      _id: newId,
      name: data.name,
      description: data.description,
      difficulty: data.difficulty,
      ingredients: data.ingredients,
      steps: data.steps,
    });

    // Return the created recipe data
    return {
      _id: recipe._id,
      name: recipe.name,
      description: recipe.description,
      difficulty: recipe.difficulty,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
    };
  } catch (error: any) {
    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (err: any) => err.message
      );
      throw new Error(messages.join(". "));
    }

    console.error("Error creating recipe:", error);
    throw new Error(error.message || "Failed to create recipe");
  }
}
