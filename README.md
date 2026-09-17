# FloriCode

ภาษาดอกไม้ & ระบบจำลองจัดช่อดอกไม้เสมือนจริง (Flower Meaning & Virtual Bouquet Builder) — เว็บแอปเชิงโต้ตอบสไตล์ cute & minimal cartoon โทน cozy pastel

## Features

- **พจนานุกรมดอกไม้** — ค้นหาดอกไม้ 17 ชนิดแบบ real-time ทั้งชื่อและความรู้สึก, กรองตามโทนสี/โอกาส/อารมณ์, ดูประวัติและที่มาแบบละเอียดใน modal
- **จัดช่อดอกไม้เสมือนจริง** — เลือกดอกไม้, ลาก/ปรับขนาด/หมุนองศา, เลือกทรงช่อ, กระดาษห่อ, ริบบิ้น/โบว์, การ์ดข้อความและพร็อพตกแต่ง
- **สรุป & แชร์** — คำนวณความหมายรวมของช่อจากดอกไม้ที่เลือก, บันทึกภาพ PNG, คัดลอกลิงก์แชร์, สร้างการ์ดอวยพรดิจิทัล

## Tech Stack

React + Vite + TypeScript + Tailwind CSS + Framer Motion + Lucide Icons + html-to-image

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Docker

```bash
docker compose up -d --build
```

Serves on container port `8080` (see `docker-compose.yml` for the host port mapping).
