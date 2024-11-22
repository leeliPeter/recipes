import { Suspense } from "react";
import { getRecipe } from "@/actions/get-recipe";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Edit } from "lucide-react";

function BackButton() {
  return (
    <Button asChild variant="outline" className="mb-6">
      <Link href="/">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Recipes
      </Link>
    </Button>
  );
}

function RecipeContent({
  recipe,
}: {
  recipe: Awaited<ReturnType<typeof getRecipe>>;
}) {
  if (!recipe) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-sm sm:text-base">Recipe not found</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/95 p-4 sm:p-8 rounded-2xl">
      <div className="space-y-4 sm:space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 sm:gap-4">
              <h1 className="text-2xl sm:text-4xl font-bold">{recipe.name}</h1>
            </div>
            <p className="mt-1 sm:mt-2 text-sm sm:text-lg text-muted-foreground">
              {recipe.description}
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Badge
              variant={
                recipe.difficulty === "Easy"
                  ? "success"
                  : recipe.difficulty === "Medium"
                  ? "warning"
                  : "destructive"
              }
              className="text-xs sm:text-base px-2 sm:px-4 py-0.5 sm:py-1"
            >
              {recipe.difficulty}
            </Badge>
            <Button
              variant="outline"
              size="icon"
              asChild
              className="h-6 w-6 sm:h-8 sm:w-8"
            >
              <Link href={`/recipes/${recipe._id}/edit`}>
                <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="sr-only">Edit recipe</span>
              </Link>
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">
            Ingredients
          </h2>
          <ul className="list-disc pl-4 sm:pl-5 space-y-1 sm:space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="text-sm sm:text-lg">
                {ingredient}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">
            Steps
          </h2>
          <ol className="list-decimal pl-4 sm:pl-5 space-y-2 sm:space-y-4">
            {recipe.steps.map((step, index) => (
              <li key={index} className="text-sm sm:text-lg">
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default async function RecipeDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const recipe = await getRecipe(resolvedParams.id);

  return (
    <div className="recipes min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <BackButton />

        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-100" />
            </div>
          }
        >
          <RecipeContent recipe={recipe} />
        </Suspense>
      </div>
    </div>
  );
}
