/**
 * เก็บ raw body ไว้ที่ req.rawBody เพื่อ verify signature
 * ใช้กับ webhook เท่านั้น
 */
export function rawBodyJson(req, res, next) {
  let data = "";
  req.setEncoding("utf8");

  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    req.rawBody = data;
    try {
      req.body = data ? JSON.parse(data) : {};
      next();
    } catch (e) {
      res.status(400).json({ error: "Invalid JSON" });
    }
  });
}


export function test(req,res,next){
  const { data } = req.body || {};

  console.log(data)
  if(data) return next()
    
    return res.status(400).json({error : "No data"});
}