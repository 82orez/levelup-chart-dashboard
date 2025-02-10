import type { Config } from "tailwindcss";
const plugin = require("tailwindcss/plugin");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/ui/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 사용할 blue 계열의 color 재정의
        blue: {
          400: "#2589FE",
          500: "#0070F3",
          600: "#2F6FEB",
        },
      },
      // 애니메이션 키 프레임 정의
      keyframes: {
        shimmer: {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(100%)",
          },
        },
      },
      // 애니메이션 정의
      // 클래스 animate-shimmer 를 HTML 요소에 적용하면 이 애니메이션이 작동합니다.
      animation: {
        shimmer: "shimmer 2s 1",
      },
      // 커스텀 배경 이미지 클래스 정의
      // 클래스 bg-gradient-shimmer 를 사용해 적용할 수 있습니다.
      backgroundImage: {
        "gradient-shimmer": "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.6), transparent)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
export default config;
