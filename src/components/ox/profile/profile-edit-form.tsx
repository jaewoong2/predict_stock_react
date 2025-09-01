"use client";

import { useState } from "react";
import { useMyProfile, useUpdateProfile } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ProfileEditForm() {
  const { data: profile, isLoading } = useMyProfile();
  const updateProfile = useUpdateProfile();

  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
  });

  // 프로필 데이터가 로드되면 폼 초기화
  useState(() => {
    if (profile) {
      setFormData({
        nickname: profile.nickname,
        email: profile.email,
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile) return;

    try {
      await updateProfile.mutateAsync({
        nickname: formData.nickname,
        email: formData.email,
      });

      toast.success("프로필 업데이트", {
        description: "프로필이 성공적으로 업데이트되었습니다.",
      });
    } catch (error) {
      toast.error("오류", {
        description: "프로필 업데이트에 실패했습니다.",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-red-600 dark:text-red-400">
            프로필 정보를 불러올 수 없습니다.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          프로필 수정
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nickname">닉네임</Label>
            <Input
              id="nickname"
              value={formData.nickname}
              onChange={(e) => handleInputChange("nickname", e.target.value)}
              placeholder="닉네임을 입력하세요"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="이메일을 입력하세요"
              required
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={updateProfile.isPending}
              className="flex w-full items-center gap-2"
            >
              {updateProfile.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  업데이트 중...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  프로필 업데이트
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
