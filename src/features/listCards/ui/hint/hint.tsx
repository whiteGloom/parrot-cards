import React, {FC} from 'react';
import styles from './styles.module.scss';

export interface IHintProps {
  title: string;
}

export const Hint: FC<IHintProps> = (props) => {
  const [isVisible, setVisible] = React.useState(false);

  if (!isVisible) {
    return (
      <div onClickCapture={() => {setVisible(true);}} className={styles.hiddenHint}>
        <p>{props.title.replaceAll(/\S/g, '*')}</p>
      </div>
    );
  }

  return (
    <p>{props.title}</p>
  );
};
