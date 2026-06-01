import * as migration_20260601_094832 from './20260601_094832';
import * as migration_20260601_114322 from './20260601_114322';

export const migrations = [
  {
    up: migration_20260601_094832.up,
    down: migration_20260601_094832.down,
    name: '20260601_094832',
  },
  {
    up: migration_20260601_114322.up,
    down: migration_20260601_114322.down,
    name: '20260601_114322'
  },
];
