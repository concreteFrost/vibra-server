import { z } from "zod";

export const trackUploadSchema = z.object({
  title: z.string().nonempty("track name required"),
});

export const updateTrackSchema = z
  .object({
    title: z.string().nonempty("track name required"),
  })
  .loose();

export type FileUploadInput = z.infer<typeof trackUploadSchema>;
export type TrackMetaUpdateInput = z.infer<typeof updateTrackSchema>;
