"use server";

import { IRecipeData } from "@/models/Recipe";

export async function searchRecipes(
  recipes: IRecipeData[],
  searchTerm: string
): Promise<IRecipeData[]> {
  const normalizedSearchTerm = searchTerm.toLowerCase().trim();

  if (!normalizedSearchTerm) return recipes;

  return recipes.filter((recipe) => {
    const searchableText = [
      recipe.name,
      recipe.description,
      ...recipe.ingredients,
      ...recipe.steps,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedSearchTerm);
  });
}
