import PageHeader from "../components/PageHeader";

interface TeamMember {
  name: string;
  fullName: string;
  nickname: string;
  studentId: string;
  responsibility: string;
  photo: string;
}

const members: TeamMember[] = [
  {
    name: "John Doe",
    fullName: "Johnathan Doe",
    nickname: "John",
    studentId: "123456789",
    responsibility: "Frontend Development, UI/UX Design",
    photo: "",
  },
  {
    name: "Jane Smith",
    fullName: "Jane Alexandra Smith",
    nickname: "Jane",
    studentId: "987654321",
    responsibility: "Backend Development, API Integration",
    photo: "",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About Game-Nai-Dee"
        path="/about"
        description="ค้นหาเกมที่สนใจ บันทึกเกมโปรด และเปรียบเทียบข้อมูลก่อนเลือกเล่น"
        step="05"
      />

      <section
        aria-labelledby="team-heading"
        className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6"
      >
        <h2 id="team-heading" className="text-lg font-semibold">
          สมาชิกผู้จัดทำ
        </h2>
        <p className="mt-1 text-sm text-slate-500">CS319 Mini Project 2</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {members.map((member) => (
            <article
              key={member.studentId}
              className="min-w-0 rounded-lg border border-slate-200 p-6 text-center"
            >
              {member.photo ? (
                <img
                  src={member.photo}
                  alt={`รูปของ ${member.fullName}`}
                  className="mx-auto size-24 rounded-full object-cover"
                />
              ) : (
                // <div
                //   className="mx-auto grid size-24 place-items-center rounded-full bg-blue-50 text-3xl font-bold text-blue-600"
                //   aria-label={`ยังไม่มีรูปสมาชิกคนที่ ${member.studentId}`}
                // >
                //   {member.studentId}
                // </div>
                <div
                  className="mx-auto grid size-24 place-items-center rounded-full bg-blue-50 text-3xl font-bold text-blue-600"
                  aria-label={`ยังไม่มีรูปของ ${member.fullName}`}
                >
                  {member.nickname.trim().charAt(0).toUpperCase() || "?"}
                </div>
              )}

              <h3 className="mt-4 break-words font-semibold">
                {member.fullName}
              </h3>

              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-slate-500">ชื่อเล่น</dt>
                  <dd className="mt-1">{member.nickname}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">รหัสนักศึกษา</dt>
                  <dd className="mt-1">{member.studentId}</dd>
                </div>
                <div className="rounded-lg bg-blue-50 p-3">
                  <dt className="font-medium text-blue-700">
                    หน้าที่รับผิดชอบ
                  </dt>
                  <dd className="mt-1 whitespace-pre-line text-slate-600">
                    {member.responsibility}
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>

        <p className="mt-4 text-xs text-slate-500">
          ข้อมูลสมาชิกเป็นข้อมูลตัวอย่าง รอเพิ่มเติมข้อมูลและรูปจริง
        </p>
      </section>

      <section
        aria-labelledby="data-source-heading"
        className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-5 sm:p-6"
      >
        <h2 id="data-source-heading" className="font-semibold">
          แหล่งข้อมูลเกม
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          ข้อมูลเกม รูปภาพ และคะแนนที่แสดงในเว็บไซต์มาจาก RAWG Video Games
          Database
        </p>

        <div className="mt-3 flex flex-wrap gap-4 text-sm">
          <a
            href="https://rawg.io/"
            className="font-medium text-blue-700 underline underline-offset-4"
          >
            เว็บไซต์ RAWG
          </a>
          <a
            href="https://rawg.io/apidocs"
            className="font-medium text-blue-700 underline underline-offset-4"
          >
            เอกสาร RAWG API
          </a>
        </div>
      </section>

      <section
        aria-labelledby="technology-heading"
        className="mt-5 rounded-lg border border-slate-200 bg-white p-5 sm:p-6"
      >
        <h2 id="technology-heading" className="font-semibold">
          เทคโนโลยีที่ใช้
        </h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          React 19 · Vite · TypeScript · React Router 7 · TanStack Query 5 ·
          Zustand Persist · Tailwind CSS · DaisyUI
        </p>
      </section>
    </>
  );
}
