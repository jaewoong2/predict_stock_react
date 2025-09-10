"use client";

import { Badge } from "@/components/ui/badge";
import { RedemptionStatus } from "@/types/rewards";

interface RewardStatusChipProps {
  status: RedemptionStatus;
}

export function RewardStatusChip({ status }: RewardStatusChipProps) {
  const variant = (() => {
    switch (status) {
      case RedemptionStatus.COMPLETED:
        return "default" as const;
      case RedemptionStatus.APPROVED:
        return "secondary" as const;
      case RedemptionStatus.PENDING:
        return "outline" as const;
      case RedemptionStatus.CANCELLED:
        return "secondary" as const;
      case RedemptionStatus.REJECTED:
      default:
        return "destructive" as const;
    }
  })();

  const label = (() => {
    switch (status) {
      case RedemptionStatus.COMPLETED:
        return "완료";
      case RedemptionStatus.APPROVED:
        return "승인됨";
      case RedemptionStatus.PENDING:
        return "대기";
      case RedemptionStatus.CANCELLED:
        return "취소됨";
      case RedemptionStatus.REJECTED:
        return "거절됨";
      default:
        return status;
    }
  })();

  return <Badge variant={variant}>{label}</Badge>;
}

