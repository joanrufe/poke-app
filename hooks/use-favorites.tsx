"use client"

import { useState, useEffect } from "react"

interface Pokemon {
  id: number
  name: string
  url: string
  types: string[]
  sprite: string
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Pokemon[]>([])

  useEffect(() => {
    const savedFavorites = localStorage.getItem("pokemon-favorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  const toggleFavorite = (pokemon: Pokemon) => {
    setFavorites((prevFavorites) => {
      const isAlreadyFavorite = prevFavorites.some((fav) => fav.id === pokemon.id)
      let newFavorites: Pokemon[]

      if (isAlreadyFavorite) {
        newFavorites = prevFavorites.filter((fav) => fav.id !== pokemon.id)
      } else {
        newFavorites = [...prevFavorites, pokemon]
      }

      localStorage.setItem("pokemon-favorites", JSON.stringify(newFavorites))
      return newFavorites
    })
  }

  return { favorites, toggleFavorite }
}
