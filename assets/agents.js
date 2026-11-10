'use strict';
const $ = id => document.getElementById(id);
let lastSnapshot = null;
let agentCatalog = [];
let busy = false;
function node(tag, className, text) {const n=document.createElement(tag);if(className)n.className=className;if(text!=null)n.textContent=String(text);return n;}
function message(text, error=false) { $('status').textContent=text;$('status').classList.toggle('error',error); }
async function request(path, options={}) {
  const resp=await fetch(path,{...options,headers:{'Content-Type':'application/json',...options.headers},cache:'no-store'});
  const json=await resp.json();
  if(!resp.ok)throw new Error(json.error||`Erro HTTP ${resp.status}`);
  return json;
}
async function loadStatus() {
  const data=await request('/api/status');
  agentCatalog=data.agents;
  const wrap=$('agents');wrap.replaceChildren();
  for(const a of data.agents){
    const card=node('div','agent');const row=node('div','agent-top');row.append(node('b','',a.name));row.append(node('span',`label ${a.ready?'ready':'missing'}`,a.ready?'CONFIGURADO':'SEM CHAVE'));
    card.append(row,node('p','',`${a.provider.toUpperCase()} · ${a.model} · ${a.capabilities.join(', ')}`));
    const btn=node('button','minor','Testar conexão');btn.type='button';btn.disabled=!a.ready;
    btn.addEventListener('click',()=>testAgent(a.id,btn));card.append(btn);wrap.append(card);
  }
  $('missing').textContent=data.missing.length?`Etapas sem agente configurado: ${data.missing.join(', ')}.`:'Todas as especialidades possuem pelo menos um agente configurado. Use Testar para confirmar acesso à API.';
}
async function testAgent(agentId,button){
  if(busy)return;
  if(!$('costs').checked){message('Marque a confirmação de custos antes do teste.',true);return;}
  busy=true;button.disabled=true;message('Consultando o provedor configurado...');
  try{const r=await request('/api/test',{method:'POST',body:JSON.stringify({agentId,confirmCosts:true})});message(`Conexão confirmada: ${r.agentId} (${r.provider}, ${r.model}). Resposta: ${r.text}`);}
  catch(e){message(e.message,true);}finally{busy=false;button.disabled=false;}
}
function showSnapshot(snapshot){
  lastSnapshot=snapshot;$('export').disabled=false;
  const metrics=$('metrics');metrics.replaceChildren();
  for(const [label,value] of [['Concluídas',`${snapshot.metrics.completed}/${snapshot.metrics.total}`],['Latência média',snapshot.metrics.meanLatencyMs===null?'—':`${Math.round(snapshot.metrics.meanLatencyMs/1000)} s`],['ICOER',snapshot.metrics.globalICOER===null?'—':snapshot.metrics.globalICOER],['Política',snapshot.policy]]){
    const item=node('div','metric');item.append(node('b','',value),node('small','',label));metrics.append(item);
  }
  const steps=$('steps');steps.replaceChildren();
  for(const t of snapshot.tasks){
    const step=node('section',`step ${t.status==='completed'?'':'failed'}`);
    step.append(node('h3','',t.title),node('div','meta',`${t.status} · agente: ${t.assignedTo||'não atribuído'} · afinidade ICOER: ${t.route?.coherence??'—'}`));
    if(t.result)step.append(node('div','meta',`${t.result.provider} / ${t.result.model} · tokens reportados: ${t.result.tokens??'indisponível'}`));
    if(t.result?.text)step.append(node('div','content',t.result.text));
    if(t.error)step.append(node('div','content',`Erro: ${t.error}`));
    steps.append(step);
  }
  const trace=$('trace');trace.replaceChildren();
  for(const e of snapshot.events)trace.append(node('div','',`${e.seq} ${e.type} ${e.taskId||e.agentId||''} ${e.reason||''}`));
}
$('run').addEventListener('click',async()=>{
  if(busy)return;
  const goal=$('goal').value.trim();
  if(goal.length<10){message('Descreva o objetivo com pelo menos 10 caracteres.',true);return;}
  if(!$('costs').checked){message('Confirme os possíveis custos das APIs.',true);return;}
  busy=true;$('run').disabled=true;
  message('Fluxo em andamento: até cinco consultas reais em sequência. Acompanhe ao final.');
  try{
    const data=await request('/api/run',{method:'POST',body:JSON.stringify({goal,policy:$('policy').value,confirmCosts:true})});
    showSnapshot(data);
    message(`Fluxo concluído: ${data.metrics.completed} de ${data.metrics.total} etapas. Confira os resultados e limitações.`);
  }catch(e){message(e.message,true);}finally{busy=false;$('run').disabled=false;}
});
$('refresh').addEventListener('click',()=>loadStatus().catch(e=>message(e.message,true)));
$('export').addEventListener('click',()=>{
  if(!lastSnapshot)return;
  const blob=new Blob([JSON.stringify(lastSnapshot,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='AYANODE-v1.3-execucao.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
});
loadStatus().catch(e=>message(`Não foi possível conectar ao gateway local: ${e.message}`,true));
