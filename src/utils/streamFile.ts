import fs from "fs";
import { Request, Response } from "express";

export const streamFile = (filePath: string, req: Request, res: Response) => {
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;

  const range = req.headers.range;

  if (!range) {
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": "audio/mpeg",
    });

    return fs.createReadStream(filePath).pipe(res);
  }

  const parts = range.replace(/bytes=/, "").split("-");
  const start = Number(parts[0]);
  const end = parts[1] ? Number(parts[1]) : fileSize - 1;

  const chunkSize = end - start + 1;

  const stream = fs.createReadStream(filePath, { start, end });

  res.writeHead(206, {
    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": chunkSize,
    "Content-Type": "audio/mpeg",
  });

  stream.pipe(res);
};
