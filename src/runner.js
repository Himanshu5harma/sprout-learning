export function runJavaScript(code) {
  return new Promise((resolve) => {
    const script = `const lines=[]; const format=(value)=>typeof value==='string'?value:JSON.stringify(value,null,2)??String(value); const console={log:(...args)=>lines.push(args.map(format).join(' ')),warn:(...args)=>lines.push(args.map(format).join(' ')),error:(...args)=>lines.push(args.map(format).join(' '))}; self.onmessage=async(event)=>{try{await new Function('console', 'return (async()=>{'+event.data+'\\n})()')(console);self.postMessage({lines});}catch(error){self.postMessage({lines,error:error.message});}};`;
    const url = URL.createObjectURL(new Blob([script], { type: 'text/javascript' }));
    const worker = new Worker(url);
    const finish = (result) => { clearTimeout(timer); worker.terminate(); URL.revokeObjectURL(url); resolve(result); };
    const timer = setTimeout(() => finish({ lines: [], error: 'That took a little too long. Check for a loop that never ends, then try again.' }), 2500);
    worker.onmessage = (event) => finish(event.data);
    worker.onerror = (event) => finish({ lines: [], error: event.message });
    worker.postMessage(code);
  });
}
