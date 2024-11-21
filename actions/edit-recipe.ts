"use server";

import connectDB from "@/lib/db";
import Recipe from "@/models/Recipe";
import { IRecipeData } from "@/models/Recipe";

export async function editRecipe(
  id: string,
  recipeData: Omit<IRecipeData, "_id">
): Promise<IRecipeData | null> {
  try {
    await connectDB();
    const updatedRecipe = (await Recipe.findOneAndUpdate(
      { _id: id },
      recipeData,
      { new: true, runValidators: true }
    ).lean()) as unknown as IRecipeData | null;

    if (!updatedRecipe) {
      return null;
    }

    return {
      _id: updatedRecipe._id,
      name: updatedRecipe.name,
      description: updatedRecipe.description,
      difficulty: updatedRecipe.difficulty,
      ingredients: updatedRecipe.ingredients,
      steps: updatedRecipe.steps,
    };
  } catch (error) {
    console.error("Error updating recipe:", error);
    throw new Error("Failed to update recipe");
  }
}
