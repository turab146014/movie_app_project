import { Client, Databases, Query, ID } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;
const APPWRITE_ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!;

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(PROJECT_ID)
  .setPlatform("com.jsm.movieapp");

const database = new Databases(client);

const getPosterUrl = (posterPath: string | null) => {
  return posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : "https://placehold.co/600x400/1a1a1a/ffffff.png?text=No+Image";
};

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const searchTerm = query.trim();

    if (!searchTerm || !movie) {
      return;
    }

    console.log("Updating Appwrite:", searchTerm, movie.title);

    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", searchTerm),
    ]);

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];

      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingMovie.$id,
        {
          count: Number(existingMovie.count) + 1,
        }
      );

      console.log("Search count updated");
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm,
        movie_id: movie.id,
        count: 1,
        title: movie.title,
        poster_url: getPosterUrl(movie.poster_path),
      });

      console.log("New search row created");
    }
  } catch (error) {
    console.log("Appwrite error:", error);
  }
};

export const getTrendingMovies = async (): Promise<TrendingMovie[]> => {
  try {
    console.log("Reading trending movies from Appwrite");

    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    console.log("Trending documents:", result.documents.length);

    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.log("Trending movies error:", error);
    return [];
  }
};
