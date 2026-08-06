import { mkdir, readFile, writeFile } from "node:fs/promises";

const DIST_DIR = new URL("../dist/", import.meta.url);
const baseTemplate = await readFile(new URL("index.html", DIST_DIR), "utf8");
const { render } = await import("../dist-ssr/entry-server.js");

const injectPrerenderedContent = (html, pathname) =>
  html
    .replace('<div id="root"></div>', `<div id="root">${render(pathname)}</div>`)
    .replace(/<noscript>[\s\S]*?<\/noscript>/, '<noscript><style>[data-loading-screen] { display: none !important; }</style></noscript>');

const template = injectPrerenderedContent(baseTemplate, "/");
await writeFile(new URL("index.html", DIST_DIR), template);

const routes = [
  {
    file: "seo/groups.html",
    path: "/groups",
    title: "參展作品｜草莓派・元智資傳第28屆畢業展覽",
    description:
      "瀏覽草莓派畢業展的互動、遊戲、影視、行銷與動畫作品，認識元智大學資訊傳播學系第28屆各參展團隊。",
  },
  {
    file: "seo/psychometric-test.html",
    path: "/psychometric-test",
    title: "草莓派心理測驗｜找到你的專屬角色",
    description:
      "透過草莓派心理測驗，從製作草莓派的選擇探索個性與特質，找到屬於你的專屬角色。",
  },
];

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const replaceMetaContent = (html, attribute, key, value) =>
  html.replace(
    new RegExp(`(<meta\\s+${attribute}="${escapeRegExp(key)}"\\s+content=")[^"]*("\\s*/?>)`),
    `$1${value}$2`
  );

await mkdir(new URL("seo/", DIST_DIR), { recursive: true });

for (const route of routes) {
  const url = `https://strawberrypie.maxlin.tw${route.path}`;
  let html = injectPrerenderedContent(baseTemplate, route.path)
    .replace(/<title>[^<]*<\/title>/, `<title>${route.title}</title>`);
  html = replaceMetaContent(html, "name", "description", route.description);
  html = replaceMetaContent(html, "property", "og:title", route.title);
  html = replaceMetaContent(html, "property", "og:description", route.description);
  html = replaceMetaContent(html, "property", "og:url", url);
  html = replaceMetaContent(html, "name", "twitter:title", route.title);
  html = replaceMetaContent(html, "name", "twitter:description", route.description);
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${url}" />`
  );
  await writeFile(new URL(route.file, DIST_DIR), html);
}
