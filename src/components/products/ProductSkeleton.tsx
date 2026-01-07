import { Card, CardContent, CardFooter } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export const ProductSkeleton = () => {
    return (
      <Card>
        <Skeleton className="aspect-square rounded-b-none" />
        <CardContent className="space-y-3 pt-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-5 w-1/3" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-9 w-full" />
        </CardFooter>
      </Card>
    );
  }
   