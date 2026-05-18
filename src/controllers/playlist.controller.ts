import { Response, Request } from "express";
import { prisma } from "../lib/prisma";

export const createPlaylist = async (req: Request, res: Response) => {
  const { title } = req.body;
  const { userId } = req.user!;

  try {
    const newPlaylist = await prisma.playlist.create({
      data: {
        title: title,
        userId: userId as string,
      },
    });

    res
      .status(200)
      .json({ message: "playlist created", playlist: newPlaylist });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error creating new playlist" });
  }
};

export const addTrackToPlaylist = async (req: Request, res: Response) => {
  const { trackId, playlistId } = req.body;

  const { userId } = req.user!;

  try {
    // checking playlist ownership
    const playlist = await prisma.playlist.findFirst({
      where: {
        id: playlistId,
        userId,
      },
    });

    if (!playlist) {
      return res.status(404).json({
        message: "playlist not found",
      });
    }

    // checking track existence
    const track = await prisma.track.findUnique({
      where: {
        id: trackId,
      },
    });

    if (!track) {
      return res.status(404).json({
        message: "track not found",
      });
    }

    // checking duplicate relation
    const existingRelation = await prisma.playlistTrack.findUnique({
      where: {
        playlistId_trackId: {
          playlistId,
          trackId,
        },
      },
    });

    if (existingRelation) {
      return res.status(409).json({
        message: "track already exists in playlist",
      });
    }

    const newTrack = await prisma.playlistTrack.create({
      data: {
        playlistId,
        trackId,
      },
    });

    res.status(201).json({
      message: "track successfully added",
      playlistTrack: newTrack,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "error adding track to playlist",
    });
  }
};

export const deleteTrackFromPlaylist = async (req: Request, res: Response) => {
  const { trackId, playlistId } = req.body;

  const { userId } = req.user!;

  try {
    // checking playlist ownership
    const playlist = await prisma.playlist.findFirst({
      where: {
        id: playlistId,
        userId,
      },
    });

    if (!playlist) {
      return res.status(404).json({
        message: "playlist not found",
      });
    }

    // checking relation existence
    const relation = await prisma.playlistTrack.findUnique({
      where: {
        playlistId_trackId: {
          playlistId,
          trackId,
        },
      },
    });

    if (!relation) {
      return res.status(404).json({
        message: "track not found in playlist",
      });
    }

    await prisma.playlistTrack.delete({
      where: {
        playlistId_trackId: {
          playlistId,
          trackId,
        },
      },
    });

    res.status(200).json({
      message: "track deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "delete track from playlist error",
    });
  }
};

export const deletePlaylist = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.user!;

  try {
    const playlistToDelete = await prisma.playlist.findFirst({
      where: {
        id: id as string,
        userId: userId,
      },
    });

    if (!playlistToDelete) {
      return res.status(404).json({ message: "playlist not found" });
    }

    await prisma.playlist.delete({ where: { id: id as string } });

    res.status(200).json({ message: "playlist deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "playlist deletion error" });
  }
};

export const updatePlaylist = async (req: Request, res: Response) => {
  const { title, playlistId } = req.body;

  const { userId } = req.user!;

  try {
    const playlist = await prisma.playlist.findFirst({
      where: {
        id: playlistId,
        userId,
      },
    });

    if (!playlist) {
      return res.status(404).json({
        message: "playlist not found",
      });
    }

    const updatedPlaylist = await prisma.playlist.update({
      where: {
        id: playlistId,
      },

      data: {
        title,
      },
    });

    res.status(200).json({
      message: "playlist updated successfully",

      playlist: updatedPlaylist,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "playlist update error",
    });
  }
};

export const getMyPlaylists = async (req: Request, res: Response) => {
  const { userId } = req.user!;

  try {
    const playlists = await prisma.playlist.findMany({
      where: {
        userId: userId,
      },
    });

    res.status(200).json({ playlists });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error getting user playlists" });
  }
};
