"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Zap, Target, Eye } from "lucide-react";
import { useMoveDetail } from "@/hooks/use-pokemon-queries";
import { pokemonApi } from "@/lib/pokemon-api";
import { TypeBadge } from "./type-badge";

const damageClassColors: Record<string, string> = {
  physical: "bg-red-500",
  special: "bg-blue-500",
  status: "bg-gray-500",
};

interface TooltipPosition {
  top: number;
  left: number;
  show: boolean;
}

interface MoveTooltipProps {
  moveName: string;
  moveUrl: string;
  children: React.ReactNode;
}

export function MoveTooltip({ moveName, moveUrl, children }: MoveTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<TooltipPosition>({
    top: 0,
    left: 0,
    show: false,
  });
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  const moveId = pokemonApi.extractMoveId(moveUrl);
  const { data: moveData, isLoading, isError } = useMoveDetail(moveId, isOpen);

  // Ensure we're mounted (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

  const calculatePosition = (element: HTMLElement): TooltipPosition => {
    const rect = element.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    const viewportWidth = window.innerWidth;
    // Tooltip dimensions (approximate)
    const tooltipWidth = 320;
    const tooltipHeight = 200;

    let top = rect.top + scrollY - tooltipHeight - 10; // 10px gap above element
    let left = rect.left + scrollX + rect.width / 2 - tooltipWidth / 2;

    // Adjust if tooltip goes outside viewport horizontally
    if (left < 10) {
      left = 10;
    } else if (left + tooltipWidth > viewportWidth - 10) {
      left = viewportWidth - tooltipWidth - 10;
    }

    // Adjust if tooltip goes outside viewport vertically
    if (top < scrollY + 10) {
      // Show below element instead
      top = rect.bottom + scrollY + 10;
    }

    return { top, left, show: true };
  };

  const handleClick = () => {
    if (isOpen) {
      setIsOpen(false);
      setPosition((prev) => ({ ...prev, show: false }));
    } else {
      if (triggerRef.current) {
        const newPosition = calculatePosition(triggerRef.current);
        setPosition(newPosition);
      }
      setIsOpen(true);
    }
  };

  // Update position on scroll/resize and close on outside click
  useEffect(() => {
    const updatePosition = () => {
      if (position.show && triggerRef.current) {
        const newPosition = calculatePosition(triggerRef.current);
        setPosition(newPosition);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        position.show &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setPosition((prev) => ({ ...prev, show: false }));
      }
    };

    if (position.show) {
      window.addEventListener("scroll", updatePosition);
      window.addEventListener("resize", updatePosition);
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        window.removeEventListener("scroll", updatePosition);
        window.removeEventListener("resize", updatePosition);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [position.show]);

  // Get English description
  const getEnglishDescription = () => {
    if (!moveData) return "";

    // Try to get English flavor text first
    const englishFlavorText = moveData.flavor_text_entries.find(
      (entry) => entry.language.name === "en"
    );

    if (englishFlavorText) {
      return englishFlavorText.flavor_text.replace(/\n/g, " ");
    }

    // Fallback to English effect
    const englishEffect = moveData.effect_entries.find(
      (entry) => entry.language.name === "en"
    );

    if (englishEffect) {
      return englishEffect.effect.replace(/\$effect_chance/g, "chance");
    }

    return "No description available";
  };

  const tooltipContent = position.show && (
    <div
      className="fixed z-[9999] w-80"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        pointerEvents: "none", // Prevent tooltip from interfering with mouse events
      }}
    >
      <Card className="shadow-xl border-2 bg-background">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg capitalize flex items-center justify-between">
            {moveName.replace("-", " ")}
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-sm text-muted-foreground">
                Cargando...
              </span>
            </div>
          )}

          {isError && (
            <div className="text-center py-4">
              <p className="text-sm text-red-500">
                Error al cargar el movimiento
              </p>
            </div>
          )}

          {moveData && (
            <div className="space-y-3">
              {/* Type and Damage Class */}
              <div className="flex items-center gap-2">
                <TypeBadge
                  typeName={moveData.type.name}
                  size="sm"
                  clickable={false}
                />
                <Badge
                  className={`${
                    damageClassColors[moveData.damage_class.name]
                  } text-white text-xs capitalize`}
                >
                  {moveData.damage_class.name}
                </Badge>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Zap className="h-3 w-3 text-yellow-500" />
                  Power: {moveData.power || "—"}
                </div>
                <div className="flex items-center gap-1">
                  <Target className="h-3 w-3 text-blue-500" />
                  Accuracy: {moveData.accuracy ? `${moveData.accuracy}%` : "—"}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3 text-green-500" />
                  PP: {moveData.pp}
                </div>
                <div className="flex items-center gap-1">
                  Priority:{" "}
                  {moveData.priority > 0
                    ? `+${moveData.priority}`
                    : moveData.priority}
                </div>
              </div>

              {/* Description */}
              <div className="border-t pt-2">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {getEnglishDescription()}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <>
      <div ref={triggerRef} onClick={handleClick} className="cursor-pointer">
        {children}
      </div>

      {/* Render tooltip in portal to avoid overflow issues */}
      {mounted &&
        typeof window !== "undefined" &&
        createPortal(tooltipContent, document.body)}
    </>
  );
}
