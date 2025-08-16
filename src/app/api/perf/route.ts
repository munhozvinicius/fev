
import { NextRequest, NextResponse } from "next/server";
import { readSheet } from "@/lib/sheets";

const CLOSED = ["6 - Fechado - Ganho","7 - Fechado - Perdido"];

export async function GET(req: NextRequest){
  try{
    const url = new URL(req.url);
    const rows:any[] = await readSheet("leads");
    const byStage: Record<string, {count:number, total:number}> = {};
    let ganhos = 0, perdidos = 0;
    for(const r of rows){
      const s = String(r.etapa||"");
      const t = Number(String(r.total||"").replace(",",".")||0) || 0;
      byStage[s] = byStage[s] || {count:0, total:0};
      byStage[s].count += 1; byStage[s].total += t;
      if(s==="6 - Fechado - Ganho") ganhos += 1;
      if(s==="7 - Fechado - Perdido") perdidos += 1;
    }
    const pipeline = Object.entries(byStage).filter(([s])=> !CLOSED.includes(s)).reduce((acc,[,v])=> acc+v.total, 0);
    const conv = (ganhos+perdidos) ? ganhos/(ganhos+perdidos) : 0;
    return NextResponse.json({ ok:true, byStage, pipeline, ganhos, perdidos, conversao: conv });
  }catch(e:any){
    return NextResponse.json({ ok:false, error: e.message }, { status: 500 });
  }
}
