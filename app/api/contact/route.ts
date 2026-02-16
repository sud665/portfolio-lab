import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface ContactBody {
  name: string;
  contact: string;
  service: string;
  description: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as ContactBody;
  const { name, contact, service, description } = body;

  if (!name || !contact || !description) {
    return NextResponse.json(
      { error: "필수 항목을 모두 입력해주세요." },
      { status: 400 },
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const html = `
    <h2>새 프로젝트 문의</h2>
    <table style="border-collapse:collapse;width:100%;max-width:500px">
      <tr><td style="padding:8px 12px;font-weight:bold;color:#555">이름</td><td style="padding:8px 12px">${name}</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px 12px;font-weight:bold;color:#555">연락처</td><td style="padding:8px 12px">${contact}</td></tr>
      <tr><td style="padding:8px 12px;font-weight:bold;color:#555">서비스</td><td style="padding:8px 12px">${service || "미선택"}</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px 12px;font-weight:bold;color:#555">설명</td><td style="padding:8px 12px">${description}</td></tr>
    </table>
  `;

  try {
    await transporter.sendMail({
      from: `"포트폴리오 문의" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `[문의] ${name} — ${service || "일반"}`,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "메일 발송에 실패했습니다." },
      { status: 500 },
    );
  }
}
