import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        <p className="text-sm sm:text-base text-muted-foreground">
          Loading recipes...
        </p>
      </div>
    </div>
  );
}
