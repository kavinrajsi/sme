import * as migration_20260601_094832 from './20260601_094832';

export const migrations = [
  {
    up: migration_20260601_094832.up,
    down: migration_20260601_094832.down,
    name: '20260601_094832'
  },
];
