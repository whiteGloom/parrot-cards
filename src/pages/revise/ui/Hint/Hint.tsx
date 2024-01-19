import React, {FC} from 'react';

export interface IHintProps {
  title: string;
}

export const Hint: FC<IHintProps> = (props) => {
  const [isVisible, setVisible] = React.useState(false);

  if (!isVisible) {
    return (
      <button
        className={'px-2 py-1 border rounded shadow w-full text-center'}
        onClick={(e) => {
          e.stopPropagation();
          setVisible(true);
        }}
      >
        <p>{props.title.replaceAll(/\S/g, '*')}</p>
      </button>
    );
  }

  return (
    <div className={'px-2 py-1 border rounded shadow w-full text-center' }>
      <p>{props.title}</p>
    </div>
  );
};
