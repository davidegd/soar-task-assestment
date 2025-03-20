"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/context/app-context";
import type { User } from "@/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { fetchUser } from "@/services/api";
import { EditableAvatar } from "@/components/settings/edit-avatar";

const ActiveTabClassName =
  "text-muted-foreground  data-[state=active]:border-b-2 data-[state=active]:text-primary data-[state=active]:!border-primary data-[state=active]:!border-t-0 data-[state=active]:!border-r-0 data-[state=active]:!border-l-0  data-[state=active]:!rounded-none data-[state=active]:!bg-transparent";

export default function SettingsPage() {
  const { user, updateUserProfile, isLoading, setUser } = useApp();
  const [formData, setFormData] = useState<Partial<User>>(user || {});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile(formData);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchUser();
      setFormData(data);
    };
    if (!user) {
      fetchData();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading user data...</h2>
          <p className="text-muted-foreground">
            Please wait while we load your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-full bg-background p-8 rounded-2xl">
      <Tabs defaultValue="edit-profile">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-8 !bg-transparent justify-start">
          <TabsTrigger value="edit-profile" className={ActiveTabClassName}>
            Edit Profile
          </TabsTrigger>
          <TabsTrigger value="preferences" className={ActiveTabClassName}>
            Preferences
          </TabsTrigger>
          <TabsTrigger value="security" className={ActiveTabClassName}>
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit-profile" className="mt-0 pt-0 gap-0">
          <form
            onSubmit={handleSubmit}
            className=" rounded-b-xl bg-transparent p-6 md:flex justify-center  gap-6"
          >
            <div className="mb-8 flex md:inline-block justify-center">
              <EditableAvatar
                src={formData.avatar as unknown as string}
                alt={user.name}
                onImageChange={async (file) => {
                  setFormData({
                    ...formData,
                    avatar: URL.createObjectURL(file),
                  });
                }}
              />
            </div>
            <div className="w-full justify-between flex flex-col gap-x-4">
              <div className="flex justify-center"></div>

              <div className="grid gap-6 md:grid-cols-2 mb-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    placeholder="Enter your name"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium">
                    User Name
                  </label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username || ""}
                    onChange={handleChange}
                    placeholder="Enter your username"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value="**********"
                    onChange={handleChange}
                    placeholder="Enter your password"
                  />
                </div>

                <div className="space-y-2 flex flex-col ">
                  <label htmlFor="dateOfBirth" className="text-sm font-medium">
                    Date of Birth
                  </label>
                  <Popover>
                    <PopoverTrigger asChild className="w-full">
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-between text-left font-normal items-center ",
                          !formData.dateOfBirth && "text-muted-foreground"
                        )}
                      >
                        <div className="flex gap-x-4 ">
                          <CalendarIcon />
                          {formData.dateOfBirth ? (
                            format(new Date(formData.dateOfBirth), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </div>
                        <ChevronDownIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          formData.dateOfBirth
                            ? new Date(formData.dateOfBirth)
                            : undefined
                        }
                        onSelect={(e) =>
                          setFormData({
                            ...formData,
                            dateOfBirth: e?.toLocaleString(),
                          })
                        }
                        className="w-full"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="presentAddress"
                    className="text-sm font-medium"
                  >
                    Present Address
                  </label>
                  <Input
                    id="presentAddress"
                    name="presentAddress"
                    value={formData.presentAddress || ""}
                    onChange={handleChange}
                    placeholder="Enter your present address"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="permanentAddress"
                    className="text-sm font-medium"
                  >
                    Permanent Address
                  </label>
                  <Input
                    id="permanentAddress"
                    name="permanentAddress"
                    value={formData.permanentAddress || ""}
                    onChange={handleChange}
                    placeholder="Enter your permanent address"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="city" className="text-sm font-medium">
                    City
                  </label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city || ""}
                    onChange={handleChange}
                    placeholder="Enter your city"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="postalCode" className="text-sm font-medium">
                    Postal Code
                  </label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode || ""}
                    onChange={handleChange}
                    placeholder="Enter your postal code"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="country" className="text-sm font-medium">
                    Country
                  </label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country || ""}
                    onChange={handleChange}
                    placeholder="Enter your country"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-36 rounded-xl py-6"
                >
                  {isLoading ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="preferences" className="mt-0">
          <div className="rounded-b-xl  bg-background p-6 shadow-sm">
            <div className="flex h-40 items-center justify-center">
              <p className="text-muted-foreground">
                Preference settings will be available soon.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="mt-0">
          <div className="rounded-b-xl bg-background p-6 shadow-sm">
            <div className="flex h-40 items-center justify-center">
              <p className="text-muted-foreground">
                Security settings will be available soon.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
