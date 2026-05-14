import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// export const addNewArtist = async (req: Request, res: Response) => {
//   const { name } = req.body;
//   const { userId } = req.user!;
//   try {
//     const newArtist = await prisma.artist.create({
//       data: {
//         name: name,
//         creatorId: userId,
//       },
//     });

//     res.status(200).json({
//       message: "new artist created",
//       artist: newArtist,
//     });
//   } catch (error) {
//     console.log("error creating new artist", error);
//     res.status(500).json({ message: "error creating new artist" });
//   }
// };

// export const updateArtist = async (req: Request, res: Response) => {
//   const { id, name } = req.body;
//   const { userId } = req.user!;

//   try {
//     const artistToUpdate = await prisma.artist.findUnique({
//       where: {
//         id: id,
//         creatorId: userId,
//       },
//     });

//     if (!artistToUpdate) {
//       return res.status(404).json({ message: "artist not found" });
//     }

//     const updated = await prisma.artist.update({
//       where: {
//         id: id,
//       },
//       data: {
//         name: name,
//       },
//       include: { tracks: true },
//     });

//     res.status(200).json({
//       message: "artist updated",
//       artist: updated,
//     });
//   } catch (error) {
//     console.log("error updating artist", error);
//     res.status(500).json({ message: "error updating artist" });
//   }
// };

// export const getAllArtists = async (req: Request, res: Response) => {
//   const artists = await prisma.artist.findMany();

//   res.status(200).json({
//     artists,
//   });
// };

// export const getArtistsByUser = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   try {
//     const artists = await prisma.artist.findMany({
//       where: {
//         creatorId: id as string,
//       },
//     });

//     res.status(200).json({
//       artists,
//     });
//   } catch (error) {
//     console.log("error getting user artists", error);
//     res.status(500).json({
//       message: "error getting user artists",
//     });
//   }
// };

// export const deleteArtist = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { userId } = req.user!;

//   try {
//     const result = await prisma.artist.deleteMany({
//       where: {
//         id: id as string,
//         creatorId: userId,
//       },
//     });

//     if (result.count === 0) {
//       return res.status(404).json({
//         message: "artist not found",
//       });
//     }

//     return res.status(200).json({
//       message: "artist deleted",
//     });
//   } catch (error) {
//     console.log("error deleting artist", error);

//     return res.status(500).json({
//       message: "error deleting artist",
//     });
//   }
// };
