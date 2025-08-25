import styles from './styles.module.css';
import clsx from 'clsx';

export function LoadingIndicator(props: { className?: string, colorClassName?: string }) {
  return (
    <div
      className={clsx([
        styles.loader,
        props.colorClassName || 'after:bg-blue-500',
        props.className,
      ])}
    />
  );
}
