import { Response, Request } from "express";
import { prisma } from "../lib/prisma";

export const leaveNewComment = async (req: Request, res: Response) => {
  const { content, trackId } = req.body;
  const { userId } = req.user!;

  try {
    const comment = await prisma.trackComment.create({
      data: {
        content,
        trackId,
        userId: userId,
      },
    });

    return res.status(200).json({
      message: "comment created",
      comment,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "failed to create comment",
    });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.user!;

  try {
    const deleted = await prisma.trackComment.deleteMany({
      where: {
        id: id as string,
        userId,
      },
    });

    if (deleted.count === 0) {
      return res.status(404).json({
        message: "comment not found",
      });
    }

    return res.status(200).json({
      message: "comment deleted",
    });
  } catch (error) {
    console.error("delete comment error:", error);

    return res.status(500).json({
      message: "internal server error",
    });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  const { id, content } = req.body;
  const { userId } = req.user!;

  try {
    const updatedComment = await prisma.trackComment.updateMany({
      where: {
        id: id,
        userId: userId,
      },
      data: {
        content: content,
      },
    });

    if (updatedComment.count === 0) {
      return res.status(404).json({
        message: "no comment to update found",
      });
    }

    res.status(200).json({
      message: "comment updated",
    });
  } catch (error) {
    console.log("update comment error", error);
    res.status(500).json({ message: "update comment error" });
  }
};

export const getTrackComments = async (req: Request, res: Response) => {};
