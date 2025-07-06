"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useFavorites } from "@/hooks/use-favorites";
import { TypeBadge } from "@/components/type-badge";

export default function Favorites() {
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <h1 className="text-4xl font-bold">Favorite Pokémon</h1>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">
            You have no favorites yet
          </h2>
          <p className="text-muted-foreground mb-4">
            Explore the list of Pokémon and mark your favorites by clicking the
            heart
          </p>
          <Link href="/">
            <Button>Explore Pokémon</Button>
          </Link>
        </div>
      ) : (
        <>
          <p className="text-muted-foreground mb-6">
            You have {favorites.length} favorite Pokémon
            {favorites.length !== 1 ? "s" : ""}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((pokemon) => (
              <Card
                key={pokemon.id}
                className="hover:shadow-lg transition-shadow"
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
                      <Heart className="w-4 h-4 fill-red-500 text-red-500" />
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
        </>
      )}
    </div>
  );
}
