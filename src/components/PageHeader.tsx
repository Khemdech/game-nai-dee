// Props เป็นข้อมูลที่ page ส่งให้หัวข้อร่วมกัน; description มี ? จึงไม่จำเป็นต้องส่ง
interface PageHeaderProps {
  title: string
  path: string
  description?: string
  step: string
}

// Component แสดงผลอย่างเดียว ไม่โหลด API และไม่เก็บ state ของหน้า
export default function PageHeader({ title, path, description, step }: PageHeaderProps) {
  return (
    <header className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-1 font-mono text-[11px] text-blue-600">{path}</p>
        {/* แสดงคำอธิบายเมื่อมีค่า ส่วน path เป็นข้อความประกอบ ไม่ได้ใช้เปลี่ยน route */}
        {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}
      </div>
      <span className="rounded-full bg-blue-100 px-3 py-1 text-[10px] font-semibold text-blue-700">{step}</span>
    </header>
  )
}
