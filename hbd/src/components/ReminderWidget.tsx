import '../css/ReminderWidget.css'

interface BirthdayReminderWidgetProps {
  birthDate: Date; // วันเกิด เช่น new Date(2025, 10, 6) (เดือน 0-index)
  message?: string; // ข้อความเตือน (optional)
}

export default function ReminderWidget({
  birthDate,
  message = "January",
}: BirthdayReminderWidgetProps) {
  const today = new Date();
  const year = today.getFullYear();

  // สร้างวันเกิดปีนี้ (เดือน 0-index)
  const birthdayThisYear = new Date(year, birthDate.getMonth(), birthDate.getDate());

  // ฟังก์ชันเช็ควันที่ว่าเป็นวันเกิดไหม
//   const isBirthday =
//     today.getDate() === birthdayThisYear.getDate() &&
//     today.getMonth() === birthdayThisYear.getMonth();

  // ฟังก์ชันสร้าง array วันของเดือนนั้น (สำหรับโชว์ปฏิทิน)
  const getDaysInMonth = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const daysInMonth = getDaysInMonth(year, birthDate.getMonth());

  return (
    <div
      style={{
        background: "rgb(255, 220, 179)",
        color: "#3b2f00",
        padding: "10px 20px",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(255, 165, 0, 0.5)",
        maxWidth: "280px",
        userSelect: "none",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        margin: "10px auto",
        textAlign: "center",
      }}
      aria-live="polite"
      role="region"
      aria-label="เตือนวันเกิด"
    >
      <div
        style={{
          fontWeight: "700",
          fontSize: "1.2rem",
          marginBottom: "8px",
          display: "flex",
          justifyContent: "center",
          gap: "6px",
          alignItems: "center",
        }}
      >
        <span>{message}</span>
      </div>

      {/* ปฏิทินเดือนวันเกิด */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "6px",
          justifyItems: "center",
          fontSize: "0.85rem",
        }}
      >
        {/* แสดงชื่อวัน (อาทิตย์-เสาร์) */}
        {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
          <div
            key={day}
            style={{
              fontWeight: "600",
              color: "#6b4c00",
            }}
          >
            {day}
          </div>
        ))}

        {/* เว้นช่องว่างก่อนวันแรกของเดือน */}
        {Array(daysInMonth[0].getDay())
          .fill(null)
          .map((_, i) => (
            <div key={"blank-" + i} />
          ))}

        {/* แสดงวันในเดือน */}
        {daysInMonth.map((date) => {
          const isBirth = date.getDate() === birthdayThisYear.getDate();

          return (
            <div
              key={date.toISOString()}
              className={isBirth ? "birthday-cell" : ""}
              style={{
                width: "28px",
                height: "28px",
                lineHeight: "28px",
                borderRadius: "50%",
                backgroundColor: isBirth ? "#fff8dc" : "transparent",
                color: isBirth ? "#b8860b" : "#3b2f00",
                fontWeight: isBirth ? "700" : "400",
                position: "relative",
                userSelect: "none",
                cursor: isBirth ? "default" : "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {isBirth ? (
                <div className="tooltip-wrapper">
                  <span className="pin-icon" aria-hidden="true">📌</span>
                  {date.getDate()}
                  <div className="tooltip-text">06/01🎂</div>
                </div>
              ) : (
                date.getDate()
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
