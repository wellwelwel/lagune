export type CompanionTile = 'wide' | 'tall' | 'small';

export type Companion = {
  name: string;
  logo: string;
  href: string;
  tile: CompanionTile;
};

export const COMPANIONS: Companion[] = [
  {
    name: 'Superpowers',
    logo: '/img/logos/superpowers.svg',
    href: 'https://github.com/obra/superpowers',
    tile: 'wide',
  },
  {
    name: "Matt Pocock's Skills",
    logo: '/img/logos/mattpocock.svg',
    href: 'https://github.com/mattpocock/skills',
    tile: 'tall',
  },
  {
    name: 'Spec Kit',
    logo: '/img/logos/spec-kit-mono.png',
    href: 'https://github.com/github/spec-kit',
    tile: 'small',
  },
  {
    name: 'OpenSpec',
    logo: '/img/logos/openspec.svg',
    href: 'https://github.com/Fission-AI/OpenSpec',
    tile: 'small',
  },
  {
    name: 'Caveman',
    logo: '/img/logos/caveman.svg',
    href: 'https://github.com/JuliusBrussee/caveman',
    tile: 'small',
  },
  {
    name: 'Anthropic Skills',
    logo: '/img/logos/anthropic.svg',
    href: 'https://github.com/anthropics/skills',
    tile: 'small',
  },
  {
    name: 'Ponytail',
    logo: '/img/logos/ponytail.png',
    href: 'https://github.com/DietrichGebert/ponytail',
    tile: 'small',
  },
];

export const companionNamed = (name: string): Companion => {
  const companion = COMPANIONS.find((entry) => entry.name === name);

  if (!companion) throw new Error(`No companion is named "${name}".`);

  return companion;
};
