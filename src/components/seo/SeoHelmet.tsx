import { Helmet } from "react-helmet-async";
import { siteConfig } from "../../../seo.config";

export interface SeoHelmetProps {
  title?: string;
  description?: string;
  image?: string;
}

export function SeoHelmet({ title, description, image }: SeoHelmetProps) {
  const baseTitle = siteConfig.siteName;
  const pageTitle = title ? `${title} | ${baseTitle}` : baseTitle;
  const desc = description ?? "Signal dashboard";
  const img = image ?? siteConfig.defaultImage;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={img} />
    </Helmet>
  );
}
