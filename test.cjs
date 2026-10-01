const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');
const html=fs.readFileSync(__dirname+'/index.html','utf8');const scripts=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)];for(const [i,s] of scripts.entries())new vm.Script(s[1],{filename:`script-${i}`});const context={};vm.runInNewContext(scripts[0][1],context);const D=context.Domain;
test('document has English/Russian app and both scripts parse',()=>{assert.equal(scripts.length,2);assert.ok(html.includes('lang="ru"'));});
test('21000 gas at 10 gwei is exactly 0.00021 ETH',()=>{assert.equal(D.eth(D.plan([{gas:'21000',count:'1'}],'10','0','0').total),'0.00021');});
test('mixed operations, extra fees and reserve are all included',()=>{const r=D.plan([{gas:'50000',count:'2'},{gas:'200000',count:'1'}],'1','0.0001','25');assert.equal(r.gas,300000n);assert.equal(D.eth(r.total),'0.0005');});
test('reserve rounds up to a whole wei',()=>{assert.equal(D.plan([{gas:'1',count:'1'}],'0.000000001','','0.01').total,2n);});
test('unknown extra remains different from explicit zero in input but computes execution subtotal',()=>{assert.equal(D.plan([{gas:'21000',count:'1'}],'1','','0').total,21000000000000n);});
test('reject blank, negative, malformed, overprecision, scientific values',()=>{for(const v of ['','-1','Infinity','NaN','1e9','1.0000000001','1,5','0x2'])assert.throws(()=>D.plan([{gas:'1',count:'1'}],v,'','0'));});
test('reject fractional/zero/oversized gas counts and too many rows',()=>{for(const gas of ['0','1.5','100000001'])assert.throws(()=>D.plan([{gas,count:'1'}],'1','','0'));assert.throws(()=>D.plan([{gas:'1',count:'1001'}],'1','','0'));assert.throws(()=>D.plan(Array(31).fill({gas:'1',count:'1'}),'1','','0'));});
test('bounds for reserve and extra ETH',()=>{assert.throws(()=>D.plan([{gas:'1',count:'1'}],'1','1001','0'));assert.throws(()=>D.plan([{gas:'1',count:'1'}],'1','','1000.01'));});
test('RPC conversions validate server data',()=>{assert.equal(D.rpcGwei('0x3b9aca00'),'1.000000000');for(const v of [null,'garbage','0x','0xzz'])assert.throws(()=>D.rpcGwei(v));});
test('CSV cells quote text and neutralize formula-leading values',()=>{assert.equal(D.csvCell('=1+1'),'"\'=1+1"');assert.equal(D.csvCell('a"b'),'"a""b"');});
const backup=()=>({version:1,plan:{lang:'ru',rows:[{type:'transfer',gas:'21000',count:'2'}],price:'2500',buffer:'25',rates:['10','1','1'],extras:['0','',''],times:[123,123,123],modes:['live','live','live']}});
test('backup round trip preserves calculations but clears live provenance',()=>{const p=D.restore(backup());assert.equal(D.eth(D.plan(p.rows,p.rates[0],p.extras[0],p.buffer).total),'0.000525');assert.equal(p.modes.join(','),'manual,manual,manual');assert.equal(p.times.join(','),'0,0,0');});
test('backup rejects malformed shape, unsupported types and invalid prices',()=>{for(const change of [v=>v.version=2,v=>v.plan.rows[0].type='bad',v=>v.plan.rates=[],v=>v.plan.price='Infinity',v=>v.plan.rows[0].count='0']){const v=backup();change(v);assert.throws(()=>D.restore(v));}});
test('backup discards unknown properties and does not alias imported arrays',()=>{const v=backup();v.plan.injected='bad';const p=D.restore(v);assert.equal(p.injected,undefined);v.plan.rows[0].gas='1';assert.equal(p.rows[0].gas,'21000');});

