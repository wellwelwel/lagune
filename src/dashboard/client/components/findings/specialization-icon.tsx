import type { VNode } from 'preact';
import { specializationIconName } from '@/dashboard/shared/specialization-meta';
import { Icon } from '../primitives/icons';

export const SpecializationIcon = (props: { name: string }): VNode => (
  <Icon name={specializationIconName(props.name)} />
);
