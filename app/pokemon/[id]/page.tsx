"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, ArrowLeft, Heart } from "lucide-react";
import Image from "next/image";
import { useFavorites } from "@/hooks/use-favorites";
import { usePokemonDetail } from "@/hooks/use-pokemon-queries";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TypeBadge } from "@/components/type-badge";
import { MoveTooltip } from "@/components/move-tooltip";

const statNames: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Special Attack",
  "special-defense": "Special Defense",
  speed: "Speed",
};

export default function PokemonDetail() {
  const params = useParams();
  const router = useRouter();
  const { favorites, toggleFavorite } = useFavorites();
  const [showAllMoves, setShowAllMoves] = useState(false);

  const pokemonId = params.id as string;
  const {
    data: pokemon,
    isLoading,
    isError,
    error,
  } = usePokemonDetail(pokemonId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading Pokémon details...</p>
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
            Error loading Pokémon: {error?.message || "Pokémon not found"}
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

  if (!pokemon) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-lg">Pokémon not found</p>
          <Button onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    );
  }

  const isFavorite = favorites.some((fav) => fav.id === pokemon.id);
  const pokemonForFavorites = {
    id: pokemon.id,
    name: pokemon.name,
    url: `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`,
    types: pokemon.types.map((type) => type.type.name),
    sprite:
      pokemon.sprites.front_default || "/placeholder.svg?height=96&width=96",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={() => toggleFavorite(pokemonForFavorites)}
          variant={isFavorite ? "destructive" : "outline"}
        >
          <Heart
            className={`w-4 h-4 mr-2 ${isFavorite ? "fill-current" : ""}`}
          />
          {isFavorite ? "Remove from favorites" : "Add to favorites"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-3xl capitalize">
                {pokemon.name}
              </CardTitle>
              <span className="text-xl text-muted-foreground">
                #{pokemon.id.toString().padStart(3, "0")}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-6">
              <Image
                src={
                  pokemon.sprites.other["official-artwork"].front_default ||
                  pokemon.sprites.front_default
                }
                alt={pokemon.name}
                width={300}
                height={300}
                className="max-w-full h-auto"
              />
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Types</h3>
                <div className="flex gap-2">
                  {pokemon.types.map((type) => (
                    <TypeBadge key={type.type.name} typeName={type.type.name} />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Height</p>
                  <p className="text-lg font-semibold">
                    {pokemon.height / 10} m
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Weight</p>
                  <p className="text-lg font-semibold">
                    {pokemon.weight / 10} kg
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pokemon.stats.map((stat) => (
                  <div key={stat.stat.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        {statNames[stat.stat.name] || stat.stat.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {stat.base_stat}
                      </span>
                    </div>
                    <Progress
                      value={(stat.base_stat / 255) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Moves
                <span className="text-sm font-normal text-muted-foreground">
                  {" "}
                  Click on each move for more details
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(showAllMoves
                    ? pokemon.moves
                    : pokemon.moves.slice(0, 20)
                  ).map((move) => (
                    <MoveTooltip
                      key={move.move.name}
                      moveName={move.move.name}
                      moveUrl={move.move.url}
                    >
                      <Badge
                        variant="secondary"
                        className="justify-start cursor-pointer hover:bg-secondary/80 transition-colors w-full"
                      >
                        {move.move.name.replace("-", " ")}
                      </Badge>
                    </MoveTooltip>
                  ))}
                </div>
                {pokemon.moves.length > 20 && !showAllMoves && (
                  <div className="text-center pt-4">
                    <p className="text-sm text-muted-foreground">
                      And {pokemon.moves.length - 20} more moves...
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 bg-transparent"
                      onClick={() => setShowAllMoves(true)}
                    >
                      Show all moves
                    </Button>
                  </div>
                )}
                {showAllMoves && pokemon.moves.length > 20 && (
                  <div className="text-center pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 bg-transparent"
                      onClick={() => setShowAllMoves(false)}
                    >
                      Show less
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
