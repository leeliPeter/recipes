"use client";

import { useEffect, useState } from "react";
import { getRecipes } from "@/actions/get-recipes";
import { searchRecipes } from "@/actions/search-recipes";
import { IRecipeData } from "@/models/Recipe";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function Home() {
  const [recipes, setRecipes] = useState<IRecipeData[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<IRecipeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getRecipes();
        setRecipes(data);
        setFilteredRecipes(data);
      } catch (err) {
        setError("Failed to fetch recipes");
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-100" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="recipes text-white min-h-screen bg-background p-8">
      <div className="container  mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold mb-8 text-center">
          Recipe Collection
        </h1>

        <div className="max-w-xl py-6 mx-auto mb-8 relative">
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
          <div className="text-center text-muted-foreground text-white font-semibold text-md md:text-2xl">
            No recipes found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {filteredRecipes.map((recipe) => (
              <Card
                key={recipe._id}
                className="flex flex-col cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"
                onClick={() => router.push(`/recipes/${recipe._id}`)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{recipe.name}</CardTitle>
                      <CardDescription className="mt-2">
                        {recipe.description}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        recipe.difficulty === "Easy"
                          ? "success"
                          : recipe.difficulty === "Medium"
                          ? "warning"
                          : "destructive"
                      }
                    >
                      {recipe.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
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
