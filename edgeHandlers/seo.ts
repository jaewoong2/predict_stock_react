import type {
  CloudFrontRequestEvent,
  CloudFrontRequestResult,
} from "aws-lambda";
import { siteConfig } from "../seo.config.js";

interface SignalSeoData {
  title: string;
  description: string;
  image?: string;
}

function buildDashboardTags(): string {
  return `\n    <title>${siteConfig.siteName} Dashboard</title>\n    <meta name="description" content="Signal dashboard" />\n    <meta property="og:title" content="${siteConfig.siteName} Dashboard" />\n    <meta property="og:description" content="Signal dashboard" />\n    <meta property="og:image" content="${siteConfig.defaultImage}" />`;
}

function buildSignalTags(data: SignalSeoData): string {
  return `\n    <title>${data.title} | ${siteConfig.siteName}</title>\n    <meta name="description" content="${data.description}" />\n    <meta property="og:title" content="${data.title}" />\n    <meta property="og:description" content="${data.description}" />\n    <meta property="og:image" content="${data.image ?? siteConfig.defaultImage}" />`;
}

export const handler = async (
  event: CloudFrontRequestEvent,
): Promise<CloudFrontRequestResult> => {
  const request = event.Records[0].cf.request;

  // Only intercept dashboard pages
  if (request.method !== "GET" || !request.uri.startsWith("/dashboard")) {
    return request;
  }

  const params = new URLSearchParams(request.querystring || "");
  const signalId = params.get("signalId");

  // Fetch the original HTML from the origin
  const originUrl = `https://${request.headers.host[0].value}${request.uri}${request.querystring ? `?${request.querystring}` : ""}`;
  const originRes = await fetch(originUrl);
  let html = await originRes.text();

  // Decide which meta tags to inject
  let tags = buildDashboardTags();
  if (signalId) {
    try {
      const detail = (await fetch(
        `${siteConfig.apiBaseUrl}/signals/${signalId}`,
      ).then((r) => r.json())) as SignalSeoData;
      tags = buildSignalTags(detail);
    } catch {
      // ignore API failures so the page still renders
    }
  }

  // Inject before the closing head tag
  html = html.replace(/<\/head>/i, `${tags}\n</head>`);

  return {
    status: String(originRes.status),
    statusDescription: originRes.statusText,
    headers: Object.fromEntries(
      Object.entries(originRes.headers).map(([k, v]) => [
        k.toLowerCase(),
        [{ key: k, value: String(v) }],
      ]),
    ),
    body: html,
  };
};
