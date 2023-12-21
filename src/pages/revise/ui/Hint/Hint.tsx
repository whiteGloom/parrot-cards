import React, {FC} from 'react';
import styles from './styles.module.scss';
import clsx from 'clsx';

export interface IHintProps {
  title: string;
}

export const Hint: FC<IHintProps> = (props) => {
  const [isVisible, setVisible] = React.useState(false);

  if (!isVisible) {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          setVisible(true);
        }}
        className={clsx(styles.hint, styles.hintButton)}
      >
        <p>{props.title.replaceAll(/\S/g, '*')}</p>
      </div>
    );
  }

  return (
    <div className={styles.hint}>
      <p>{props.title}</p>
    </div>
  );
};
