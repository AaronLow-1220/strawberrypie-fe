import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://strawberrypie.maxlin.tw";
const SOCIAL_IMAGE = `${SITE_URL}/HomePage/Background_web.jpg`;

const DEFAULT_SEO = {
  title: "草莓派｜元智資傳第28屆畢業展覽",
  description:
    "草莓派是元智大學資訊傳播學系第28屆畢業展覽，集結互動、遊戲、影視、行銷與動畫五大領域學生作品。",
  path: "/",
  indexable: true,
};

const ROUTE_SEO = {
  "/": DEFAULT_SEO,
  "/groups": {
    title: "參展作品｜草莓派・元智資傳第28屆畢業展覽",
    description:
      "瀏覽草莓派畢業展的互動、遊戲、影視、行銷與動畫作品，認識元智大學資訊傳播學系第28屆各參展團隊。",
    path: "/groups",
    indexable: true,
  },
  "/psychometric-test": {
    title: "草莓派心理測驗｜找到你的專屬角色",
    description:
      "透過草莓派心理測驗，從製作草莓派的選擇探索個性與特質，找到屬於你的專屬角色。",
    path: "/psychometric-test",
    indexable: true,
  },
};

const setMeta = (selector, attribute, value) => {
  const element = document.head.querySelector(selector);
  if (element) element.setAttribute(attribute, value);
};

export const Seo = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = ROUTE_SEO[pathname] || {
      ...DEFAULT_SEO,
      title: "草莓派｜元智資傳第28屆畢業展覽",
      path: pathname,
      indexable: false,
    };
    const canonicalUrl = `${SITE_URL}${seo.path}`;

    document.title = seo.title;
    setMeta('meta[name="description"]', "content", seo.description);
    setMeta(
      'meta[name="robots"]',
      "content",
      seo.indexable
        ? "index, follow, max-image-preview:large"
        : "noindex, nofollow"
    );
    setMeta('meta[property="og:title"]', "content", seo.title);
    setMeta('meta[property="og:description"]', "content", seo.description);
    setMeta('meta[property="og:url"]', "content", canonicalUrl);
    setMeta('meta[property="og:image"]', "content", SOCIAL_IMAGE);
    setMeta('meta[name="twitter:title"]', "content", seo.title);
    setMeta('meta[name="twitter:description"]', "content", seo.description);
    setMeta('meta[name="twitter:image"]', "content", SOCIAL_IMAGE);

    const canonical = document.head.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", canonicalUrl);

    const structuredData = document.getElementById("structured-data");
    if (structuredData) {
      structuredData.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "草莓派｜元智資傳第28屆畢業展覽",
        url: SITE_URL,
        inLanguage: "zh-Hant-TW",
        description: seo.description,
        publisher: {
          "@type": "CollegeOrUniversity",
          name: "元智大學資訊傳播學系",
          url: "https://www.comm.yzu.edu.tw/",
        },
      });
    }
  }, [pathname]);

  return null;
};
