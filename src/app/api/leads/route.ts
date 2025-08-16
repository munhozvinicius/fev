
import { NextRequest, NextResponse } from "next/server";
import { readSheet, appendRows } from "@/lib/sheets";

export async function GET(req: NextRequest){
  try{
    const url = new URL(req.url);
    const q = (url.searchParams.get("q") || "").toLowerCase();
    const stages = url.searchParams.getAll("stage");
    const quick = url.searchParams.get("quick");

    const rows:any[] = await readSheet("leads");
    let data = rows;
    if(q) data = data.filter(r => (String(r.razao||"")+" "+String(r.cnpj||"")).toLowerCase().includes(q));
    if(stages.length) data = data.filter(r => stages.includes(String(r.etapa)));
    if(quick === "ativos") data = data.filter(r => !["6 - Fechado - Ganho","7 - Fechado - Perdido"].includes(String(r.etapa)));
    if(quick === "falou") data = data.filter(r => ["2 - Contato Inicial","3 - Qualificação","4 - Proposta Enviada","5 - Negociação"].includes(String(r.etapa)));
    if(quick === "precisa_contato") data = data.filter(r => String(r.etapa) === "1 - Prospecção");

    return NextResponse.json({ ok:true, rows: data });
  }catch(e:any){
    return NextResponse.json({ ok:false, error: e.message }, { status: 500 });
  }
}

function onlyDigits(s: string){ return (s||"").replace(/\D+/g, ""); }

export async function POST(req: NextRequest){
  try{
    const payload = await req.json();
    const lead = payload?.lead; const items = payload?.items || [];
    if(!lead) return NextResponse.json({ ok:false, error:"payload inválido" }, { status:400 });
    const id = String(lead.id||"");
    const row = [
      id,
      String(lead.data||""),
      String(lead.parceiro||""),
      String(lead.consultorEmail||""),
      String(lead.consultorNome||""),
      String(lead.razao||""),
      onlyDigits(String(lead.cnpj||"")),
      String(lead.etapa||""),
      String(lead.previsao||""),
      String(lead.obs||""),
      String(lead.total||"")
    ];
    await appendRows("leads", [row]);
    if(items.length){
      const itemRows = items.map((it:any)=> [
        id, String(it.pilar||""), String(it.tipo||""), String(it.prazo||""), String(it.produto||""), String(it.qtd||""), String(it.preco||""), String(it.total||""), "1"
      ]);
      await appendRows("itens", itemRows);
    }
    return NextResponse.json({ ok:true });
  }catch(e:any){
    return NextResponse.json({ ok:false, error: e.message }, { status: 500 });
  }
}
