"use client";

import { useState } from "react";
import { ProfileEditForm } from "./profile-edit-form";
import { AccountSettingsForm } from "./account-settings-form";
import { TossCard, TossCardContent, TossCardHeader, TossCardTitle } from "@/components/ui/toss-card";
import { User, Settings, Shield } from "lucide-react";
import { CooldownStatusCard } from "@/components/ox/engagement/CooldownStatusCard";
import { AdWatchHistoryList } from "@/components/ox/engagement/AdWatchHistoryList";
import { cn } from "@/lib/utils";

export function ProfilePageClient() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "프로필", icon: User },
    { id: "settings", label: "설정", icon: Settings },
    { id: "security", label: "보안", icon: Shield }
  ];

  return (
    <div className="space-y-6">
      <TossCard padding="lg">
        <TossCardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            <TossCardTitle>계정 관리</TossCardTitle>
          </div>
        </TossCardHeader>
        <TossCardContent>
          {/* Custom Tab Navigation */}
          <div className="mb-6">
            <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                      activeTab === tab.id
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === "profile" && <ProfileEditForm />}
            {activeTab === "settings" && <AccountSettingsForm />}
            {activeTab === "security" && (
              <div className="py-12 text-center">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  보안 설정
                </h3>
                <p className="text-sm text-gray-500">
                  보안 설정 기능은 준비 중입니다
                </p>
              </div>
            )}
          </div>
        </TossCardContent>
      </TossCard>

      {/* 광고/쿨다운 히스토리 섹션 */}
      <div className="space-y-6">
        <CooldownStatusCard />
        <AdWatchHistoryList />
      </div>
    </div>
  );
}
