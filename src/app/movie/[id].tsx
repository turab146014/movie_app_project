import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";

import { fetchMoviesDetails } from "../../../services/api";
import useFetch from "../../../services/usefetch";
import { icons } from "../../../constants/icons";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

interface Genre {
  name: string;
}

interface ProductionCompany {
  name: string;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text
      className="font-normal text-sm"
      style={{ color: "#A8B5DB" }}
    >
      {label}
    </Text>

    <Text
      className="font-bold text-sm mt-2"
      style={{ color: "#FFFFFF" }}
    >
      {value || "N/A"}
    </Text>
  </View>
);

const MovieDetails = () => {
  const { id } = useLocalSearchParams();

  const {
    data: movie,
    loading,
    error,
  } = useFetch<MovieDetails>(() => fetchMoviesDetails(id as string));

  if (loading) {
    return (
      <View className="bg-primary flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#AB8BFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="bg-primary flex-1 justify-center items-center px-5">
        <Text className="text-red-500 text-center">
          Failed to load movie details.
        </Text>

        <TouchableOpacity
          className="mt-5 bg-accent rounded-lg py-3 px-6"
          onPress={router.back}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="bg-primary flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        <Image
          source={{
            uri: movie?.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://placehold.co/600x400/1a1a1a/ffffff.png?text=No+Image",
          }}
          className="w-full h-[550px]"
          resizeMode="stretch"
        />

        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white font-bold text-xl">
            {movie?.title}
          </Text>

          <View className="flex-row items-center gap-x-2 mt-2">
            <Text className="text-gray-400 text-sm">
              {movie?.release_date?.split("-")[0] || "N/A"}
            </Text>

            <Text className="text-gray-400 text-sm">
              {movie?.runtime ? `${movie.runtime}m` : "N/A"}
            </Text>
          </View>

          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-3">
            <Image source={icons.star} className="size-4" />

            <Text className="text-white font-bold text-sm">
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>

            <Text className="text-gray-400 text-sm">
              ({movie?.vote_count || 0} votes)
            </Text>
          </View>

          <MovieInfo label="Overview" value={movie?.overview} />

          <MovieInfo
            label="Genres"
            value={
              movie?.genres?.map((g: Genre) => g.name).join(" - ") || "N/A"
            }
          />

          <View className="flex-row justify-between w-full">
            <View className="w-[48%]">
              <MovieInfo
                label="Budget"
                value={
                  movie?.budget
                    ? `$${Math.round(movie.budget / 1_000_000)} million`
                    : "N/A"
                }
              />
            </View>

            <View className="w-[48%]">
              <MovieInfo
                label="Revenue"
                value={
                  movie?.revenue
                    ? `$${Math.round(movie.revenue / 1_000_000)} million`
                    : "N/A"
                }
              />
            </View>
          </View>

          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies
                ?.map((c: ProductionCompany) => c.name)
                .join(" - ") || "N/A"
            }
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex-row justify-center items-center z-50"
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 rotate-180"
          tintColor="#fff"
        />

        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MovieDetails;
