
import { google } from "googleapis";

const REQUIRED = ["SHEET_ID","GOOGLE_SERVICE_ACCOUNT_EMAIL","GOOGLE_SERVICE_ACCOUNT_KEY"] as const;
function env(name: string){ const v = process.env[name]; if(!v) throw new Error(`Missing env ${name}`); return v; }
function jwt(){
  const email = env("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const key = env("GOOGLE_SERVICE_ACCOUNT_KEY").replace(/\\n/g, "\n");
  return new google.auth.JWT({ email, key, scopes: ["https://www.googleapis.com/auth/spreadsheets"] });
}
export async function readSheet<T=any>(name: string): Promise<T[]> {
  REQUIRED.forEach(env);
  const sheets = google.sheets({version:"v4", auth: jwt()});
  const spreadsheetId = env("SHEET_ID");
  const { data } = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${name}!A1:ZZ9999` });
  const rows = data.values || [];
  if(!rows.length) return [];
  const headers = rows[0];
  return rows.slice(1).map(r => {
    const o:any = {}; headers.forEach((h:any,i:number)=> o[h] = r[i] ?? ""); return o;
  });
}
export async function appendRows(name: string, rows: any[][]){
  REQUIRED.forEach(env);
  const sheets = google.sheets({version:"v4", auth: jwt()});
  const spreadsheetId = env("SHEET_ID");
  await sheets.spreadsheets.values.append({
    spreadsheetId, range: `${name}!A1`, valueInputOption: "USER_ENTERED",
    requestBody: { values: rows }
  });
}
export async function updateLeadById(id: string, patch: Record<string,string>){
  REQUIRED.forEach(env);
  const sheets = google.sheets({version:"v4", auth: jwt()});
  const spreadsheetId = env("SHEET_ID");
  const { data } = await sheets.spreadsheets.values.get({ spreadsheetId, range: `leads!A1:ZZ9999` });
  const rows = data.values || []; if(!rows.length) throw new Error("Sheet leads vazio");
  const headers = rows[0] as string[];
  const idx: Record<string,number> = {}; headers.forEach((h,i)=> idx[h]=i);
  const rowIdx = rows.findIndex((r,i)=> i>0 && r[idx["id"]] === id);
  if(rowIdx<0) throw new Error("Lead não encontrado");
  const updates = Object.entries(patch).filter(([k])=> k in idx).map(([k,v])=> ({
    range: `leads!${String.fromCharCode(65+idx[k])}${rowIdx+1}`, values: [[v]]
  }));
  if(!updates.length) return;
  await sheets.spreadsheets.values.batchUpdate({ spreadsheetId, requestBody:{ valueInputOption:"USER_ENTERED", data: updates } });
}
export async function readLeadById(id: string){
  const rows:any[] = await readSheet("leads"); return rows.find(r => String(r.id)===String(id));
}
export async function readItemsLatestByLead(leadId: string){
  const itens:any[] = await readSheet("itens");
  const filtered = itens.filter(i => String(i.leadId)===String(leadId));
  if(!filtered.length) return [];
  const maxRev = Math.max(...filtered.map(i => Number(i.rev||1)));
  return filtered.filter(i => Number(i.rev||1)===maxRev);
}
export async function getItemsNextRev(leadId: string){
  const itens:any[] = await readSheet("itens");
  const filtered = itens.filter(i => String(i.leadId)===String(leadId));
  if(!filtered.length) return 1;
  const maxRev = Math.max(...filtered.map(i => Number(i.rev||1)));
  return maxRev+1;
}
export async function appendItemsWithRev(leadId: string, items:any[], rev:number){
  const rows = items.map(i => [leadId, String(i.pilar||""), String(i.tipo||""), String(i.prazo||""), String(i.produto||""), String(i.qtd||""), String(i.preco||""), String(i.total||""), String(rev)]);
  await appendRows("itens", rows);
}
