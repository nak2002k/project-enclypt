// postcss.config.cjs
module.exports = {
  plugins: {
    // ← use the new PostCSS plugin, not "tailwindcss" directly
    "@tailwindcss/postcss": {},  
    autoprefixer: {},
  },
}