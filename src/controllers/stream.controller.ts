import { Response, Request } from "express";
import { prisma } from "../lib/prisma";
import { getTrackStreamUrl } from "../utils/s3Utils";

export const streamTrack = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const fileToStream = await prisma.track.findUnique({
      where: {
        id: id as string,
      },
    });

    if (!fileToStream) {
      return res.status(404).json({
        message: "Track not found",
      });
    }

    const url = await getTrackStreamUrl(fileToStream.fileKey);

    res.status(200).json({ url });
  } catch (error) {
    console.log("Streaming failed", error);

    res.status(500).json({
      message: "Streaming failed",
    });
  }
};
