"use client";

import { useState } from "react";
import { ProfileEditForm } from "./profile-edit-form";
import { AccountSettingsForm } from "./account-settings-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings, Shield } from "lucide-react";

export function ProfilePageClient() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>계정 관리</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                프로필
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                설정
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                보안
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <ProfileEditForm />
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <AccountSettingsForm />
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                보안 설정은 준비 중입니다.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
