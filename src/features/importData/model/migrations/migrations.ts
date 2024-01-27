import {IDumpActual} from '../../../../entity/dump';
import {IDumpUnknown} from '../../../../entity/dump/types/dump';

export function migrateDump(dump: IDumpUnknown): IDumpActual {
  let version = dump.version || 0;

  if (!version) {
    version += 1;
  }

  dump.version = version;

  return dump as IDumpActual;
}