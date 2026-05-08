import { z } from "zod";

export const createNewArtistSchema = z.object({
  name: z.string().nonempty("artist name required"),
});

export const updateArtistSchema = z
  .object({
    name: z.string().nonempty("artist name required"),
  })
  .loose();

export type ArtistCreateInput = z.infer<typeof createNewArtistSchema>;
export type ArtistUpdateInput = z.infer<typeof updateArtistSchema>;
