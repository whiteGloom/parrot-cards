import React, {FC} from 'react';
import styles from './styles.module.scss';
import {ICollection} from '../../../../entity/collection';
import {removeCollection} from '../../../../features/removeCollection';
import {useAppDispatch} from '../../../../shared/hooks/useAppDispatch';

export interface CollectionProps {
  collectionData: ICollection;
}

export const CollectionItem: FC<CollectionProps> = (props) => {
  const dispatch = useAppDispatch();

  return (
    <div className={styles.collection}>
      <div className={styles.collectionInfo}>
        <p>{props.collectionData.title}</p>
      </div>
      <div className={styles.collectionControls}>
        <button>Open</button>
        <button onClick={() => dispatch(removeCollection(props.collectionData.id))}>Delete</button>
      </div>
    </div>
  );
};