// Small DOM/storage fixture for executing the real app event handlers, without dependencies.
function appFixture(){
 const nodes=new Map(),listeners={},values=new Map();let failWrite=false;
 const node=id=>{if(!nodes.has(id))nodes.set(id,{id,value:'',style:{},dataset:{},disabled:false,textContent:'',innerHTML:'',files:[],addEventListener(){},setAttribute(){},after(){},append(){},focus(){},click(){},querySelectorAll(){return [];}});return nodes.get(id);};
 const storage={getItem:k=>values.get(k)??null,setItem(k,v){if(failWrite)throw Error('quota');values.set(k,v);}};
 const env={URL,TextEncoder,Intl,Date,AbortController,setTimeout,clearTimeout,setInterval(){},console,crypto:{randomUUID:()=> 'new-id'},confirm:()=>true,localStorage:storage,
 document:{getElementById:node,documentElement:{},createElement:tag=>node('created-'+nodes.size),querySelectorAll:()=>[...nodes.values()]},
 window:{addEventListener:(name,cb)=>listeners[name]=cb}};
 // Translation queries must return only actual translated nodes (none in this fixture).
 env.document.querySelectorAll=selector=>selector==='[data-t]'?[]:[...nodes.values()];
 vm.createContext(env);for(const script of scripts)vm.runInContext(script[1],env);
 return {env,node,storage,values,listeners,failWrites(){failWrite=true;},read:code=>vm.runInContext(code,env)};
}
function storageEvent(f,key,area=f.storage){f.listeners.storage({key,storageArea:area});}
test('storage clear locks editing while recovery exports remain available',()=>{const f=appFixture();storageEvent(f,null);assert.equal(f.read('blocked'),true);assert.equal(f.node('add').disabled,true);assert.equal(f.node('export').disabled,false);assert.equal(f.read('backupButton.disabled'),false);});
test('unrelated session storage must not lock a gas plan',()=>{const f=appFixture();storageEvent(f,'gas-planner:v2',{});assert.equal(f.read('blocked'),false);});
test('late live responses preserve conflict warning and original rates',async()=>{const f=appFixture();let finish;f.env.json=()=>new Promise(resolve=>finish=resolve);f.env.rpc=async(i,method)=>method==='eth_chainId'?['0x1','0x2105','0xa'][i]:'0x3b9aca00';const before=f.read('JSON.stringify(state)');const pending=f.node('refresh').onclick();storageEvent(f,'gas-planner:v2');const warning=f.node('networkStatus').textContent;finish({data:{base:'ETH',currency:'USD',amount:'2500'}});await pending;assert.equal(f.read('JSON.stringify(state)'),before);assert.equal(f.node('networkStatus').textContent,warning);assert.equal(f.values.size,0);assert.equal(f.read('busy'),false);});
test('budget breakdown includes exact execution, additional fee and rounded reserve',()=>{const f=appFixture();f.read("state.rows=[{type:'transfer',gas:'21000',count:'1'}];state.rates=['10','10','10'];state.extras=['0.0001','','0'];state.buffer='25';calculate()");assert.match(f.node('breakdown0').innerHTML,/0\.00021 ETH/);assert.match(f.node('breakdown0').innerHTML,/0\.0001 ETH/);assert.match(f.node('breakdown0').innerHTML,/0\.0000775 ETH/);assert.match(f.node('breakdown1').innerHTML,/Не указаны/);});
test('invalid input clears a previously valid breakdown',()=>{const f=appFixture();assert.match(f.node('breakdown0').innerHTML,/ETH/);f.read("state.buffer='bad';calculate()");assert.equal(f.node('breakdown0').innerHTML,'');});
test('operation execution breakdown includes counts and sums exactly with fractional gwei',()=>{const r=D.plan([{gas:'21000',count:'2'},{gas:'65000',count:'3'}],'0.123456789','0.004','25');assert.equal(r.operations[0].execution,42000n*123456789n);assert.equal(r.operations[1].execution,195000n*123456789n);assert.equal(r.operations.reduce((sum,x)=>sum+x.execution,0n),r.execution);assert.equal(r.operations.reduce((sum,x)=>sum+x.gas,0n),r.gas);assert.ok(r.total>r.execution);});
