import PageHeader from "../components/PageHeader";

// กำหนดรูปแบบข้อมูลสมาชิกเพื่อให้การ์ดแต่ละคนใช้ฟิลด์เดียวกัน
interface TeamMember {
  name: string;
  fullName: string;
  nickname: string;
  studentId: string;
  responsibility: string[];
  photo: string;
}

// ข้อมูลสมาชิกและหน้าที่รายบุคคล; photo ว่างจะแสดงอักษรแรกของชื่อเล่นแทนรูป
const members: TeamMember[] = [
  {
    name: "เขมเดช เหนียวแน่น",
    fullName: "เขมเดช เหนียวแน่น",
    nickname: "ต้น",
    studentId: "1660702844",
    responsibility: [
      "ตั้งค่าโปรเจกต์ React 19, Vite และ TypeScript",
      "จัดการเส้นทางเว็บไซต์ด้วย React Router v7",
      "เชื่อมต่อ RAWG API ด้วย TanStack Query",
      "พัฒนาหน้า Discover Games สำหรับค้นหาและแสดงรายการเกม",
      "พัฒนาหน้า Game Details สำหรับแสดงรายละเอียดเกม",
    ],
    photo: "/member/mem1.jpg",
  },
  {
    name: "วชิรวิทย์ ตันติพูลผล",
    fullName: "วชิรวิทย์ ตันติพูลผล",
    nickname: "เติ้ล",
    studentId: "1660704980",
    responsibility: [
      "จัดการข้อมูลเกมโปรดด้วย Zustand และ LocalStorage",
      "พัฒนาหน้า My Collection สำหรับจัดเก็บเกมโปรด",
      "พัฒนาหน้า Compare Games สำหรับเปรียบเทียบเกม 2 เกม",
      "พัฒนาหน้า About สำหรับแสดงข้อมูลสมาชิกและแหล่งข้อมูล API",
      "ออกแบบและปรับแต่ง UI ด้วย Tailwind CSS และ DaisyUI",
    ],
    photo: "/member/mem2.jpg",
  },
];

// หน้าที่ทำด้วยกัน
const sharedResponsibilities: string[] = [
  "วางแผนและออกแบบ UI/UX",
  "กำหนดโครงสร้างข้อมูลด้วย TypeScript",
  "ทดสอบระบบและแก้ไขข้อผิดพลาด",
  "จัดเตรียมไฟล์และเอกสารสำหรับส่งโครงงาน",
]

// หน้าแสดงข้อมูลทีมและเครดิต API จากข้อมูลในไฟล์นี้ ไม่ได้เรียก RAWG
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
          {/* สร้างการ์ดจากรายการสมาชิก และใช้รหัสนักศึกษาเป็น key */}
          {members.map((member) => (
            <article
              key={member.studentId}
              className="min-w-0 rounded-lg border border-slate-200 p-6 text-center"
            >
              {/* มี path รูปจึงแสดง img; ถ้าไม่มีใช้ fallback ไม่ได้หมายถึงการดักรูปโหลดเสียทุกกรณี */}
              {member.photo ? (
                <img
                  src={member.photo}
                  alt={`รูปของ ${member.fullName}`}
                  className="mx-auto size-24 rounded-full object-cover"
                />
              ) : (
                <div
                  className="mx-auto grid size-24 place-items-center rounded-full bg-blue-50 text-3xl font-bold text-blue-600"
                  aria-label={`ยังไม่มีรูป ${member.fullName}`}
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
                  <dd className="mt-2 text-left text-slate-600">
                    <ul className="list-disc space-y-2 pl-5">
                      {member.responsibility.map((responsibility) => (
                        <li key={responsibility}>{responsibility}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>

        {/* หน้าที่ร่วมกัน แสดงครั้งเดียวใต้การ์ดสมาชิก */}
      <div className="mt-5 rounded-lg bg-blue-50 p-5">
        <h3 className="font-semibold text-blue-700">
          หน้าที่รับผิดชอบร่วมกัน
        </h3>

        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
          {sharedResponsibilities.map((responsibility) => (
            <li key={responsibility}>
              {responsibility}
            </li>
          ))}
        </ul>
      </div>
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
