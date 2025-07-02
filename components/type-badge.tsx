import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const typeColors: Record<string, string> = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-blue-200",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-green-400",
  rock: "bg-yellow-800",
  ghost: "bg-purple-700",
  dragon: "bg-indigo-700",
  dark: "bg-gray-800",
  steel: "bg-gray-500",
  fairy: "bg-pink-300",
};

interface TypeBadgeProps {
  typeName: string;
  size?: "sm" | "default" | "lg";
  clickable?: boolean;
}

export function TypeBadge({ typeName, size = "default" }: TypeBadgeProps) {
  return (
    <Link href={`/type/${typeName}`}>
      <Badge
        className={`${typeColors[typeName]} text-white
           "cursor-pointer hover:opacity-80 transition-opacity"
        ${
          size === "sm"
            ? "text-xs px-2 py-1"
            : size === "lg"
            ? "text-lg px-4 py-2"
            : ""
        }
        `}
      >
        {typeName}
      </Badge>
    </Link>
  );
}
