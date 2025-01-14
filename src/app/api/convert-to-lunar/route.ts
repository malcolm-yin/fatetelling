import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { year, month, day, hour } = await req.json();

  // 伪代码：用实际农历算法替换
  const lunarDate = `农历计算结果: ${year}-${month}-${day || '01'} ${hour || '00'}:00`;

  return NextResponse.json({ lunarDate });
}
