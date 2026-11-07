import type { SpecializationIconName } from '@site/src/data/lagune';
import type { ReactNode } from 'react';
import type { IconBaseProps, IconType } from 'react-icons';
import {
  FiActivity,
  FiAlertTriangle,
  FiArrowLeft,
  FiArrowRight,
  FiArrowUpRight,
  FiCheck,
  FiChevronRight,
  FiCode,
  FiCopy,
  FiCpu,
  FiFile,
  FiGithub,
  FiGlobe,
  FiGrid,
  FiHeart,
  FiKey,
  FiLayers,
  FiMenu,
  FiMoon,
  FiPlay,
  FiRefreshCw,
  FiSearch,
  FiStar,
  FiSun,
  FiTerminal,
  FiThumbsDown,
  FiThumbsUp,
  FiUploadCloud,
  FiX,
} from 'react-icons/fi';
import { LuBrain, LuUndo2 } from 'react-icons/lu';
import { RiMessageAi3Line } from 'react-icons/ri';

export type DocsIconName = keyof typeof registry;

type IconProps = IconBaseProps & { name: DocsIconName };

const registry = {
  activity: FiActivity,
  alert: FiAlertTriangle,
  arrowLeft: FiArrowLeft,
  arrowRight: FiArrowRight,
  arrowUpRight: FiArrowUpRight,
  brain: LuBrain,
  check: FiCheck,
  chevronRight: FiChevronRight,
  code: FiCode,
  copy: FiCopy,
  cpu: FiCpu,
  file: FiFile,
  github: FiGithub,
  globe: FiGlobe,
  grid: FiGrid,
  heart: FiHeart,
  key: FiKey,
  layers: FiLayers,
  menu: FiMenu,
  messageAi: RiMessageAi3Line,
  moon: FiMoon,
  play: FiPlay,
  refresh: FiRefreshCw,
  search: FiSearch,
  star: FiStar,
  sun: FiSun,
  terminal: FiTerminal,
  thumbsDown: FiThumbsDown,
  thumbsUp: FiThumbsUp,
  undo: LuUndo2,
  upload: FiUploadCloud,
  x: FiX,
} satisfies Record<string, IconType> & Record<SpecializationIconName, IconType>;

const SIDEBAR_GROUP_ICONS: Partial<Record<string, DocsIconName>> = {
  'get-started': 'play',
  'the-blue-team-flow': 'activity',
  'development-flow': 'code',
  specializations: 'brain',
  tools: 'grid',
  hooks: 'cpu',
  'references-sources': 'file',
  maintenance: 'refresh',
};

export const sidebarGroupIcon = (key: string): DocsIconName =>
  SIDEBAR_GROUP_ICONS[key] ?? 'layers';

export const Icon = ({ name, ...glyphProps }: IconProps): ReactNode => {
  const Glyph = registry[name];

  return <Glyph aria-hidden='true' {...glyphProps} />;
};
