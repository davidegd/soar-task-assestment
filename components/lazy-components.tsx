import { lazy, Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export const LazyQuickTransfer = lazy(() =>
  import("@/components/dashboard/quick-transfer").then((mod) => ({
    default: mod.QuickTransfer,
  }))
)

export const LazyEditableAvatar = lazy(() =>
  import("@/components/settings/edit-avatar").then((mod) => ({
    default: mod.EditableAvatar,
  }))
)

export function QuickTransferLazy(props: any) {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
      <LazyQuickTransfer {...props} />
    </Suspense>
  )
}

export function EditableAvatarLazy(props: any) {
  return (
    <Suspense fallback={<Skeleton className="h-32 w-32 rounded-full" />}>
      <LazyEditableAvatar {...props} />
    </Suspense>
  )
}
