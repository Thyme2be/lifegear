// src/utils/time.ts
// ⚠️ Deprecated shim: ควรย้ายไป import จาก "@/lib/datetime" โดยตรงในอนาคต
export {
  // เวลาสั้น/ช่วงเวลา/แปลง ymd จาก ISO
  toHm,
  safeRangeHm,
  ymdFromISO,
  // ชื่อเดิมในโค้ด: dayStart/dayEnd -> map ไปที่ startOfDay/endOfDay
  startOfDay as dayStart,
  endOfDay as dayEnd,
  // รูปแบบวันที่ไทย
  formatThaiDate,
  formatThaiRangeFromISO,
  // อื่น ๆ ที่อาจต้องใช้ร่วม
  THAI_MONTHS,
  toYmdLocal,
} from "@/lib/datetime";
