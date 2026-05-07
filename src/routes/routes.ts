import { Router } from "express";
import {
  updateTrackMeta,
  deleteTrack,
  uploadTrack,
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

export default router;
