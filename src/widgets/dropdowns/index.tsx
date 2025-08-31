import {
  forwardRef,
  type ReactNode,
  type Ref,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import clsx from 'clsx';

export interface DropdownProps {
  ref: Ref<HTMLDivElement>
  buildContent: (props: { close: () => void }) => ReactNode
  buildButton: (props: {
    open: () => void
    close: () => void
    isOpened: boolean
    toggleOpened: () => void
  }) => ReactNode
  contentWrapperClassName?: string
  buttonWrapperClassName?: string
  className?: string
  onOpenChange?: (isOpened: boolean) => void
}

export interface DropdownImperativeControls {
  setIsOpened: (isOpened: boolean) => void
  isOpened: boolean
  toggleOpened: () => void
}

export const Dropdown = forwardRef<DropdownImperativeControls, DropdownProps>(
  (props, ref) => {
    const [isOpened, setIsOpened] = useState(false);

    const setIsOpenedWrapped = useCallback((newIsOpened: boolean) => {
      setIsOpened(newIsOpened);
      props.onOpenChange?.(newIsOpened);
    }, [props]);

    useImperativeHandle(ref, () => ({
      setIsOpened: setIsOpenedWrapped,
      toggleOpened: () => setIsOpenedWrapped(!isOpened),
      isOpened,
    }), [isOpened, setIsOpenedWrapped]);

    return (
      <div className={clsx(['relative', props.className])}>
        <div className={clsx(props.buttonWrapperClassName)}>
          {props.buildButton({
            open: () => setIsOpenedWrapped(true),
            close: () => setIsOpenedWrapped(false),
            toggleOpened: () => {
              setIsOpenedWrapped(!isOpened);
            },
            isOpened,
          })}
        </div>
        {isOpened && (
          <div className={clsx('flex flex-col absolute z-10', props.contentWrapperClassName)}>
            {props.buildContent({
              close: () => setIsOpenedWrapped(false),
            })}
          </div>
        )}
      </div>
    );
  });
