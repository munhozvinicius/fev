
import { NextRequest, NextResponse } from "next/server";
import { readLeadById, readItemsLatestByLead, updateLeadById, appendItemsWithRev, getItemsNextRev } from "@/lib/sheets";

function onlyDigits(s: string){ return (s||"").replace(/\D+/g, ""); }

export async function GET(_req: NextRequest, { params }: { params: { id: string } }){
  try{
    const lead = await readLeadById(params.id);
    const items = await readItemsLatestByLead(params.id);
    return NextResponse.json({ ok:true, lead, items });
  }catch(e:any){
    return NextResponse.json({ ok:false, error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }){
  try{
    const body = await req.json();
    const leadPatch = body?.leadPatch || {};
    const items = body?.items || [];
    if(leadPatch.cnpj) leadPatch.cnpj = onlyDigits(String(leadPatch.cnpj));
    await updateLeadById(params.id, leadPatch);
    if(Array.isArray(items)){
      const rev = await getItemsNextRev(params.id);
      await appendItemsWithRev(params.id, items, rev);
    }
    return NextResponse.json({ ok:true });
  }catch(e:any){
    return NextResponse.json({ ok:false, error: e.message }, { status: 500 });
  }
}
