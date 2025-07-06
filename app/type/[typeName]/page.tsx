"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Heart,
  AlertCircle,
  Loader2,
  Sword,
  Shield,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useFavorites } from "@/hooks/use-favorites";
import {
  useTypeDetail,
  usePokemonByTypeInfinite,
} from "@/hooks/use-pokemon-queries";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { TypeBadge } from "@/components/type-badge";

export default function TypePage() {
  const params = useParams();
  const router = useRouter();
  const { favorites, toggleFavorite } = useFavorites();

  const typeName = params.typeName as string;

  const {
    data: typeData,
    isLoading: isTypeLoading,
    isError: isTypeError,
    error: typeError,
  } = useTypeDetail(typeName);

  const {
    data: pokemonData,
    isLoading: isPokemonLoading,
    isError: isPokemonError,
    error: pokemonError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePokemonByTypeInfinite(typeName, 20);

  // Use custom hook for infinite scroll
  const lastPokemonElementRef = useIntersectionObserver(
    () => {
      if (!isFetchingNextPage && hasNextPage) {
        fetchNextPage();
      }
    },
    {
      threshold: 0.1,
      rootMargin: "100px",
    },
    !isFetchingNextPage && hasNextPage
  );

  // Get all Pokemon from all pages
  const allPokemon = pokemonData?.pages.flatMap((page) => page.pokemon) ?? [];
  const totalCount = pokemonData?.pages[0]?.totalCount ?? 0;

  if (isTypeLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Loader2 className="h-32 w-32 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-lg">Loading type information...</p>
        </div>
      </div>
    );
  }

  if (isTypeError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading type: {typeError?.message || "Type not found"}
          </AlertDescription>
        </Alert>
        <div className="text-center mt-4">
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    );
  }

  if (!typeData) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <TypeBadge typeName={typeName} size="lg" />
            <h1 className="text-4xl font-bold">Type {typeName}</h1>
          </div>
        </div>
      </div>

      {/* Type effectiveness chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sword className="w-5 h-5" />
              Effective against
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {typeData.damage_relations.double_damage_to.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 text-green-600">
                  Super effective (2x damage)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {typeData.damage_relations.double_damage_to.map((type) => (
                    <TypeBadge key={type.name} typeName={type.name} size="sm" />
                  ))}
                </div>
              </div>
            )}

            {typeData.damage_relations.half_damage_to.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 text-orange-600">
                  Not very effective (0.5x damage)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {typeData.damage_relations.half_damage_to.map((type) => (
                    <TypeBadge key={type.name} typeName={type.name} size="sm" />
                  ))}
                </div>
              </div>
            )}

            {typeData.damage_relations.no_damage_to.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 text-red-600">
                  No effect (0x damage)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {typeData.damage_relations.no_damage_to.map((type) => (
                    <TypeBadge key={type.name} typeName={type.name} size="sm" />
                  ))}
                </div>
              </div>
            )}

            {typeData.damage_relations.double_damage_to.length === 0 &&
              typeData.damage_relations.half_damage_to.length === 0 &&
              typeData.damage_relations.no_damage_to.length === 0 && (
                <p className="text-muted-foreground">
                  No special type advantages
                </p>
              )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Weak against
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {typeData.damage_relations.double_damage_from.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 text-red-600">
                  Weak to (takes 2x damage)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {typeData.damage_relations.double_damage_from.map((type) => (
                    <TypeBadge key={type.name} typeName={type.name} size="sm" />
                  ))}
                </div>
              </div>
            )}

            {typeData.damage_relations.half_damage_from.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 text-green-600">
                  Resists (takes 0.5x damage)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {typeData.damage_relations.half_damage_from.map((type) => (
                    <TypeBadge key={type.name} typeName={type.name} size="sm" />
                  ))}
                </div>
              </div>
            )}

            {typeData.damage_relations.no_damage_from.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 text-blue-600">
                  Immune (takes 0x damage)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {typeData.damage_relations.no_damage_from.map((type) => (
                    <TypeBadge key={type.name} typeName={type.name} size="sm" />
                  ))}
                </div>
              </div>
            )}

            {typeData.damage_relations.double_damage_from.length === 0 &&
              typeData.damage_relations.half_damage_from.length === 0 &&
              typeData.damage_relations.no_damage_from.length === 0 && (
                <p className="text-muted-foreground">
                  No special type weaknesses
                </p>
              )}
          </CardContent>
        </Card>
      </div>

      {/* Pokemon list section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">
          {typeName} type Pokémon
          {totalCount > 0 && (
            <span className="text-lg font-normal text-muted-foreground ml-2">
              ({allPokemon.length} of {totalCount} loaded)
            </span>
          )}
        </h2>
      </div>

      {isPokemonError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading Pokémon: {pokemonError?.message || "Unknown error"}
          </AlertDescription>
        </Alert>
      )}

      {isPokemonLoading ? (
        <div className="text-center py-8">
          <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
          <p className="mt-4">Loading Pokémon...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {allPokemon.map((pokemon, index) => (
              <Card
                key={pokemon.id}
                className="hover:shadow-lg transition-shadow"
                ref={
                  index === allPokemon.length - 1 ? lastPokemonElementRef : null
                }
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm text-muted-foreground">
                      #{pokemon.id.toString().padStart(3, "0")}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(pokemon)}
                      className="p-1 h-auto"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          favorites.some((fav) => fav.id === pokemon.id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400"
                        }`}
                      />
                    </Button>
                  </div>

                  <Link href={`/pokemon/${pokemon.id}`}>
                    <div className="cursor-pointer">
                      <div className="flex justify-center mb-3">
                        <Image
                          src={pokemon.sprite || "/placeholder.svg"}
                          alt={pokemon.name}
                          width={96}
                          height={96}
                          className="pixelated"
                          loading={index < 20 ? "eager" : "lazy"}
                        />
                      </div>

                      <h3 className="text-lg font-semibold capitalize text-center mb-2">
                        {pokemon.name}
                      </h3>
                    </div>
                  </Link>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {pokemon.types.map((type) => (
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
                  🎉 You have seen all {typeName} type Pokémon!
                </span>
              </div>
            </div>
          )}

          {/* Scroll to top button */}
          {allPokemon.length > 20 && (
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
        </>
      )}
    </div>
  );
}
