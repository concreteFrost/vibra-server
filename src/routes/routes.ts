import { Router } from "express";
import {
  updateTrackMeta,
  deleteTrack,
  uploadTrack,
  getAllTracks,
  getTracksByUser,
} from "../controllers/track.controller";
import { upload } from "../middleware/uploadFile.middleware";
import { streamTrack } from "../controllers/stream.controller";
import { validate } from "../middleware/validate.middleware";
import {
  loginSchema,
  registerSchema,
  updatePasswordSchema,
  userDeleteSchema,
} from "../schemas/auth.schema";
import {
  deleteUser,
  login,
  register,
  updatePassword,
} from "../controllers/auth.controller";
import { authCheck } from "../middleware/authCheck.middleware";
import { trackUploadSchema, updateTrackSchema } from "../schemas/track.schema";
import {
  createNewArtistSchema,
  updateArtistSchema,
} from "../schemas/artist.schema";
import {
  addTrackToPlaylist,
  createPlaylist,
  deletePlaylist,
  deleteTrackFromPlaylist,
  getMyPlaylists,
  updatePlaylist,
} from "../controllers/playlist.controller";

const router: Router = Router();

//auth
router.post("/auth/register", validate(registerSchema), register);
router.post("/auth/login", validate(loginSchema), login);
router.put(
  "/auth/update-password",
  validate(updatePasswordSchema),
  updatePassword,
);
router.delete(
  "/auth/delete",
  authCheck,
  validate(userDeleteSchema),
  deleteUser,
);

//tracks
router.post(
  "/track/upload",
  authCheck,
  upload.single("file"),
  validate(trackUploadSchema),
  uploadTrack,
);
router.get("/track/stream/:id", streamTrack);
router.delete("/track/delete/:id", authCheck, deleteTrack);
router.put(
  "/track/update-meta",
  authCheck,
  validate(updateTrackSchema),
  updateTrackMeta,
);
router.get("/track/get-all-by-user", authCheck, getTracksByUser);
router.get("/track/get-all", authCheck, getAllTracks);
// router.get(
//   "/track/get-all-by-artist/:artistId",
//   authCheck,
//   getAllTracksByArtist,
// );

//artist
// router.post(
//   "/artist/create",
//   authCheck,
//   validate(createNewArtistSchema),
//   addNewArtist,
// );
// router.put(
//   "/artist/update",
//   authCheck,
//   validate(updateArtistSchema),
//   updateArtist,
// );
// router.get("/artist/get-all", authCheck, getAllArtists);
// router.get("/artist/get-all-by-user/:id", authCheck, getArtistsByUser);
// router.delete("/artist/delete/:id", authCheck, deleteArtist);

//playlists
router.post("/playlist/create", authCheck, createPlaylist);
router.post("/playlist/add-track", authCheck, addTrackToPlaylist);
router.delete("/playlist/delete-track", authCheck, deleteTrackFromPlaylist);
router.delete("/playlist/delete/:id", authCheck, deletePlaylist);
router.put("/playlist/update", authCheck, updatePlaylist);
router.get("/playlist/get-all-by-user", authCheck, getMyPlaylists);

export default router;
