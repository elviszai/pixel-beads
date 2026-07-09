/** @type {import('next').NextConfig} */
const nextConfig = {
  // 完全关闭构建时的 ESLint 检查
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 关闭 TypeScript 类型检查（如果项目有 TS 类型错误也一并绕过）
  typescript: {
    ignoreBuildErrors: true,
  },
  // 允许使用 <img> 标签而不报错
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig