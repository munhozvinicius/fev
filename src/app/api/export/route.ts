
import { NextRequest } from "next/server";
import { readSheet } from "@/lib/sheets";

export async function GET(req: NextRequest){
  const url = new URL(req.url);
  const kind = url.searchParams.get("kind") || "leads";
  const stage = url.searchParams.get("stage") || "";
  const rows:any[] = await readSheet(kind);
  let data = rows;
  if(stage) data = data.filter(r => String(r.etapa||"") === stage);
  if(!data.length) return new Response("Sem dados", { headers: { "Content-Type": "text/plain" } });
  const headers = Object.keys(data[0]);
  const csv = [headers.join(","), ...data.map(r => headers.map(h => `"${String(r[h]??"").replace(/"/g,'""')}"`).join(","))].join("\n");
  return new Response(csv, { headers: { "Content-Type":"text/csv; charset=utf-8", "Content-Disposition": `attachment; filename=${kind}.csv` } });
}
