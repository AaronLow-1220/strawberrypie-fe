import withMT from "@material-tailwind/react/utils/withMT";

export default withMT({
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: '640px',  // 小型裝置
      md: '768px',  // 中型裝置
      lg: '1024px', // 大型裝置
      xl: '1280px', // 超大型裝置
      '2xl': '1536px', 
    },
    extend: {
      fontFamily: {
        sans: ["GenSenRounded", "sans-serif"],
      },
      colors: {
        "primary-color": "#F748C1",
        "secondary-color": "#FFB0CE",
        "layer1": "#361014",
        "layer1-5": "#51181E",
        "layer2": "#6C2028",
        "layer3": "#D84050",
      },
      animation: {
        light: "lightAnimation 2s infinite",
        InfoCard: "InfoCard 1s cubic-bezier(0.33, 1, 0.66, 1)",
        Logo: "Logo 1s ease-out forwards",
        IpadLogo: "IpadLogo 1s ease-out forwards",
        WindowLogo: "WindowLogo 1s cubic-bezier(0.33, 1, 0.66, 1) forwards",
        LogoSide: "LogoSide 1s ease-in-out forwards",
        CardFade: "FadeIn 1s ease-in-out",
        CardFadeOut: "FadeOut 1s ease-in-out",
      },
      keyframes: {
        // 跑馬燈動畫
        lightAnimation: {
          "0%": { transform: "translateY(-100px)", opacity: 0.1 },
          "50%": { transform: "translateY(0px)", opacity: 1 },
          "100%": { transform: "translateY(100px)", opacity: 0.1 },
        },
        // 手機版 Logo 動畫
        Logo: {
          "0%": { width: "500px", opacity: 0 },
          "100%": { width: "350px", opacity: 1 },
        },
        // 平板版 Logo 動畫
        IpadLogo: {
          "0%": { width: "500px", opacity: 0 },
          "100%": { width: "350px", opacity: 1 },
        },
        // 電腦版 Logo 動畫
        WindowLogo: {
          "0%": { transform: "translateY(80px)", opacity: 0 },
          "100%": { transform: "translateY(0px)", opacity: 1 },
        },
        // 滑動後 Logo 動畫
        LogoSide: {
          "0%": { transform: "translateX(0px)", opacity: 1 },
          "100%": { transform: "translateX(100px)", opacity: 0 },
        },
        // InfoCard 動畫
        InfoCard: {
          "0%": { transform: "translateY(40px)", opacity: 0 },
          "100%": { transform: "translateY(0px)", opacity: 1 },
        },
        FadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        FadeOut: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  mode: "jit",
  purge: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  plugins: [],
});
