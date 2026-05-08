import { Response, Request } from "express";
import { prisma } from "../lib/prisma";
import { deleteTrackFromS3, uploadToS3 } from "../utils/s3Utils";
import { Prisma } from "../generated/prisma/client";

export const uploadTrack = async (req: Request, res: Response) => {
  const { title, artistId } = req.body;
  const { userId } = req.user!;

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "Uploading failed. User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.file;

    const key = await uploadToS3(file);

    const newTrack = await prisma.track.create({
      data: {
        uploaderId: userId,
        title,
        fileKey: key,
        artistId: artistId ?? null,
      },
    });

    res.status(200).json({
      message: "File uploaded",
      newTrack,
    });
  } catch (error) {
    console.log("Upload failed", error);
    res.status(500).json({ message: "Upload failed" });
  }
};

export const deleteTrack = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.user!;

    const trackToDelete = await prisma.track.findUnique({
      where: {
        id: id as string,
        uploaderId: userId as string,
      },
    });

    if (!trackToDelete) {
      return res.status(404).json({ message: "Track not found" });
    }

    await deleteTrackFromS3(trackToDelete.fileKey);

    await prisma.track.delete({ where: { id: id as string } });

    res.status(200).json({ message: "Track deleted" });
  } catch (error) {
    console.log("error deleting track", error);
    res.status(500).json({ message: "Track delete failed" });
  }
};

export const updateTrackMeta = async (req: Request, res: Response) => {
  const { trackId, title, artistId } = req.body;
  const { userId } = req.user!;
  try {
    const trackToChange = await prisma.track.findUnique({
      where: {
        id: trackId,
        uploaderId: userId,
      },
    });

    if (!trackToChange) {
      return res.status(404).json({
        message: "Track not found",
      });
    }

    await prisma.track.update({
      where: {
        id: trackId,
      },
      data: {
        title: title,
        artistId: artistId ?? null,
      },
    });

    res.status(200).json({ message: "Track updated" });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return res.status(400).json({
        message: "Artist does not exist",
      });
    }

    return res.status(500).json({
      message: "Track update failed",
    });
  }
};

export const getAllTracks = async (req: Request, res: Response) => {
  const allTracks = await prisma.track.findMany();

  res.status(200).json({
    tracks: allTracks,
  });
};

export const getAllTracksByArtist = async (req: Request, res: Response) => {
  const { artistId } = req.params;

  try {
    const allTrackByArtist = await prisma.track.findMany({
      where: {
        artistId: artistId as string,
      },
    });

    if (!allTrackByArtist) {
      return res
        .status(404)
        .json({ message: "no tracks found for this artist" });
    }

    res.status(200).json({
      tracks: allTrackByArtist,
    });
  } catch (error) {
    console.log("error getting artist`s tracks", error);
    res.status(500).json({ message: "error getting artist`s tracks" });
  }
};
