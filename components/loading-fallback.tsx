import { Skeleton } from "@/components/ui/skeleton";

export function LoadingFallback() {
  return (
    <div className="w-full space-y-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-60" />
        <Skeleton className="h-8 w-40" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl md:hidden lg:block" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
    </div>
  );
}

export function CardLoadingFallback() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Skeleton className="h-48 rounded-xl" />
      <Skeleton className="h-48 rounded-xl" />
      <Skeleton className="h-48 rounded-xl" />
    </div>
  );
}

export function SettingsLoadingFallback() {
  return (
    <div className="mx-auto max-w-full rounded-2xl bg-background p-8">
      <Skeleton className="mb-6 h-10 w-64" />
      <div className="space-y-6">
        <div className="flex gap-4">
          <Skeleton className="h-32 w-32 rounded-full" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
        <Skeleton className="ml-auto h-10 w-36" />
      </div>
    </div>
  );
}
