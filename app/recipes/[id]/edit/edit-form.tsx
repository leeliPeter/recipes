"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { editRecipe } from "@/actions/edit-recipe";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IRecipeData } from "@/models/Recipe";

export default function EditRecipeForm({ recipe }: { recipe: IRecipeData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const updatedRecipe = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        difficulty: formData.get("difficulty") as "Easy" | "Medium" | "Hard",
        ingredients:
          formData.get("ingredients")?.toString().split("\n").filter(Boolean) ||
          [],
        steps:
          formData.get("steps")?.toString().split("\n").filter(Boolean) || [],
      };

      await editRecipe(recipe._id, updatedRecipe);
      router.push(`/recipes/${recipe._id}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating recipe:", error);
      setFormError(
        error instanceof Error ? error.message : "Failed to update recipe"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-4xl font-bold">Edit Recipe</h1>
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name (min. 3 characters)
          </label>
          <Input
            id="name"
            name="name"
            defaultValue={recipe.name}
            required
            className="text-sm sm:text-base"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description (min. 10 characters)
          </label>
          <Textarea
            id="description"
            name="description"
            defaultValue={recipe.description}
            required
            className="text-sm sm:text-base"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="difficulty" className="text-sm font-medium">
            Difficulty
          </label>
          <Select name="difficulty" defaultValue={recipe.difficulty}>
            <SelectTrigger className="text-sm sm:text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="ingredients" className="text-sm font-medium">
            Ingredients (one per line)
          </label>
          <Textarea
            id="ingredients"
            name="ingredients"
            className="h-36 text-sm sm:text-base"
            defaultValue={recipe.ingredients.join("\n")}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="steps" className="text-sm font-medium">
            Steps (one per line)
          </label>
          <Textarea
            id="steps"
            name="steps"
            className="h-36 text-sm sm:text-base"
            defaultValue={recipe.steps.join("\n")}
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Button
          type="submit"
          disabled={loading}
          className="text-sm sm:text-base"
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>

        {formError && (
          <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-xs sm:text-sm">
            {formError}
          </div>
        )}
      </div>
    </form>
  );
}
