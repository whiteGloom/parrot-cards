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
  buildButton: (props: { open: () => void, close: () => void, isOpened: boolean }) => ReactNode
  contentWrapperClassName?: string
  buttonWrapperClassName?: string
  className?: string
  onOpenChange?: (isOpened: boolean) => void
}

export interface DropdownImperativeControls {
  setIsOpened: (isOpened: boolean) => void
  isOpened: boolean
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
      isOpened,
    }), [isOpened, setIsOpenedWrapped]);

    return (
      <div className={clsx(['relative', props.className])}>
        <div className={clsx(props.buttonWrapperClassName)}>
          {props.buildButton({
            open: () => setIsOpened(true),
            close: () => setIsOpened(false),
            isOpened,
          })}
        </div>
        {isOpened && (
          <div className={clsx('flex flex-col absolute', props.contentWrapperClassName)}>
            {props.buildContent({
              close: () => setIsOpened(false),
            })}
          </div>
        )}
      </div>
    );
  });
