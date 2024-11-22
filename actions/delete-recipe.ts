"use server";

import connectDB from "@/lib/db";
import Recipe from "@/models/Recipe";

export async function deleteRecipe(
  id: string
): Promise<{ success: boolean; message: string }> {
  try {
    await connectDB();

    const deletedRecipe = await Recipe.findByIdAndDelete(id);

    if (!deletedRecipe) {
      return {
        success: false,
        message: "Recipe not found",
      };
    }

    return {
      success: true,
      message: "Recipe deleted successfully",
    };
  } catch (error: any) {
    console.error("Error deleting recipe:", error);
    throw new Error(error.message || "Failed to delete recipe");
  }
}
