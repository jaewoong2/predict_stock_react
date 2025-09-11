import { UserProfile } from "@/types/auth";
import { TossCard, TossCardContent, TossCardHeader, TossCardTitle } from "@/components/ui/toss-card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Mail, User } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface UserProfileCardProps {
  profile: UserProfile;
}

export function UserProfileCard({ profile }: UserProfileCardProps) {
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

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case "google":
        return "bg-red-100 text-red-700";
      case "kakao":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <TossCard variant="gradient" padding="lg" className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
      <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-white/5" />
      
      <TossCardContent className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-white" />
          <span className="font-semibold text-white">프로필 정보</span>
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-white/20">
            <AvatarFallback className="text-lg font-bold bg-white/20 text-white">
              {profile.nickname.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-xl font-bold text-white mb-1">
              {profile.nickname}
            </div>
            <Badge className={`text-xs ${getProviderColor(profile.auth_provider)}`}>
              {getProviderName(profile.auth_provider)}
            </Badge>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3 bg-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-white/80" />
            <span className="text-white/90">
              {profile.email}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-white/80" />
            <span className="text-white/90">
              가입일: {format(new Date(profile.created_at), "yyyy년 MM월 dd일", {
                locale: ko,
              })}
            </span>
          </div>
        </div>

        {profile.is_oauth_user && (
          <div className="text-xs text-white/70 text-center">
            OAuth 계정으로 가입된 사용자입니다
          </div>
        )}
      </TossCardContent>
    </TossCard>
  );
}
