import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([], { status: 200 });         // temporary empty list
}

export async function POST() {
  return NextResponse.json({ ok: true }, { status: 201 }); // no-op stub
}
