"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ChevronDown } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import type { User } from "@/types"
import { toast } from "sonner"

const profileSchema = z.object({
  name: z.string().min(2, "Name must have at least 2 characters"),
  email: z.string().email("Invalid email address"),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date of birth"),
  permanentAddress: z.string().min(5, "Address must have at least 5 characters"),
  postalCode: z.string().regex(/^\d{4,10}$/, "Invalid postal code"),
  username: z.string().min(3, "Username must have at least 3 characters"),
  password: z.string().min(6, "Password must have at least 6 characters"),
  presentAddress: z.string().min(5, "Address must have at least 5 characters"),
  city: z.string().min(2, "City must have at least 2 characters"),
  country: z.string().min(2, "Country must have at least 2 characters"),
})

export type UserFormValues = z.infer<typeof profileSchema>

interface UserFormProps {
  user?: User
  onSubmit?: (data: UserFormValues) => Promise<void>
}

export function UserForm({ user, onSubmit }: UserFormProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      dateOfBirth: user?.dateOfBirth || "",
      permanentAddress: user?.permanentAddress || "",
      postalCode: user?.postalCode || "",
      username: user?.username || "",
      password: "********",
      presentAddress: user?.presentAddress || "",
      city: user?.city || "",
      country: user?.country || "",
    },
    mode: "onChange",
  })

  async function handleSubmit(data: UserFormValues) {
    try {
      if (onSubmit) {
        await onSubmit(data)
      } else {
        console.log("Datos enviados:", data)
        toast.success("Profile updated successfully")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("Failed to update profile")
    }
  }

  const formFields = Object.keys(profileSchema.shape)
  const halfLength = Math.ceil(formFields.length / 2)
  const leftColumnFields = formFields.slice(0, halfLength)
  const rightColumnFields = formFields.slice(halfLength)

  const renderField = (key: string) => (
    <div key={key} className="mb-4">
      <label htmlFor={key} className="mb-1 block text-sm font-medium capitalize">
        {key.replace(/([A-Z])/g, " $1").trim()}
      </label>
      {key !== "dateOfBirth" ? (
        <Input
          id={key}
          type={key === "password" ? "password" : "text"}
          {...form.register(key as keyof UserFormValues)}
          placeholder={`Enter your ${key
            .replace(/([A-Z])/g, " $1")
            .trim()
            .toLowerCase()}`}
          className="w-full"
        />
      ) : (
        <Popover>
          <PopoverTrigger
            asChild
            className="w-full"
            aria-haspopup="dialog"
            aria-expanded="false"
            aria-label="Select your date of birth"
          >
            <Button
              variant={"outline"}
              className={cn(
                "w-full items-center justify-between text-left font-normal",
                !form.getValues("dateOfBirth") && "text-muted-foreground"
              )}
            >
              <div className="flex gap-x-4">
                <CalendarIcon className="h-4 w-4" />
                {form.getValues("dateOfBirth") ? (
                  format(new Date(form.getValues("dateOfBirth")), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Calendar
              mode="single"
              selected={
                form.getValues("dateOfBirth") ? new Date(form.getValues("dateOfBirth")) : undefined
              }
              onSelect={(e) => e && form.setValue("dateOfBirth", e.toLocaleDateString())}
              disabled={(date) => date > new Date()}
              className="w-full"
            />
          </PopoverContent>
        </Popover>
      )}
      <p className="mt-1 min-h-5 text-sm text-red-500">
        {form.formState.errors[key as keyof UserFormValues]?.message}
      </p>
    </div>
  )

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full gap-8 space-y-4 p-6">
      <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
        <div>{leftColumnFields.map(renderField)}</div>

        <div>{rightColumnFields.map(renderField)}</div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          type="submit"
          disabled={form.formState.isSubmitting || !form.formState.isDirty}
          className="w-32 rounded-xl py-6"
        >
          {form.formState.isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  )
}
