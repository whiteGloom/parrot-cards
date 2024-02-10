import {IDumpActual} from '../../../../entity/dump';
import {IDumpUnknown} from '../../../../entity/dump/types/dump';
import {ITag} from '../../../../entity/tag';
import {ICard} from '../../../../entity/card';
import {UniqueIdGenerator} from '../../../../shared/lib/UniqueIdGenerator/UniqueIdGenerator';

export function migrateDump(dump: IDumpUnknown): IDumpActual {
  if (!dump.version) {
    dump.version = 1;
  }

  if (dump.version === 1) {
    const dumpV1 = dump as {version: number, cards: ICard[], tags: ITag[]};

    dumpV1.cards.forEach((card) => {
      const newId = UniqueIdGenerator.generateUID();

      dumpV1.tags.forEach((tag) => {
        tag.connectedCardsIds = tag.connectedCardsIds.map((id) => {
          return id === card.id ? newId : id;
        });
      });

      card.id = newId;
    });

    dumpV1.version = 2;

    dump = dumpV1 as unknown as IDumpActual;
  }

  return dump as IDumpActual;
}