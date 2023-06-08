import { Api, Get, Params, Post, useContext, useInject } from "@midwayjs/hooks";
import { Upload, useFiles, useFields } from "@midwayjs/hooks-upload";
import fs from "fs";
import path from "path";
import { COSService } from "@midwayjs/cos";
import { Context } from "@midwayjs/koa";
import { prisma } from "./prisma";
// import { SIZE } from "../utils/uploadUtils";

const SIZE = 2 * 1024 * 1024;
const basePath = "/var/lib/disk-anywhere/";
const tempPath = "/var/lib/disk-anywhere/tmp";

export const uploadChunk = Api(Upload("/api/upload"), async () => {
  const { file } = useFiles();
  const { data: oldName } = file[0];
  const { hash, index } = useFields();

  const dirPath = path.join(tempPath, hash);
  const existence = fs.existsSync(dirPath);
  if (!existence) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  const tempFileName = path.join(dirPath, `${hash}-${index}`);
  fs.copyFileSync(oldName, tempFileName);
  fs.unlinkSync(oldName);

  return {
    msg: "upload successfully",
  };
});

export const verifyChunks = Api(
  Get("/api/verify/:hash"),
  Params<{ hash: string }>(),
  async () => {
    const ctx = useContext<Context>();
    const { hash } = ctx.params;

    if (fs.existsSync(path.join(basePath, hash))) {
      return {
        shouldUpload: false,
      };
    }

    const existingTmpDir = fs.existsSync(path.join(tempPath, hash));

    return {
      shouldUpload: true,
      existChunks: existingTmpDir
        ? fs.readdirSync(path.join(tempPath, hash))
        : [],
    };
  }
);

export const mergeChunks = Api(Post("/api/merge"), async (hash: string) => {
  const ctx = useContext<Context>();
  const destFilePath = path.join(basePath, hash);
  const chunksDirPath = path.join(tempPath, hash);
  const chunkPaths = fs.readdirSync(path.join(tempPath, hash));
  chunkPaths.sort((a, b) => {
    return Number(a.split("-")[1]) - Number(b.split("-")[1]);
  });
  await Promise.all(
    chunkPaths.map((chunkPath, idx) => {
      return new Promise<void>((resolve) => {
        const readStream = fs.createReadStream(
          path.join(chunksDirPath, chunkPath)
        );
        readStream.on("end", () => {
          fs.unlinkSync(path.join(chunksDirPath, chunkPath));
          resolve();
        });
        const writeStream = fs.createWriteStream(destFilePath, {
          start: idx * SIZE,
        });
        readStream.pipe(writeStream);
      });
    })
  );
  fs.rmdirSync(chunksDirPath);
});

export const createLink = Api(
  Post("/api/createLink"),
  async (hash: string, fileName: string) => {
    const { size } = fs.statSync(path.join(basePath, hash));
    const fileMeta = await prisma.file.create({
      data: {
        name: fileName,
        hash,
        size,
      },
    });

    return {
      url: `/file/${fileMeta.id}`,
    };
  }
);

export const file = Api(
  Get("/api/file/:id"),
  Params<{ id: string }>(),
  async () => {
    const ctx = useContext<Context>();
    const { id } = ctx.params;
    const fileMeta = await prisma.file.findUnique({ where: { id } });
    return {
      fileName: fileMeta.name,
      id: fileMeta.id,
      size: fileMeta.size.toString(),
    };
  }
);

export const downloadFile = Api(
  Get("/api/download/:id"),
  Params<{ id: string }>(),
  async () => {
    const ctx = useContext<Context>();
    const { id } = ctx.params;
    const fileMeta = await prisma.file.findUnique({ where: { id } });
    ctx.attachment(fileMeta.name);
    ctx.set("Content-Length", String(fileMeta.size));
    ctx.body = fs.createReadStream(path.join(basePath, fileMeta.hash));
  }
);
