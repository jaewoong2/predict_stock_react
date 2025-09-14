"use client";

import React, { memo } from "react";

const RecBadge = memo(function RecBadge({ rec }: { rec: "Buy" | "Hold" | "Sell" | null }) {
  const getVariant = (r: string | null) => {
    switch (r) {
      case "Buy":
        return "bg-green-100 text-green-700 border-green-200";
      case "Sell":
        return "bg-red-100 text-red-700 border-red-200";
      case "Hold":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className={`rounded-lg border px-2 py-1 text-xs font-medium ${getVariant(rec)}`}>
      {rec ?? "N/A"}
    </div>
  );
});

export default RecBadge;

