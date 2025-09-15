import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import HomePage from "@/app/(home)/page"; // ✅ ถ้าใช้ App Router (Next.js 13+)

describe("Homepage Unit Tests", () => {
  test("UT-001 Navbar: แสดงเมนูครบถ้วน", () => {
    render(<HomePage />);
    expect(screen.getByText("หน้าหลัก")).toBeInTheDocument();
    expect(screen.getByText("กิจกรรม")).toBeInTheDocument();
    expect(screen.getByText("ตารางชีวิต")).toBeInTheDocument();
    expect(screen.getByText("วิธีใช้งาน")).toBeInTheDocument();
    expect(screen.getByAltText("LifeGear Logo")).toBeInTheDocument();
  });

  test("UT-002 Slider: แสดงภาพตรงตามที่กำหนด", () => {
    render(<HomePage />);
    const banner = screen.getByAltText("Banner 1");
    expect(banner).toBeInTheDocument();
  });

  test("UT-003 Slider: คลิกปุ่มซ้าย/ขวาแล้วภาพเปลี่ยน", () => {
    render(<HomePage />);
    const nextButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextButton);
    expect(screen.getByAltText("Banner 2")).toBeInTheDocument();
  });

  test("UT-004 Welcome Section: แสดงข้อความต้อนรับ", () => {
    render(<HomePage />);
    expect(
      screen.getByText(/ขอต้อนรับเข้าสู่เว็บไซต์ LifeGear/i)
    ).toBeInTheDocument();
  });

  test("UT-005 Card: กิจกรรมทั้งหมด ไปยังหน้ากิจกรรม", () => {
    render(<HomePage />);
    const card = screen.getByText("กิจกรรมทั้งหมด");
    expect(card).toBeInTheDocument();
    fireEvent.click(card);
    // TODO: mock router push ถ้าต้องการทดสอบ navigation จริง
  });

  test("UT-008 Footer: มีข้อความลิขสิทธิ์", () => {
    render(<HomePage />);
    expect(
      screen.getByText(/Copyright ©2025 Designed by/)
    ).toBeInTheDocument();
  });

  test("UT-011 Footer Gmail: เปิด mailto link", () => {
    render(<HomePage />);
    const gmailLink = screen.getByRole("link", { name: /gmail/i });
    expect(gmailLink).toHaveAttribute(
      "href",
      "mailto:lifegear.tu@gmail.com"
    );
  });
});
