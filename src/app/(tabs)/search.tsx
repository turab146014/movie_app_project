import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useEffect, useRef, useState } from "react";

import { images } from "../../../constants/images";
import MovieCard from "../../../components/MovieCard";
import useFetch from "../../../services/usefetch";
import { fetchPopularMovies } from "../../../services/api";
import { icons } from "../../../constants/icons";
import SearchBar from "../../../components/SearchBar";
import { updateSearchCount } from "../../../services/appwrite";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const latestSearchTerm = useRef("");

  const {
    data: movies,
    loading,
    error,
    refetch: loadMovies,
    reset,
  } = useFetch<Movie[]>(
    () =>
      fetchPopularMovies({
        query: searchQuery,
      }),
    false
  );

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      const trimmedQuery = searchQuery.trim();

      if (trimmedQuery) {
        latestSearchTerm.current = trimmedQuery;
        await loadMovies();
      } else {
        latestSearchTerm.current = "";
        reset();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    if (latestSearchTerm.current && movies && movies.length > 0) {
      updateSearchCount(latestSearchTerm.current, movies[0]);
      latestSearchTerm.current = "";
    }
  }, [movies]);

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />

      <FlatList
        data={movies ?? []}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        className="px-5"
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "center",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>

            <View className="my-5">
              <SearchBar
                placeholder="Search movies ..."
                value={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
              />
            </View>

            {loading && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="my-3"
              />
            )}

            {error && (
              <Text className="text-red-500 px-5 my-3">
                Error: {error.message}
              </Text>
            )}

            {!loading &&
              !error &&
              searchQuery.trim() &&
              movies &&
              movies.length > 0 && (
                <Text className="text-xl text-white font-bold">
                  Search Results for{" "}
                  <Text className="text-accent">
                    {searchQuery.trim()}
                  </Text>
                </Text>
              )}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-white">
                {searchQuery.trim() ? "No movie found" : "Search for a movie"}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Search;
