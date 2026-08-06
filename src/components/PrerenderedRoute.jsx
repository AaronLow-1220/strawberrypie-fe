import { Loading } from "./Loading";

const ROUTE_CONTENT = {
  "/": {
    title: "草莓派｜元智資傳第28屆畢業展覽",
    description:
      "草莓派是元智大學資訊傳播學系第28屆畢業展覽，集結互動、遊戲、影視、行銷與動畫五大領域學生作品。",
    sections: [
      ["五大創作領域", "互動、遊戲、影視、行銷與動畫。"],
      ["校內展", "04.07–04.12，元智大學五館三樓、六館玻璃屋。"],
      ["校外展", "04.25–04.28，松山文創園區三號倉庫。"],
    ],
  },
  "/groups": {
    title: "草莓派參展作品",
    description:
      "瀏覽互動、遊戲、影視、行銷與動畫五大領域的參展團隊與學生作品。",
    sections: [],
  },
  "/psychometric-test": {
    title: "草莓派心理測驗",
    description:
      "從製作草莓派的選擇探索個性與特質，找到屬於你的專屬角色。",
    sections: [],
  },
};

export const PrerenderedRoute = ({
  pathname = "/",
  loadingProgress = 0,
  loadingText = "",
}) => {
  const content = ROUTE_CONTENT[pathname];

  return (
    <>
      {content && (
        <main data-prerendered-content>
          <h1>{content.title}</h1>
          <p>{content.description}</p>
          {content.sections.map(([title, description]) => (
            <section key={title}>
              <h2>{title}</h2>
              <p>{description}</p>
            </section>
          ))}
          <nav aria-label="主要頁面">
            <a href="/">展覽首頁</a>
            <a href="/groups">參展作品</a>
            <a href="/psychometric-test">草莓派心理測驗</a>
          </nav>
        </main>
      )}
      <Loading progress={loadingProgress} loadingText={loadingText} />
    </>
  );
};
