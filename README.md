# Game-Nai-Dee (เกมไหนดี)

โปรเจกต์ CS319 Mini Project 2: เว็บค้นหาเกม ดูรายละเอียด เก็บรายการโปรด และเปรียบเทียบเกม

**สถานะ: ขั้นที่ 2 — Routing และโครงหน้า 5 หน้า ยังไม่พร้อมส่งงาน**

## เริ่มใช้งานบน Windows

ใช้ Node.js 24 LTS (เครื่องที่เตรียมงานใช้ 24.14.0) และ npm เปิด Terminal ในโฟลเดอร์โปรเจกต์:

```powershell
cd C:\Users\Hp\Pictures\CS319\mini_project2\game-nai-dee
npm.cmd ci
npm.cmd run dev
```

เปิด URL ที่ Terminal แสดง (ปกติ http://localhost:5173) หยุดด้วย Ctrl+C
ถ้ามี node_modules จากการติดตั้งเรียบร้อยแล้ว เริ่มที่ npm.cmd run dev ได้เลย
ใช้ npm.cmd บน PowerShell เพื่อหลีกเลี่ยงปัญหานโยบายการรัน npm.ps1 โดยไม่ต้องลดความปลอดภัยของเครื่อง

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
npm.cmd run preview
```

preview ใช้ดูไฟล์ build หลัง build สำเร็จ ไม่ใช่เซิร์ฟเวอร์ production

## มีอะไรแล้ว

- React 19 + Vite + TypeScript strict และ ESLint สำหรับ React/TypeScript พร้อมกฎห้าม explicit any
- Tailwind CSS v4 + DaisyUI v5 พร้อม layout และเมนูร่วมกัน
- ธีมหน้าจอพื้นขาว สีฟ้า การ์ดขอบบาง และ layout แบบ dashboard ตามภาพอ้างอิงของผู้ใช้
- React Router v7 ทำงานแล้ว: /, /games/:id, /favorites, /compare, /about พร้อมหน้า 404 และตรวจรูปแบบ ID
- TanStack Query v5 และ Zustand v5 ติดตั้งไว้ แต่ยังไม่มี Query provider หรือ persist store
- .env.example เตรียมชื่อ VITE_RAWG_API_KEY แต่ยังไม่มีการเรียก API
- AGENTS.md และ docs/ แยกบท พร้อมคำอธิบายภาษาไทย; แบบฝึกหัด/คำถามทั้งหมดเก็บไว้ทำท้ายโปรเจกต์ในบท 7

## เริ่มเรียนตรงนี้

1. [สารบัญและแผนงาน](docs/README.md)
2. [บทปัจจุบัน: Routing และโครงหน้า](docs/02-routing/README.md)
   ([บันทึกขั้นแรก](docs/01-project-setup/README.md))
3. [ข้อกำหนดจาก PDF](docs/00-requirements/README.md)
4. [กติกาสำหรับ Codex](AGENTS.md)

## โครงสร้าง

```text
src/
  main.tsx       จุดเริ่มต้น React
  App.tsx        Root Layout: เมนู, Outlet, footer
  router.tsx     ตารางจับคู่ URL กับหน้า
  index.css      Tailwind, DaisyUI และ CSS กลาง
  components/    PageHeader ที่รับข้อความผ่าน props
  pages/         โครง 5 หน้า + NotFoundPage + RouteErrorPage
  api/           ฟังก์ชันเรียก RAWG (เตรียมโฟลเดอร์)
  hooks/         query hooks (เตรียมโฟลเดอร์)
  stores/        Zustand client state (เตรียมโฟลเดอร์)
  types/         TypeScript types (เตรียมโฟลเดอร์)
docs/            README แยกตามขั้น
```

## ขอบเขตและข้อควรทราบ

ข้อดี: แยก layout/เส้นทาง/เนื้อหาชัดเจน ข้อเสีย: มีหลายไฟล์ที่ต้องติดตาม
ข้อจำกัด: โครงหน้าไม่ได้หมายความว่าฟีเจอร์เสร็จ ยังไม่มีข้อมูลเกมจริงหรือการบันทึก
ความเสี่ยงของ routing: ตอน deploy ต้องตั้ง SPA fallback ให้เปิด URL ตรงและ refresh ได้
ความเสี่ยง: RAWG ต้องใช้ key และมีเงื่อนไขการใช้งาน/โควตา ให้ตรวจจากเว็บทางการก่อนเชื่อมจริง
ข้อจำกัด: .env.local ช่วยไม่ให้ key ติด Git แต่ VITE_ ไม่ซ่อน key จากผู้ใช้เว็บ ขั้น Routing ยังไม่ต้องกรอก key

## เอกสารทางการ

- [Vite](https://vite.dev/guide/)
- [React Router v7 Data Mode](https://reactrouter.com/7.18.4/start/data/installation)
- [Tailwind บน Vite](https://tailwindcss.com/docs/installation/using-vite)
- [DaisyUI บน Vite](https://daisyui.com/docs/install/vite/)
- [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview) — เลือกเอกสาร v5
- [Zustand](https://github.com/pmndrs/zustand)
- [RAWG API / attribution](https://rawg.io/apidocs)

ตรวจการติดตั้งจริงใน package-lock.json; เก็บ lockfile ใน Git เพื่อให้สมาชิกติดตั้งชุดเดียวกันด้วย npm ci
