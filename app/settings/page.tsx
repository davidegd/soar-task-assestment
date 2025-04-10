"use client"

import type React from "react"

import { useCallback, useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useApp } from "@/context/app-context"
import type { User } from "@/types"
import { fetchUser } from "@/services/api"
import { EditableAvatar } from "@/components/settings/edit-avatar"
import { UserForm, UserFormValues } from "@/components/settings/user-form"

const ActiveTabClassName =
  "text-muted-foreground  data-[state=active]:border-b-2 data-[state=active]:text-primary data-[state=active]:!border-primary data-[state=active]:!border-t-0 data-[state=active]:!border-r-0 data-[state=active]:!border-l-0  data-[state=active]:!rounded-none data-[state=active]:!bg-transparent"

export default function SettingsPage() {
  const { user, updateUserProfile } = useApp()
  const [formData, setFormData] = useState<Partial<User>>(user || {})

  const handleSubmit = useCallback(async (data: UserFormValues) => {
    await updateUserProfile(data)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchUser()
      setFormData(data)
    }
    if (!user) {
      fetchData()
    }
  }, [user])

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading user data...</h2>
          <p className="text-muted-foreground">Please wait while we load your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-full rounded-2xl bg-background p-8">
      <Tabs defaultValue="edit-profile">
        <TabsList
          className="grid w-full grid-cols-3 justify-start !bg-transparent md:grid-cols-8"
          role="tablist"
          aria-label="Settings Tabs"
        >
          <TabsTrigger
            value="edit-profile"
            className={ActiveTabClassName}
            role="tab"
            aria-selected="true"
            tabIndex={0}
          >
            Edit Profile
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className={ActiveTabClassName}
            role="tab"
            aria-selected="false"
            tabIndex={-1}
          >
            Preferences
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className={ActiveTabClassName}
            role="tab"
            aria-selected="false"
            tabIndex={-1}
          >
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit-profile" className="mt-0 gap-0 pt-0" role="tabpanel">
          <div className=" w-full flex-col gap-4 py-4 md:flex md:!flex-row">
            <div className="mb-8 flex justify-center md:inline-block">
              <EditableAvatar
                src={formData.avatar as unknown as string}
                alt={`${user.name}'s avatar`}
                onImageChange={async (file) => {
                  setFormData({
                    ...formData,
                    avatar: URL.createObjectURL(file),
                  })
                }}
              />
            </div>
            <UserForm user={user} onSubmit={handleSubmit} />
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="mt-0" role="tabpanel">
          <div className="rounded-b-xl bg-background p-6 shadow-sm">
            <div className="flex h-40 items-center justify-center">
              <p className="text-muted-foreground">Preference settings will be available soon.</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="mt-0" role="tabpanel">
          <div className="rounded-b-xl bg-background p-6 shadow-sm">
            <div className="flex h-40 items-center justify-center">
              <p className="text-muted-foreground">Security settings will be available soon.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
