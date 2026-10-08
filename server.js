const http = require("http"), fs = require("fs"), path = require("path");
const root = __dirname;
const types = {".html":"text/html",".css":"text/css",".js":"text/javascript",".jpg":"image/jpeg",".png":"image/png",".svg":"image/svg+xml"};
http.createServer((req,res)=>{
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p==="/") p="/index.html";
  const fp = path.join(root, p);
  fs.readFile(fp,(e,data)=>{
    if(e){res.writeHead(404);res.end("Not found");return;}
    res.writeHead(200,{"Content-Type":types[path.extname(fp)]||"application/octet-stream"});
    res.end(data);
  });
}).listen(4317,()=>console.log("Prime site on http://localhost:4317"));
