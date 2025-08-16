
"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { PARTNERS, CONSULTORS_BY_PARTNER } from "@/lib/people";
import {
  MOVEL, FIXA_BASICA, VOZ_SIP, VOZ_VVN_24, VOZ_VVN_36, VOZ_0800_ILIMITADO,
  DADOS_LINK_SOLO, COMBO
} from "@/lib/catalog";

const STAGES = [
  "1 - Prospecção","2 - Contato Inicial","3 - Qualificação","4 - Proposta Enviada",
  "5 - Negociação","6 - Fechado - Ganho","7 - Fechado - Perdido",
] as const;

type CartItem = { pilar:string; tipo:string; produto:string; prazo?:string; qtd:number; preco:number; total:number; };
const money = (n:number)=> n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const todayISO = ()=> new Date().toISOString().slice(0,10);
const genId = ()=> `${new Date().toISOString().slice(0,10).replace(/-/g,"")}-${Math.floor(Math.random()*90000+10000)}`;

export default function AppFunil(){
  const { data: session } = useSession();

  // Abas
  const [mode, setMode] = React.useState<"criar"|"editar"|"perf">("editar");

  // Filtros de edição/lista
  const [q, setQ] = React.useState("");
  const [quick, setQuick] = React.useState("");
  const [stages, setStages] = React.useState<string[]>([]);
  const [partner, setPartner] = React.useState<string>("");
  const [consultor, setConsultor] = React.useState<string>("");
  const [rows, setRows] = React.useState<any[]>([]);
  const limparFiltros = ()=>{ setQ(""); setQuick(""); setStages([]); setPartner(""); setConsultor(""); };

  // Criação
  const [parceiro, setParceiro] = React.useState<string>(PARTNERS[0]);
  const [consultorNome, setConsultorNome] = React.useState<string>("");
  const [razao, setRazao] = React.useState(""); const [cnpj, setCnpj] = React.useState("");
  const [etapa, setEtapa] = React.useState<string>(STAGES[0]); const [previsao, setPrevisao] = React.useState(todayISO());
  const [obs, setObs] = React.useState("");

  // Carrinho
  const [pilar, setPilar] = React.useState<string>("Móvel");
  const [tipo, setTipo] = React.useState<string>("Planos");
  const [produto, setProduto] = React.useState<string>(""); const [prazo, setPrazo] = React.useState<string>("");
  const [qtd, setQtd] = React.useState<number>(1); const [preco, setPreco] = React.useState<number>(0);
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const totalCarrinho = cart.reduce((a,b)=>a+b.total,0);

  // Detalhe/edição
  const [detail, setDetail] = React.useState<any>(null);
  const [detailCart, setDetailCart] = React.useState<CartItem[]>([]);
  const totalDetail = detailCart.reduce((a,b)=>a+b.total,0);

  // Consultores ao trocar parceiro (criação)
  React.useEffect(()=>{ const list = CONSULTORS_BY_PARTNER[parceiro as any] || []; if(list.length) setConsultorNome(list[0]); },[parceiro]);

  // Opções por pilar
  const optionsDoPilar = (p:string)=>{
    switch(p){
      case "Móvel": return MOVEL;
      case "Fixa Básica": return FIXA_BASICA;
      case "Voz Avançada": return [...VOZ_SIP, ...VOZ_VVN_24, ...VOZ_VVN_36, ...VOZ_0800_ILIMITADO];
      case "Dados Avançados": return DADOS_LINK_SOLO;
      case "Combo Dados+Voz": return COMBO;
      default: return [];
    }
  };
  const tipos = Array.from(new Set(optionsDoPilar(pilar).map(o=>o.tipo)));
  React.useEffect(()=>{ setTipo(tipos[0] || ""); },[pilar]);
  const produtos = optionsDoPilar(pilar).filter(o=>o.tipo===tipo);
  React.useEffect(()=>{ const o=produtos[0]; setProduto(o?.produto||""); setPrazo(o?.prazo||""); setPreco(o?.preco||0); setQtd(1); },[tipo]);
  React.useEffect(()=>{ const o=produtos.find(p=>p.produto===produto); if(o){ setPrazo(o.prazo||""); setPreco(o.preco); } },[produto]);

  const addItem = ()=>{ if(!produto) return; setCart(v=>[...v,{pilar,tipo,produto,prazo,qtd,preco,total:+(preco*qtd).toFixed(2)}]); };
  const removeItem = (i:number)=> setCart(v=> v.filter((_,idx)=>idx!==i));
  const limparCarrinho = ()=> setCart([]);

  // Listar (editar)
  React.useEffect(()=>{
    if(mode!=="editar") return;
    const url = new URL("/api/leads", window.location.origin);
    if(q) url.searchParams.set("q", q);
    stages.forEach(s=> url.searchParams.append("stage", s));
    if(quick) url.searchParams.set("quick", quick);
    if(partner) url.searchParams.set("partner", partner);
    if(consultor) url.searchParams.set("consultor", consultor);
    fetch(url.toString()).then(r=>r.json()).then(j=> setRows(j.rows||[]));
  },[mode,q,stages,quick,partner,consultor]);

  // Criar lead
  async function handleCreate(e:React.FormEvent){
    e.preventDefault();
    const id = genId();
    const data = new Date().toLocaleDateString("pt-BR");
    const consultorEmail = session?.user?.email || "";
    const payload = {
      lead: { id, data, parceiro, consultorEmail, consultorNome, razao, cnpj, etapa, previsao, obs, total: totalCarrinho.toFixed(2) },
      items: cart
    };
    const r = await fetch("/api/leads", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(payload) });
    const j = await r.json(); if(!j.ok){ alert("Erro ao criar: "+j.error); return; }
    setRazao(""); setCnpj(""); setObs(""); setCart([]); setMode("editar");
  }

  // Abrir detalhe
  async function openDetail(id:string){
    const r = await fetch(`/api/leads/${id}`); const j = await r.json();
    if(!j.ok){ alert("Erro ao carregar lead"); return; }
    setDetail(j.lead);
    setDetailCart((j.items||[]).map((i:any)=>({ pilar:i.pilar, tipo:i.tipo, produto:i.produto, prazo:i.prazo, qtd:+(i.qtd||1), preco:+(i.preco||0), total:+(i.total||0) })));
  }
  const detailRemove = (i:number)=> setDetailCart(v=> v.filter((_,idx)=> idx!==i));
  const detailAdd = (it:CartItem)=> setDetailCart(v=> [...v, it]);

  async function saveDetail(){
    if(!detail) return;
    const leadPatch = {
      parceiro: detail.parceiro||"", consultorNome: detail.consultorNome||"", consultorEmail: detail.consultorEmail||"",
      razao: detail.razao||"", cnpj: detail.cnpj||"", etapa: detail.etapa||"", previsao: detail.previsao||"", obs: detail.obs||"",
      total: totalDetail.toFixed(2),
    };
    const r = await fetch(`/api/leads/${detail.id}`, {
      method:"PUT", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ leadPatch, items: detailCart })
    });
    const j = await r.json(); if(!j.ok){ alert("Erro ao salvar: "+j.error); return; }
    alert("Atualizado!");
  }

  // Performance
  const [perf,setPerf] = React.useState<any>(null);
  async function loadPerf(){
    const url = new URL("/api/perf", window.location.origin);
    if(partner) url.searchParams.set("partner", partner);
    if(consultor) url.searchParams.set("consultor", consultor);
    const r = await fetch(url.toString()); const j = await r.json(); if(j.ok) setPerf(j);
  }
  React.useEffect(()=>{ if(mode==="perf") loadPerf(); },[mode,partner,consultor]);
  function download(kind:"leads"|"itens", stage?:string){
    const url = new URL("/api/export", window.location.origin);
    url.searchParams.set("kind", kind);
    if(partner) url.searchParams.set("partner", partner);
    if(consultor) url.searchParams.set("consultor", consultor);
    if(stage) url.searchParams.set("stage", stage);
    window.open(url.toString(), "_blank");
  }

  return (
    <div className="p-4 space-y-4">
      {/* Branding no topo (adicione seu arquivo em public/fev-logo.png) */}
      <div className="flex items-center gap-3">
        <img src="/fev-logo.png" alt="FEV logo" className="h-12 w-12 rounded-full" />
        <h1 className="text-2xl font-bold">FEV — Funil Especialista do Vini</h1>
      </div>

      {/* Abas */}
      <div className="flex gap-2">
        <button onClick={()=>setMode("criar")} className={`px-3 py-2 rounded-xl ${mode==="criar"?"bg-purple-900 text-white":"bg-gray-200"}`}>Criar</button>
        <button onClick={()=>setMode("editar")} className={`px-3 py-2 rounded-xl ${mode==="editar"?"bg-purple-900 text-white":"bg-gray-200"}`}>Editar</button>
        <button onClick={()=>setMode("perf")} className={`px-3 py-2 rounded-xl ${mode==="perf"?"bg-purple-900 text-white":"bg-gray-200"}`}>Performance</button>
      </div>

      {/* Criar */}
      {mode==="criar" && (
        <form onSubmit={handleCreate} className="space-y-6">
          <div className="space-y-4 max-w-6xl rounded-2xl border p-4">
            <h2 className="text-lg font-semibold">Dados do cliente</h2>
            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm mb-1">Parceiro</label>
                <select value={parceiro} onChange={e=>setParceiro(e.target.value)} className="w-full rounded-xl border px-3 py-2">
                  {PARTNERS.map(p=> <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Consultor</label>
                <select value={consultorNome} onChange={e=>setConsultorNome(e.target.value)} className="w-full rounded-xl border px-3 py-2">
                  {(CONSULTORS_BY_PARTNER[parceiro as any] || []).map(n=> <option key={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">E-mail do consultor</label>
                <input disabled value={session?.user?.email || ""} className="w-full rounded-xl border px-3 py-2 bg-gray-100" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm mb-1">Razão Social</label>
                <input required value={razao} onChange={e=>setRazao(e.target.value)} className="w-full rounded-xl border px-3 py-2" placeholder="ACME LTDA"/>
              </div>
              <div>
                <label className="block text-sm mb-1">CNPJ</label>
                <input value={cnpj} onChange={e=>setCnpj(e.target.value)} className="w-full rounded-xl border px-3 py-2" placeholder="00.000.000/0000-00"/>
                <p className="text-xs text-gray-500 mt-1">Pode digitar com pontos e traços — salvamos só os dígitos na planilha.</p>
              </div>
              <div>
                <label className="block text-sm mb-1">Etapa</label>
                <select value={etapa} onChange={e=>setEtapa(e.target.value)} className="w-full rounded-xl border px-3 py-2">
                  {STAGES.map(s=> <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Previsão</label>
                <input type="date" value={previsao} onChange={e=>setPrevisao(e.target.value)} className="w-full rounded-xl border px-3 py-2"/>
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm mb-1">Observações</label>
                <textarea value={obs} onChange={e=>setObs(e.target.value)} className="w-full rounded-xl border px-3 py-2" rows={3} placeholder="Notas rápidas..."/>
              </div>
            </div>
          </div>

          <div className="space-y-4 max-w-6xl rounded-2xl border p-4">
            <h2 className="text-lg font-semibold">Selecionar produtos (carrinho)</h2>
            <div className="grid md:grid-cols-6 gap-3 items-end">
              <div>
                <label className="block text-sm mb-1">Pilar</label>
                <select value={pilar} onChange={e=>setPilar(e.target.value)} className="w-full rounded-xl border px-3 py-2">
                  <option>Móvel</option><option>Fixa Básica</option><option>Voz Avançada</option><option>Dados Avançados</option><option>Combo Dados+Voz</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Tipo</label>
                <select value={tipo} onChange={e=>setTipo(e.target.value)} className="w-full rounded-xl border px-3 py-2">
                  {Array.from(new Set(optionsDoPilar(pilar).map(o=>o.tipo))).map(t=> <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm mb-1">Produto</label>
                <select value={produto} onChange={e=>setProduto(e.target.value)} className="w-full rounded-xl border px-3 py-2">
                  {optionsDoPilar(pilar).filter(o=>o.tipo===tipo).map(p=> <option key={p.produto}>{p.produto}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Prazo</label>
                <input value={prazo||""} onChange={e=>setPrazo(e.target.value)} className="w-full rounded-xl border px-3 py-2" placeholder="ex.: 24 meses"/>
              </div>
              <div>
                <label className="block text-sm mb-1">Qtd</label>
                <input type="number" min={1} value={qtd} onChange={e=>setQtd(parseInt(e.target.value||"1"))} className="w-full rounded-xl border px-3 py-2"/>
              </div>
              <div>
                <label className="block text-sm mb-1">Preço (R$)</label>
                <input type="number" step="0.01" value={preco} onChange={e=>setPreco(parseFloat(e.target.value||"0"))} className="w-full rounded-xl border px-3 py-2"/>
                <p className="text-xs text-gray-500 mt-1">Para 0800 Flex, digite o nome do produto e ajuste o preço manual.</p>
              </div>
              <div className="md:col-span-6">
                <button type="button" onClick={addItem} className="px-4 py-2 rounded-xl bg-purple-900 text-white">Adicionar ao carrinho</button>
                <button type="button" onClick={limparCarrinho} className="ml-2 px-4 py-2 rounded-xl bg-gray-200">Limpar carrinho</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead><tr className="text-gray-700">
                  <th className="py-2 pr-4 text-left">Pilar</th><th className="py-2 pr-4 text-left">Tipo</th>
                  <th className="py-2 pr-4 text-left">Produto</th><th className="py-2 pr-4 text-left">Prazo</th>
                  <th className="py-2 pr-4 text-left">Qtd</th><th className="py-2 pr-4 text-left">Preço</th><th className="py-2 pr-4 text-left">Total</th><th></th>
                </tr></thead>
                <tbody>
                  {cart.length===0 && <tr><td className="py-6 text-gray-600" colSpan={8}>Carrinho vazio.</td></tr>}
                  {cart.map((it,idx)=>(
                    <tr key={idx} className="border-t">
                      <td className="py-2 pr-4">{it.pilar}</td><td className="py-2 pr-4">{it.tipo}</td>
                      <td className="py-2 pr-4">{it.produto}</td><td className="py-2 pr-4">{it.prazo||"-"}</td>
                      <td className="py-2 pr-4">{it.qtd}</td><td className="py-2 pr-4">{money(it.preco)}</td><td className="py-2 pr-4">{money(it.total)}</td>
                      <td className="py-2 pr-4"><button onClick={()=>removeItem(idx)} type="button" className="px-2 py-1 rounded bg-gray-200">Remover</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-right font-medium mt-2">Total do carrinho: {money(totalCarrinho)}</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="px-4 py-2 rounded-xl bg-purple-900 text-white">Salvar lead</button>
            <button type="button" onClick={()=>setMode("editar")} className="px-4 py-2 rounded-xl bg-gray-200">Cancelar</button>
          </div>
        </form>
      )}

      {/* Editar */}
      {mode==="editar" && (
        <div className="space-y-4">
          <div className="rounded-2xl border p-4 space-y-3">
            <div className="grid md:grid-cols-6 gap-3 items-end">
              <div className="md:col-span-2">
                <label className="block text-sm mb-1">Razão Social / CNPJ</label>
                <input value={q} onChange={e=>setQ(e.target.value)} className="w-full rounded-xl border px-3 py-2" placeholder="Ex.: ACME ou 123..." />
              </div>
              <div>
                <label className="block text-sm mb-1">Parceiro</label>
                <select value={partner} onChange={e=>setPartner(e.target.value)} className="w-full rounded-xl border px-3 py-2">
                  <option value="">Todos</option>
                  {PARTNERS.map(p=> <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Consultor</label>
                <select value={consultor} onChange={e=>setConsultor(e.target.value)} className="w-full rounded-xl border px-3 py-2">
                  <option value="">Todos</option>
                  {partner ? (CONSULTORS_BY_PARTNER[partner as any]||[]).map(n=> <option key={n}>{n}</option>)
                           : Object.values(CONSULTORS_BY_PARTNER).flat().map(n=> <option key={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Filtro rápido</label>
                <select value={quick} onChange={e=>setQuick(e.target.value)} className="w-full rounded-xl border px-3 py-2">
                  <option value="">—</option><option value="ativos">Ativos</option><option value="falou">Falou</option><option value="precisa_contato">Precisa contatar</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm mb-1">Etapas</label>
                <div className="flex flex-wrap gap-2">
                  {STAGES.map(s=>(
                    <button key={s}
                      onClick={()=> setStages(prev=> prev.includes(s)? prev.filter(x=>x!==s): [...prev, s])}
                      className={`px-2 py-1 rounded-full text-xs border ${stages.includes(s)?"bg-purple-900 text-white border-purple-900":"bg-white border-gray-300"}`}>
                      {s}
                    </button>
                  ))}
                  {stages.length>0 && <button onClick={()=>setStages([])} className="px-2 py-1 bg-gray-200 rounded-full text-xs">Limpar</button>}
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={limparFiltros} type="button" className="px-3 py-2 rounded-xl bg-gray-200">Limpar filtros</button>
            </div>
          </div>

          <div className="rounded-2xl border p-4 overflow-x-auto">
            <div className="mb-2 text-sm text-gray-600">Resultados: {rows.length}</div>
            <table className="min-w-full text-sm">
              <thead><tr className="text-gray-700">
                <th className="py-2 pr-4 text-left">Data</th><th className="py-2 pr-4 text-left">Parceiro</th><th className="py-2 pr-4 text-left">Consultor</th>
                <th className="py-2 pr-4 text-left">Razão Social</th><th className="py-2 pr-4 text-left">CNPJ</th><th className="py-2 pr-4 text-left">Total</th><th className="py-2 pr-4 text-left">Etapa</th><th className="py-2 pr-4 text-left">ID</th>
              </tr></thead>
              <tbody>
                {rows.length===0 && <tr><td className="py-6 text-gray-600" colSpan={8}>Nenhuma oportunidade.</td></tr>}
                {rows.map((r:any)=>(
                  <tr key={r.id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={()=>openDetail(r.id)}>
                    <td className="py-2 pr-4">{r.data}</td><td className="py-2 pr-4">{r.parceiro}</td><td className="py-2 pr-4">{r.consultorNome}</td>
                    <td className="py-2 pr-4">{r.razao}</td><td className="py-2 pr-4">{r.cnpj}</td><td className="py-2 pr-4">{r.total}</td><td className="py-2 pr-4">{r.etapa}</td><td className="py-2 pr-4">{r.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {detail && (
            <div className="rounded-2xl border p-4 space-y-4">
              <h2 className="text-lg font-semibold">Editar lead — {detail.razao} ({detail.id})</h2>
              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm mb-1">Parceiro</label>
                  <select value={detail.parceiro} onChange={e=>setDetail({...detail, parceiro:e.target.value})} className="w-full rounded-xl border px-3 py-2">
                    {PARTNERS.map(p=> <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Consultor</label>
                  <input value={detail.consultorNome||""} onChange={e=>setDetail({...detail, consultorNome:e.target.value})} className="w-full rounded-xl border px-3 py-2"/>
                </div>
                <div>
                  <label className="block text-sm mb-1">E-mail do consultor</label>
                  <input value={detail.consultorEmail||""} onChange={e=>setDetail({...detail, consultorEmail:e.target.value})} className="w-full rounded-xl border px-3 py-2"/>
                </div>
                <div className="md:col-span-2">
                  <label className="block text sm mb-1">Razão Social</label>
                  <input value={detail.razao||""} onChange={e=>setDetail({...detail, razao:e.target.value})} className="w-full rounded-xl border px-3 py-2"/>
                </div>
                <div>
                  <label className="block text-sm mb-1">CNPJ</label>
                  <input value={detail.cnpj||""} onChange={e=>setDetail({...detail, cnpj:e.target.value})} className="w-full rounded-xl border px-3 py-2"/>
                </div>
                <div>
                  <label className="block text-sm mb-1">Etapa</label>
                  <select value={detail.etapa||STAGES[0]} onChange={e=>setDetail({...detail, etapa:e.target.value})} className="w-full rounded-xl border px-3 py-2">
                    {STAGES.map(s=> <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Previsão</label>
                  <input value={detail.previsao||""} onChange={e=>setDetail({...detail, previsao:e.target.value})} className="w-full rounded-xl border px-3 py-2"/>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm mb-1">Observações</label>
                  <textarea value={detail.obs||""} onChange={e=>setDetail({...detail, obs:e.target.value})} className="w-full rounded-xl border px-3 py-2" rows={3}/>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Itens (carrinho)</h3>
                <table className="min-w-full text-sm">
                  <thead><tr className="text-gray-700">
                    <th className="py-2 pr-4 text-left">Pilar</th><th className="py-2 pr-4 text-left">Tipo</th><th className="py-2 pr-4 text-left">Produto</th><th className="py-2 pr-4 text-left">Prazo</th>
                    <th className="py-2 pr-4 text-left">Qtd</th><th className="py-2 pr-4 text-left">Preço</th><th className="py-2 pr-4 text-left">Total</th><th></th>
                  </tr></thead>
                  <tbody>
                    {detailCart.length===0 && <tr><td className="py-6 text-gray-600" colSpan={8}>Sem itens.</td></tr>}
                    {detailCart.map((it,idx)=>(
                      <tr key={idx} className="border-t">
                        <td className="py-2 pr-4">{it.pilar}</td><td className="py-2 pr-4">{it.tipo}</td>
                        <td className="py-2 pr-4">{it.produto}</td><td className="py-2 pr-4">{it.prazo||"-"}</td>
                        <td className="py-2 pr-4">{it.qtd}</td><td className="py-2 pr-4">{money(it.preco)}</td><td className="py-2 pr-4">{money(it.total)}</td>
                        <td className="py-2 pr-4"><button onClick={()=>detailRemove(idx)} type="button" className="px-2 py-1 bg-gray-200 rounded">Remover</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-right font-medium mt-2">Total: {money(totalDetail)}</div>

                <div className="grid md:grid-cols-6 gap-3 items-end mt-3">
                  <div>
                    <label className="block text-sm mb-1">Pilar</label>
                    <select value={pilar} onChange={e=>setPilar(e.target.value)} className="w-full rounded-xl border px-3 py-2">
                      <option>Móvel</option><option>Fixa Básica</option><option>Voz Avançada</option><option>Dados Avançados</option><option>Combo Dados+Voz</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Tipo</label>
                    <select value={tipo} onChange={e=>setTipo(e.target.value)} className="w-full rounded-xl border px-3 py-2">
                      {Array.from(new Set(optionsDoPilar(pilar).map(o=>o.tipo))).map(t=> <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-1">Produto</label>
                    <select value={produto} onChange={e=>setProduto(e.target.value)} className="w-full rounded-xl border px-3 py-2">
                      {optionsDoPilar(pilar).filter(o=>o.tipo===tipo).map(p=> <option key={p.produto}>{p.produto}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Prazo</label>
                    <input value={prazo||""} onChange={e=>setPrazo(e.target.value)} className="w-full rounded-xl border px-3 py-2"/>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Qtd</label>
                    <input type="number" min={1} value={qtd} onChange={e=>setQtd(parseInt(e.target.value||"1"))} className="w-full rounded-xl border px-3 py-2"/>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Preço (R$)</label>
                    <input type="number" step="0.01" value={preco} onChange={e=>setPreco(parseFloat(e.target.value||"0"))} className="w-full rounded-xl border px-3 py-2"/>
                  </div>
                  <div className="md:col-span-6">
                    <button type="button" onClick={()=>detailAdd({ pilar, tipo, produto, prazo, qtd, preco, total:+(preco*qtd).toFixed(2) })} className="px-4 py-2 rounded-xl bg-purple-900 text-white">Adicionar item</button>
                  </div>
                </div>

                <div className="flex gap-3 mt-3">
                  <button type="button" onClick={saveDetail} className="px-4 py-2 rounded-xl bg-purple-900 text-white">Salvar alterações</button>
                  <button type="button" onClick={()=>{ setDetail(null); setDetailCart([]); }} className="px-4 py-2 rounded-xl bg-gray-200">Fechar</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Performance */}
      {mode==="perf" && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-3 gap-3 rounded-2xl border p-4">
            <div>
              <label className="block text-sm mb-1">Parceiro</label>
              <select value={partner} onChange={e=>setPartner(e.target.value)} className="w-full rounded-xl border px-3 py-2">
                <option value="">Todos</option>
                {PARTNERS.map(p=> <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Consultor</label>
              <select value={consultor} onChange={e=>setConsultor(e.target.value)} className="w-full rounded-xl border px-3 py-2">
                <option value="">Todos</option>
                {partner ? (CONSULTORS_BY_PARTNER[partner as any]||[]).map(n=> <option key={n}>{n}</option>)
                         : Object.values(CONSULTORS_BY_PARTNER).flat().map(n=> <option key={n}>{n}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <button className="px-4 py-2 rounded-xl bg-purple-900 text-white" onClick={loadPerf}>Atualizar</button>
            </div>
          </div>

          {perf && (
            <div className="space-y-3">
              <div className="grid md:grid-cols-3 gap-3">
                <div className="rounded-2xl border p-4"><div className="text-sm text-gray-600">Valor em pipeline (não fechados)</div><div className="text-2xl font-semibold">{money(perf.pipeline||0)}</div></div>
                <div className="rounded-2xl border p-4"><div className="text-sm text-gray-600">Conversão (ganhos / (ganhos+perdidos))</div><div className="text-2xl font-semibold">{((perf.conversao||0)*100).toFixed(1)}%</div></div>
                <div className="rounded-2xl border p-4"><div className="text-sm text-gray-600">Leads ganhos</div><div className="text-2xl font-semibold">{perf.ganhos||0}</div></div>
              </div>

              <div className="rounded-2xl border p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Leads por etapa</h3>
                  <button className="px-3 py-2 rounded-xl bg-gray-200" onClick={()=>download("leads")}>Baixar base (CSV)</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(perf.byStage || {}).map(([stage, v]: any)=>(
                    <button key={stage} onClick={()=>download("leads", stage)} className="px-3 py-2 rounded-xl bg-purple-900 text-white">
                      {stage}: {v.count} • {money(v.total)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
