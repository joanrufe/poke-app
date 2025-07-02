"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { pokemonApi } from "@/lib/pokemon-api";

// Query keys for better cache management
export const pokemonKeys = {
  all: ["pokemon"] as const,
  lists: () => [...pokemonKeys.all, "list"] as const,
  list: (page: number) => [...pokemonKeys.lists(), page] as const,
  details: () => [...pokemonKeys.all, "detail"] as const,
  detail: (id: string) => [...pokemonKeys.details(), id] as const,
  search: (name: string) => [...pokemonKeys.all, "search", name] as const,
  types: () => [...pokemonKeys.all, "type"] as const,
  type: (typeName: string) => [...pokemonKeys.types(), typeName] as const,
  typeList: (typeName: string) =>
    [...pokemonKeys.types(), typeName, "list"] as const,
  moves: () => [...pokemonKeys.all, "move"] as const,
  move: (moveId: string) => [...pokemonKeys.moves(), moveId] as const,
};

// Hook for fetching Pokemon list with pagination
export function usePokemonList(page: number, limit = 20) {
  return useQuery({
    queryKey: pokemonKeys.list(page),
    queryFn: () => pokemonApi.getPokemonList(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for fetching Pokemon details
export function usePokemonDetail(id: string) {
  return useQuery({
    queryKey: pokemonKeys.detail(id),
    queryFn: () => pokemonApi.getPokemonDetail(id),
    enabled: !!id, // Only run if id exists
    staleTime: 10 * 60 * 1000, // 10 minutes - details change less frequently
  });
}

// Hook for searching Pokemon
export function usePokemonSearch(name: string) {
  return useQuery({
    queryKey: pokemonKeys.search(name),
    queryFn: () => pokemonApi.searchPokemon(name),
    enabled: !!name && name.length > 2, // Only search if name has more than 2 characters
    retry: 1, // Don't retry search failures as much
  });
}

// Hook for infinite scroll
export function usePokemonInfiniteList(limit = 20) {
  return useInfiniteQuery({
    queryKey: [...pokemonKeys.lists(), "infinite"],
    queryFn: ({ pageParam = 1 }) => pokemonApi.getPokemonList(pageParam, limit),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2, // Retry failed requests twice
  });
}

// Hook for fetching type details
export function useTypeDetail(typeName: string) {
  return useQuery({
    queryKey: pokemonKeys.type(typeName),
    queryFn: () => pokemonApi.getTypeDetail(typeName),
    enabled: !!typeName,
    staleTime: 15 * 60 * 1000, // 15 minutes - type data rarely changes
  });
}

// Hook for infinite scroll of Pokemon by type
export function usePokemonByTypeInfinite(typeName: string, limit = 20) {
  return useInfiniteQuery({
    queryKey: [...pokemonKeys.typeList(typeName), "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      pokemonApi.getPokemonByType(typeName, pageParam, limit),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
    enabled: !!typeName,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

// Hook for fetching move details
export function useMoveDetail(moveId: string, enabled = false) {
  return useQuery({
    queryKey: pokemonKeys.move(moveId),
    queryFn: () => pokemonApi.getMoveDetail(moveId),
    enabled: !!moveId && enabled, // Only run if moveId exists and explicitly enabled
    staleTime: 30 * 60 * 1000, // 30 minutes - move data rarely changes
    retry: 1, // Don't retry move failures as much since they're triggered by hover
  });
}
