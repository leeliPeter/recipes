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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const updatedRecipe = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        difficulty: formData.get("difficulty") as "Easy" | "Medium" | "Hard",
        ingredients: formData.get("ingredients")?.toString().split("\n") || [],
        steps: formData.get("steps")?.toString().split("\n") || [],
      };

      await editRecipe(recipe._id, updatedRecipe);
      router.push(`/recipes/${recipe._id}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating recipe:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Edit Recipe</h1>
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <Input id="name" name="name" defaultValue={recipe.name} required />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            defaultValue={recipe.description}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="difficulty" className="text-sm font-medium">
            Difficulty
          </label>
          <Select name="difficulty" defaultValue={recipe.difficulty}>
            <SelectTrigger>
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
            className="h-36"
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
            className="h-36"
            defaultValue={recipe.steps.join("\n")}
            required
          />
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
