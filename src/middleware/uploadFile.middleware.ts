import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fieldSize: 20 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "audio/mpeg") {
      return cb(new Error("Only audio files allowed"));
    }
    cb(null, true);
  },
});
