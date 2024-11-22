import { getRecipe } from "@/actions/get-recipe";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EditRecipeForm from "./edit-form";
import { Suspense } from "react";

function BackButton({ id }: { id: string }) {
  return (
    <Button asChild variant="outline" className="mb-6">
      <Link href={`/recipes/${id}`}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Recipe
      </Link>
    </Button>
  );
}

function EditRecipeContent({
  recipe,
}: {
  recipe: Awaited<ReturnType<typeof getRecipe>>;
}) {
  if (!recipe) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Recipe not found</p>
      </div>
    );
  }

  return <EditRecipeForm recipe={recipe} />;
}

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const recipe = await getRecipe(resolvedParams.id);

  return (
    <div className="recipes min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <BackButton id={resolvedParams.id} />
        <div className="bg-gray-50/95 p-4 md:p-8 rounded-lg shadow-md">
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-100" />
              </div>
            }
          >
            <EditRecipeContent recipe={recipe} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
