import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { Pool } from "pg";

config();

let prismaInstance: PrismaClient | null = null;
let pool: Pool | null = null;

const creatorId = "c6cfc79c-22f4-482d-9b25-f5a02e9a5b83";

type MovieData = {
  title: string;
  overview: string | null;
  releaseYear: number;
  genres: string[];
  runtime: number | null;
  posterUrl: string | null;
  createdBy: string;
};

const movies: MovieData[] = [
  {
    title: "Inception",
    overview:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    releaseYear: 2010,
    genres: ["Action", "Adventure", "Sci-Fi"],
    runtime: 148,
    posterUrl:
      "https://image.tmdb.org/t/p/original/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
    createdBy: creatorId,
  },
  {
    title: "The Matrix",
    overview:
      "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    releaseYear: 1999,
    genres: ["Action", "Sci-Fi"],
    runtime: 136,
    posterUrl:
      "https://image.tmdb.org/t/p/original/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    createdBy: creatorId,
  },
  {
    title: "Interstellar",
    overview:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    releaseYear: 2014,
    genres: ["Adventure", "Drama", "Sci-Fi"],
    runtime: 169,
    posterUrl:
      "https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    createdBy: creatorId,
  },
];

export const main = async (): Promise<void> => {
  if (prismaInstance) {
    return;
  }

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const adapter = new PrismaPg(pool);
  prismaInstance = new PrismaClient({ adapter });

  for (const movie of movies) {
    await prismaInstance.movie.create({
      data: movie,
    });
    console.log(`Created movie: ${movie.title}`);
  }
  console.log("Seeding completed.");
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    if (prismaInstance) await prismaInstance.$disconnect();
    if (pool) await pool.end();
  });
