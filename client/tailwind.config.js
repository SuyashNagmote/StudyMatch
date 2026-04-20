/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        coral: "#f97316",
        ocean: "#0891b2",
        wheat: "#f8fafc"
      },
      boxShadow: {
        soft: "0 25px 50px -12px rgba(15, 23, 42, 0.25)"
      }
    }
  },
  plugins: []
};
