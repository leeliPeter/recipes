"use client";

import { useEffect, useState } from "react";
import { getRecipes } from "@/actions/get-recipes";
import { searchRecipes } from "@/actions/search-recipes";
import { createRecipe } from "@/actions/create-recipe";
import { IRecipeData } from "@/models/Recipe";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Search, Plus, Trash2 } from "lucide-react";
import { deleteRecipe } from "@/actions/delete-recipe";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Home() {
  const [recipes, setRecipes] = useState<IRecipeData[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<IRecipeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getRecipes();
        setRecipes(data);
        setFilteredRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch recipes"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    const results = await searchRecipes(recipes, term);
    setFilteredRecipes(results);
  };

  const handleCreateRecipe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);
    setFormError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const recipeData = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        difficulty: formData.get("difficulty") as "Easy" | "Medium" | "Hard",
        ingredients:
          formData.get("ingredients")?.toString().split("\n").filter(Boolean) ||
          [],
        steps:
          formData.get("steps")?.toString().split("\n").filter(Boolean) || [],
      };

      await createRecipe(recipeData);
      setDialogOpen(false);
      const updatedRecipes = await getRecipes();
      setRecipes(updatedRecipes);
      setFilteredRecipes(updatedRecipes);
      router.refresh();
    } catch (error) {
      console.error("Error creating recipe:", error);
      setFormError(
        error instanceof Error ? error.message : "Failed to create recipe"
      );
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteRecipe = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);

    try {
      const result = await deleteRecipe(id);
      if (result.success) {
        const updatedRecipes = await getRecipes();
        setRecipes(updatedRecipes);
        setFilteredRecipes(updatedRecipes);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete recipe"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="recipes min-h-screen  bg-background p-4 sm:p-8">
        <div className="container mx-auto h-screen flex items-center justify-center ">
          <div className="bg-gray-50/90 w-xl p-4 sm:p-8 rounded-2xl">
            <div className="flex flex-col items-center justify-center min-h-[10vh] gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
              <p className="text-sm sm:text-base text-muted-foreground">
                Loading recipe details...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-sm sm:text-base">{error}</p>
      </div>
    );
  }

  return (
    <div className="recipes text-white min-h-screen bg-background p-4 sm:p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold">Recipe Collection</h1>

          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) setFormError(null);
            }}
          >
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Add Recipe
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl rounded-2xl w-[90vw] md:w-full max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">
                  Add New Recipe
                </DialogTitle>
              </DialogHeader>
              <form
                onSubmit={handleCreateRecipe}
                className="space-y-4 sm:space-y-6"
              >
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-xs sm:text-sm font-medium"
                  >
                    Name (min. 3 characters)
                  </label>
                  <Input
                    id="name"
                    name="name"
                    required
                    minLength={3}
                    placeholder="Recipe name"
                    className="text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="description"
                    className="text-xs sm:text-sm font-medium"
                  >
                    Description (min. 10 characters)
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    required
                    minLength={10}
                    placeholder="Recipe description"
                    className="text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="difficulty"
                    className="text-xs sm:text-sm font-medium"
                  >
                    Difficulty
                  </label>
                  <Select name="difficulty" required>
                    <SelectTrigger className="text-sm sm:text-base">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy" className="text-sm sm:text-base">
                        Easy
                      </SelectItem>
                      <SelectItem
                        value="Medium"
                        className="text-sm sm:text-base"
                      >
                        Medium
                      </SelectItem>
                      <SelectItem value="Hard" className="text-sm sm:text-base">
                        Hard
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="ingredients"
                    className="text-xs sm:text-sm font-medium"
                  >
                    Ingredients (one per line, min. 3 characters each)
                  </label>
                  <Textarea
                    id="ingredients"
                    name="ingredients"
                    required
                    className="h-32 text-sm sm:text-base"
                    placeholder="Enter ingredients (one per line)"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="steps"
                    className="text-xs sm:text-sm font-medium"
                  >
                    Steps (one per line, min. 10 characters each)
                  </label>
                  <Textarea
                    id="steps"
                    name="steps"
                    required
                    className="h-32 text-sm sm:text-base"
                    placeholder="Enter steps (one per line)"
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <Button
                    type="submit"
                    disabled={creating}
                    className="text-sm sm:text-base"
                  >
                    {creating ? "Creating..." : "Create Recipe"}
                  </Button>

                  {formError && (
                    <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-xs sm:text-sm">
                      {formError}
                    </div>
                  )}
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="max-w-xl mx-auto mb-8 relative">
          <Input
            type="search"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-white text-black placeholder:text-gray-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>

        {filteredRecipes.length === 0 ? (
          <div className="text-center text-sm sm:text-base text-muted-foreground">
            No recipes found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredRecipes.map((recipe) => (
              <Card
                key={recipe._id}
                className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow relative group"
                onClick={() => router.push(`/recipes/${recipe._id}`)}
              >
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex justify-between w-full  items-start">
                    <div>
                      <CardTitle className="text-lg  truncate max-w-[175px] lg:max-w-[180px] xl:max-w-[200px]  ">
                        {recipe.name}
                      </CardTitle>
                      <CardDescription className="mt-1 sm:mt-2 text-xs sm:text-sm max-w-[180px] lg:max-w-[150px] xl:max-w-[200px]  overflow-hidden text-ellipsis [-webkit-line-clamp:2] [-webkit-box-orient:vertical] [display:-webkit-box] min-h-[2.5em]">
                        {recipe.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          recipe.difficulty === "Easy"
                            ? "success"
                            : recipe.difficulty === "Medium"
                            ? "warning"
                            : "destructive"
                        }
                        className="text-xs"
                      >
                        {recipe.difficulty}
                      </Badge>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className=""
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete &quot;
                              {recipe.name}&quot;? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              onClick={(e) => e.stopPropagation()}
                            >
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={(e) => handleDeleteRecipe(recipe._id, e)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {recipe.ingredients.length} ingredients •{" "}
                    {recipe.steps.length} steps
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
