import PageHeader from '../components/PageHeader'

// Fallback ของ router เมื่อ render หน้าไม่สำเร็จ ไม่ใช่ UI retry ของคำขอ API
export default function RouteErrorPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <PageHeader title="Unable to display this page" path="/error" description="เกิดข้อผิดพลาดระหว่างแสดงหน้าเว็บ" step="ERR" />
      {/* ใช้ a เพื่อโหลดแอปใหม่ทั้งหน้าและเริ่มจาก Discover เมื่อเส้นทางเดิมเกิดปัญหา */}
      <a className="btn btn-primary btn-sm bg-blue-600 text-white" href="/">Reload Discover</a>
    </main>
  )
}
