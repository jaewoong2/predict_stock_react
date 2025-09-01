"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Bell, Eye, Moon } from "lucide-react";
import { toast } from "sonner";

export function AccountSettingsForm() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    darkMode: false,
    showPredictions: true,
  });

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));

    // TODO: 실제 설정 저장 API 호출
    toast.success("설정 변경", {
      description: "설정이 저장되었습니다.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          계정 설정
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* 알림 설정 */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Bell className="h-4 w-4" />
              알림 설정
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">이메일 알림</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    예측 결과와 중요 공지사항을 이메일로 받습니다
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    handleSettingChange("emailNotifications", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">푸시 알림</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    브라우저 푸시 알림을 받습니다
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) =>
                    handleSettingChange("pushNotifications", checked)
                  }
                />
              </div>
            </div>
          </div>

          {/* 표시 설정 */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Eye className="h-4 w-4" />
              표시 설정
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-predictions">예측 내역 표시</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    다른 사용자에게 내 예측 내역을 표시합니다
                  </p>
                </div>
                <Switch
                  id="show-predictions"
                  checked={settings.showPredictions}
                  onCheckedChange={(checked) =>
                    handleSettingChange("showPredictions", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">다크 모드</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    다크 테마를 사용합니다
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={settings.darkMode}
                  onCheckedChange={(checked) =>
                    handleSettingChange("darkMode", checked)
                  }
                />
              </div>
            </div>
          </div>

          {/* 계정 관리 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-lg font-semibold">계정 관리</h3>

            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                비밀번호 변경
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 dark:text-red-400"
              >
                계정 삭제
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
