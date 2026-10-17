import PageHeader from '../components/PageHeader'

export default function RouteErrorPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <PageHeader title="Unable to display this page" path="/error" description="เกิดข้อผิดพลาดระหว่างแสดงหน้าเว็บ" step="ERR" />
      <a className="btn btn-primary btn-sm bg-blue-600 text-white" href="/">Reload Discover</a>
    </main>
  )
}
