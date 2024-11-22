import { Loader2 } from "lucide-react";

export default function RecipeLoading() {
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
