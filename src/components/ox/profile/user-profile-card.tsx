import { UserProfile } from "@/types/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Mail, Shield } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface UserProfileCardProps {
  profile: UserProfile;
}

export function UserProfileCard({ profile }: UserProfileCardProps) {
  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "google":
        return "G";
      case "kakao":
        return "K";
      default:
        return "U";
    }
  };

  const getProviderName = (provider: string) => {
    switch (provider) {
      case "google":
        return "Google";
      case "kakao":
        return "Kakao";
      default:
        return "Local";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-500" />
          프로필 정보
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg font-semibold">
              {profile.nickname.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {profile.nickname}
            </div>
            <Badge variant="outline" className="text-xs">
              {getProviderName(profile.auth_provider)}
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700 dark:text-gray-300">
              {profile.email}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700 dark:text-gray-300">
              가입일:{" "}
              {format(new Date(profile.created_at), "yyyy년 MM월 dd일", {
                locale: ko,
              })}
            </span>
          </div>
        </div>

        {profile.is_oauth_user && (
          <div className="border-t pt-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              OAuth 계정으로 가입된 사용자입니다.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
