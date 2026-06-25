export interface DesignThemeColors {
  background: string;
  surface: string;
  text: string;
  muted: string;
  mutedSurface?: string;
  accent: string;
  border: string;
  installText: string;
}

export interface DesignSystem {
  name: string;
  category: string;
  label: string;
  description: string;
  slug: string;
  colors: DesignThemeColors;
  radius: string;
  shadow: string;
}

export interface DesignCatalog {
  categories: string[];
  designs: DesignSystem[];
}
