import { NextRequest, NextResponse } from "next/server";

const JWT_TOKEN_KEY = process.env.NEXT_PUBLIC_JWT_TOKEN_KEY ?? "access_token";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const response = NextResponse.next();
  const code = url.searchParams.get("token");

  if (req.nextUrl.pathname === "/logout") {
    response.cookies.delete(JWT_TOKEN_KEY);
    return response;
  }

  if (code) {
    response.cookies.set(JWT_TOKEN_KEY, code);
  }

  // Dashboard route validation (exclude /ox/ routes)
  if (
    req.nextUrl.pathname.startsWith("/dashboard") &&
    !req.nextUrl.pathname.startsWith("/ox/")
  ) {
    return handleDashboardValidation(req, req.nextUrl.pathname);
  }

  return response;
}

function handleDashboardValidation(req: NextRequest, pathname: string) {
  const url = req.nextUrl.clone();
  const searchParams = Object.fromEntries(url.searchParams.entries());

  // Create a new URLSearchParams to build the query string
  const newParams = new URLSearchParams();
  let needsRedirect = false;

  // Copy existing params
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) newParams.set(key, value);
  });

  // Date validation
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);
  const todayFormatted = today.toISOString().split("T")[0];

  const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

  const getClosestWorkingDay = (date: Date) => {
    const closestDate = new Date(date);
    while (isWeekend(closestDate)) {
      closestDate.setDate(closestDate.getDate() - 1);
    }
    return closestDate.toISOString().split("T")[0];
  };

  const isBefore11AM = today.getHours() < 11;
  const date = searchParams.date || null;
  let validDate: string;

  if (date) {
    const currentDate = new Date(date);

    // Date validation logic
    if (currentDate > today) {
      validDate = todayFormatted;
      needsRedirect = true;
    } else if (currentDate < oneMonthAgo) {
      validDate = oneMonthAgo.toISOString().split("T")[0];
      needsRedirect = true;
    } else if (isWeekend(currentDate)) {
      validDate = getClosestWorkingDay(currentDate);
      needsRedirect = true;
    } else {
      validDate = date;
    }
  } else {
    // Default date logic
    validDate = todayFormatted;

    if (isBefore11AM) {
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      validDate = getClosestWorkingDay(yesterday);
    }

    if (isWeekend(today)) {
      validDate = getClosestWorkingDay(today);
    }

    needsRedirect = true;
  }

  if (needsRedirect || date !== validDate) {
    newParams.set("date", validDate);
    needsRedirect = true;
  }

  // Model and condition validation
  const models = searchParams.models
    ? searchParams.models.split(",").filter(Boolean)
    : [];
  const conditions = searchParams.condition
    ? searchParams.condition.split(",").filter(Boolean)
    : [];

  if (models.length <= 1 && conditions.length > 0) {
    newParams.delete("condition");
    needsRedirect = true;
  } else if (models.length > 1 && conditions.length !== models.length - 1) {
    const fill = conditions[0] || "OR";
    const newConds = Array(models.length - 1).fill(fill);
    conditions.forEach((c, idx) => {
      if (idx < newConds.length) newConds[idx] = c;
    });
    newParams.set("condition", newConds.join(","));
    needsRedirect = true;
  }

  // Redirect if needed
  if (needsRedirect) {
    const queryString = newParams.toString();
    return NextResponse.redirect(
      new URL(`${pathname}${queryString ? `?${queryString}` : ""}`, req.url),
    );
  }

  return NextResponse.next();
}
