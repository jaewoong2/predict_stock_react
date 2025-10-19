import { NextRequest, NextResponse } from "next/server";
import { TOKEN_COOKIE_KEY } from "@/lib/cookies";

const COOKIE_KEY = TOKEN_COOKIE_KEY;
const COOKIE_OPTIONS = {
  path: "/",
  httpOnly: false,
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 7,
  ...(process.env.NODE_ENV === "production" ? { secure: true } : {}),
};
const SENSITIVE_PARAMS = [
  "token",
  "code",
  "login",
  "user_id",
  "nickname",
  "provider",
  "is_new_user",
];

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  if (req.nextUrl.pathname === "/logout") {
    const logoutResponse = NextResponse.next();
    logoutResponse.cookies.delete({ name: COOKIE_KEY, path: "/" });
    return logoutResponse;
  }

  const token = url.searchParams.get("token");
  const fallbackCode = url.searchParams.get("code");
  const cookieValue = token || fallbackCode;

  if (cookieValue) {
    const isPrefetch = req.headers.get("x-middleware-prefetch") === "1";

    SENSITIVE_PARAMS.forEach((param) => {
      if (url.searchParams.has(param)) {
        url.searchParams.delete(param);
      }
    });

    if (isPrefetch) {
      const passthrough = NextResponse.next();
      passthrough.cookies.set({
        name: COOKIE_KEY,
        value: cookieValue,
        ...COOKIE_OPTIONS,
      });
      return passthrough;
    }

    const redirectResponse = NextResponse.redirect(url);
    redirectResponse.cookies.set({
      name: COOKIE_KEY,
      value: cookieValue,
      ...COOKIE_OPTIONS,
    });
    return redirectResponse;
  }

  // Block legacy routes in production
  if (process.env.NODE_ENV === "production") {
    if (
      req.nextUrl.pathname.startsWith("/legacy/") ||
      req.nextUrl.pathname === "/legacy"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Validate date parameter for all routes
  const dateParam = url.searchParams.get("date");
  if (dateParam) {
    const selectedDate = new Date(dateParam);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    // If future date, redirect to today
    if (selectedDate > today) {
      url.searchParams.set("date", today.toISOString().split("T")[0]);
      return NextResponse.redirect(url);
    }
  }

  return handleDashboardValidation(req, req.nextUrl.pathname);
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
