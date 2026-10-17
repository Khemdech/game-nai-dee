import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

// Flat config แบ่งกฎตามชนิดไฟล์; npm run lint เรียก ESLint ด้วยชุดนี้
export default defineConfig([
  // ไม่ตรวจไฟล์ dist ที่สร้างจาก build เพราะควรแก้ปัญหาที่ source
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,ts,tsx}'],
    extends: [js.configs.recommended],
  },
  {
    files: ['**/*.{ts,tsx}'],
    // ตรวจรูปแบบ TypeScript เพิ่มจากกฎ JavaScript; การตรวจ type เต็มยังทำผ่าน tsc
    extends: [tseslint.configs.recommended],
    rules: {
      // โจทย์กำหนดให้ระบุชนิดข้อมูลชัดเจน ไม่ใช้ any เพื่อข้ามการตรวจ
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    // ตรวจลำดับ Hooks และรูปแบบ export ที่เหมาะกับ Fast Refresh
    extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
    languageOptions: {
      // ไฟล์ src ใช้ชื่อจาก browser เช่น window/document ได้โดยไม่ถูกแจ้งว่าไม่รู้จัก
      globals: globals.browser,
    },
  },
  {
    files: ['eslint.config.js', 'vite.config.ts'],
    languageOptions: {
      // ไฟล์ config รันฝั่ง Node จึงใช้ชุด globals ต่างจาก src
      globals: globals.node,
    },
  },
])
