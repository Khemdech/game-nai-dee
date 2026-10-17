import { Link } from 'react-router'
import PageHeader from '../components/PageHeader'

// หน้า route * สำหรับ URL ที่ไม่มีในเว็บ ต่างจากรายละเอียดเกมที่ API ตอบ 404
export default function NotFoundPage() {
  return (
    <>
      <PageHeader title="Page not found" path="404" description="ลิงก์นี้ไม่มีอยู่ในเว็บไซต์" step="404" />
      <Link className="btn btn-primary btn-sm bg-blue-600 text-white" to="/">Back to Discover</Link>
    </>
  )
}
