"use client";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";

type BedroomValue = number | "5+" | "";
type BathroomValue = number | "4+" | "";

export interface Filters {
  search: string;
  propertyType: string[];
  listingType: string[];
  priceRange: {
    min: number | "";
    max: number | "";
  };
  bedrooms: BedroomValue;
  bathrooms: BathroomValue;
  livingAreaRange: {
    min: number | "";
    max: number | "";
  };
  condition: string;
}

interface ListingsFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  totalListings: number;
  t: (key: string) => string;
}

export function ListingsFilters({
  filters,
  onFiltersChange,
  totalListings,
  t,
}: ListingsFiltersProps) {
  const propertyTypes = [
    "apartment",
    "house",
    "garage_parking",
    "land",
    "building",
    "business_funds",
    "commercial",
    "shared_room",
    "office",
    "business_premises",
    "other",
  ];
  const listingTypes = ["sale", "rent", "vacation"];
  const conditions = ["new", "excellent", "good", "to_renovate", "to_rebuild"];
  const bedroomOptions: BedroomValue[] = [1, 2, 3, 4, "5+"];
  const bathroomOptions: BathroomValue[] = [1, 2, 3, "4+"];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between px-4">
          <h2 className="text-lg font-semibold">{t("filters.title")}</h2>
          <Badge variant="secondary">
            {totalListings} {t("filters.results")}
          </Badge>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Price Range */}
        <SidebarGroup>
          <SidebarGroupLabel>{t("filters.priceRange")}</SidebarGroupLabel>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder={t("filters.min")}
              value={filters.priceRange.min}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  priceRange: {
                    ...filters.priceRange,
                    min: e.target.value ? Number(e.target.value) : "",
                  },
                })
              }
              onWheel={(e) => e.currentTarget.blur()}
            />
            <Input
              type="number"
              placeholder={t("filters.max")}
              value={filters.priceRange.max}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  priceRange: {
                    ...filters.priceRange,
                    max: e.target.value ? Number(e.target.value) : "",
                  },
                })
              }
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>
        </SidebarGroup>

        {/* Living Area */}
        <SidebarGroup>
          <SidebarGroupLabel>{t("filters.livingArea")}</SidebarGroupLabel>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder={`${t("filters.min")} m²`}
              value={filters.livingAreaRange.min}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  livingAreaRange: {
                    ...filters.livingAreaRange,
                    min: e.target.value ? Number(e.target.value) : "",
                  },
                })
              }
              onWheel={(e) => e.currentTarget.blur()}
            />
            <Input
              type="number"
              placeholder={`${t("filters.max")} m²`}
              value={filters.livingAreaRange.max}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  livingAreaRange: {
                    ...filters.livingAreaRange,
                    max: e.target.value ? Number(e.target.value) : "",
                  },
                })
              }
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>
        </SidebarGroup>

        {/* Property Type */}
        <SidebarGroup>
          <SidebarGroupLabel>{t("filters.propertyType")}</SidebarGroupLabel>
          <div className="flex flex-wrap gap-2">
            {propertyTypes.map((type) => (
              <Badge
                key={type}
                variant={
                  filters.propertyType.includes(type) ? "default" : "outline"
                }
                className="cursor-pointer"
                onClick={() => {
                  const newTypes = filters.propertyType.includes(type)
                    ? filters.propertyType.filter((t) => t !== type)
                    : [...filters.propertyType, type];
                  onFiltersChange({ ...filters, propertyType: newTypes });
                }}
              >
                {t(`filters.propertyTypes.${type}`)}
              </Badge>
            ))}
          </div>
        </SidebarGroup>

        {/* Bedrooms */}
        <SidebarGroup>
          <SidebarGroupLabel>{t("filters.bedrooms")}</SidebarGroupLabel>
          <div className="flex gap-2">
            {bedroomOptions.map((num) => (
              <Badge
                key={num}
                variant={filters.bedrooms === num ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    bedrooms: filters.bedrooms === num ? "" : num,
                  })
                }
              >
                {num}
              </Badge>
            ))}
          </div>
        </SidebarGroup>

        {/* Bathrooms */}
        <SidebarGroup>
          <SidebarGroupLabel>{t("filters.bathrooms")}</SidebarGroupLabel>
          <div className="flex gap-2">
            {bathroomOptions.map((num) => (
              <Badge
                key={num}
                variant={filters.bathrooms === num ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    bathrooms: filters.bathrooms === num ? "" : num,
                  })
                }
              >
                {num}
              </Badge>
            ))}
          </div>
        </SidebarGroup>

        {/* Listing Type */}
        <SidebarGroup>
          <SidebarGroupLabel>{t("filters.listingType")}</SidebarGroupLabel>
          <div className="flex gap-2">
            {listingTypes.map((type) => (
              <Badge
                key={type}
                variant={
                  filters.listingType.includes(type) ? "default" : "outline"
                }
                className="cursor-pointer"
                onClick={() => {
                  const newTypes = filters.listingType.includes(type)
                    ? filters.listingType.filter((t) => t !== type)
                    : [...filters.listingType, type];
                  onFiltersChange({ ...filters, listingType: newTypes });
                }}
              >
                {t(`filters.${type}`)}
              </Badge>
            ))}
          </div>
        </SidebarGroup>

        {/* Condition */}
        <SidebarGroup>
          <SidebarGroupLabel>{t("filters.condition")}</SidebarGroupLabel>
          <div className="flex flex-wrap gap-2">
            {conditions.map((condition) => (
              <Badge
                key={condition}
                variant={
                  filters.condition === condition ? "default" : "outline"
                }
                className="cursor-pointer"
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    condition: filters.condition === condition ? "" : condition,
                  })
                }
              >
                {t(`filters.conditions.${condition}`)}
              </Badge>
            ))}
          </div>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() =>
            onFiltersChange({
              search: "",
              propertyType: [],
              listingType: [],
              priceRange: { min: "", max: "" },
              bedrooms: "",
              bathrooms: "",
              livingAreaRange: { min: "", max: "" },
              condition: "",
            })
          }
        >
          {t("filters.resetFilters")}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
