export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
  },
};

export const fetchPopularMovies = async ({ query }: { query: string }) => {
  console.log("TMDB token exists:", !!TMDB_CONFIG.API_KEY);
  console.log("TMDB token length:", TMDB_CONFIG.API_KEY?.length);

  if (!TMDB_CONFIG.API_KEY) {
    throw new Error("TMDB token is missing. Check .env file location/name.");
  }

  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

  console.log("TMDB endpoint:", endpoint);

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  const data = await response.json();

  console.log("TMDB response status:", response.status);
  console.log("TMDB response data:", data);

  if (!response.ok) {
    throw new Error(
      data?.status_message ||
        `Failed to fetch movie: ${response.status} ${response.statusText}`
    );
  }

  return data.results;
};

export const fetchMoviesDetails = async (
  movieId: string
): Promise<MovieDetails> => {
  try {
    if (!TMDB_CONFIG.API_KEY) {
      throw new Error("TMDB token is missing. Check .env file.");
    }

    const endpoint = `${TMDB_CONFIG.BASE_URL}/movie/${movieId}`;

    console.log("Movie detail endpoint:", endpoint);

    const response = await fetch(endpoint, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    });

    const data = await response.json();

    console.log("Movie detail status:", response.status);
    console.log("Movie detail data:", data);

    if (!response.ok) {
      throw new Error(
        data?.status_message ||
          `Failed to fetch movie detail: ${response.status}`
      );
    }

    return data;
  } catch (error) {
    console.log("Movie detail error:", error);
    throw error;
  }
};
