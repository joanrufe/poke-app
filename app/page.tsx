"use client";

import { useCallback, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heart, AlertCircle, Loader2, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useFavorites } from "@/hooks/use-favorites";
import { usePokemonInfiniteList } from "@/hooks/use-pokemon-queries";
import { TypeBadge } from "@/components/type-badge";

export default function PokemonList() {
  const { favorites, toggleFavorite } = useFavorites();

  const observerRef = useRef<IntersectionObserver | null>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = usePokemonInfiniteList(20);

  // Intersection Observer for infinite scroll
  const lastPokemonElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            fetchNextPage();
          }
        },
        {
          threshold: 0.1,
          rootMargin: "100px", // Start loading 100px before reaching the element
        }
      );

      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );
  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);
  // Get all Pokemon from all pages
  const allPokemon = data?.pages.flatMap((page) => page.pokemon) ?? [];
  const totalCount = data?.pages[0]?.totalPages
    ? data.pages[0].totalPages * 20
    : 0;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Loader2 className="h-32 w-32 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-lg">Loading Pokémon...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading Pokémon: {error?.message || "Unknown error"}
          </AlertDescription>
        </Alert>
        <div className="text-center mt-4">
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <span className="text-sm text-muted-foreground">
            Showing {allPokemon.length} of {totalCount} Pokémon
          </span>
          {/* Go to bottom */}

          <Button
            variant="ghost"
            onClick={() =>
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
              })
            }
          >
            <ChevronDown className="w-4 h-4" />
            To Bottom
          </Button>
        </div>
        <Link href="/favorites">
          <Button variant="outline">
            <Heart className="w-4 h-4 mr-2" />
            Favorites ({favorites.length})
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {allPokemon.map((poke, index) => (
          <Card
            key={poke.id}
            className="hover:shadow-lg transition-shadow"
            ref={index === allPokemon.length - 1 ? lastPokemonElementRef : null}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <span className="text-sm text-muted-foreground">
                  #{poke.id.toString().padStart(3, "0")}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavorite(poke)}
                  className="p-1 h-auto"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      favorites.some((fav) => fav.id === poke.id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400"
                    }`}
                  />
                </Button>
              </div>

              <Link href={`/pokemon/${poke.id}`}>
                <div className="cursor-pointer">
                  <div className="flex justify-center mb-3">
                    <Image
                      src={poke.sprite || "/placeholder.svg"}
                      alt={poke.name}
                      width={96}
                      height={96}
                      className="pixelated"
                      loading={index < 20 ? "eager" : "lazy"}
                    />
                  </div>

                  <h3 className="text-lg font-semibold capitalize text-center mb-2">
                    {poke.name}
                  </h3>
                </div>
              </Link>
              <div className="flex flex-wrap gap-1 justify-center">
                {poke.types.map((type) => (
                  <TypeBadge key={type} typeName={type} size="sm" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Loading indicator for infinite scroll */}
      {isFetchingNextPage && (
        <div className="flex justify-center items-center py-8">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-lg">Loading more Pokémon...</span>
          </div>
        </div>
      )}

      {/* End of list indicator */}
      {!hasNextPage && allPokemon.length > 0 && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
            <span className="text-sm text-muted-foreground">
              🎉 You have seen all Pokémon!
            </span>
          </div>
        </div>
      )}

      {/* Scroll to top button */}
      {allPokemon.length > 40 && (
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            size="icon"
            className="rounded-full shadow-lg"
          >
            ↑
          </Button>
        </div>
      )}
    </div>
  );
}
