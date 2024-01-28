import React from 'react';
import './styles/index.scss';
import {ReduxStoreProvider} from './providers/store';
import {AppRouterProvider} from './providers/router/router';
import {useAppDispatch} from '../shared/lib/store/useAppDispatch';
import {REQUEST_PRELOAD_GOOGLE_OAUTH} from '../entity/google/oauth';
import {ButtonDefault, ButtonDefaultTypes} from '../shared/ui/buttons/ButtonDefault/ButtonDefault';
import {Notifications} from '../widgets/notification';

function App() {
  const [isWarningVisible, setWarningVisibility] = React.useState(true);

  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch({type: REQUEST_PRELOAD_GOOGLE_OAUTH});
  });

  return (
    <div className="w-full min-h-100% overflow-y-auto">
      <AppRouterProvider/>

      <Notifications/>

      {isWarningVisible ? (
        <div className={'fixed w-full h-[100vh] bg-white flex flex-col items-center justify-center top-0 left-0 gap-3'}>
          <p className={'text-center p-3'}>
            <b>Reloading of the page will reset your actions on the website!</b><br/>
            Saving inside of the browser is not implemented yet!<br/>
            Use export to save your data!
          </p>

          <ButtonDefault
            theme={ButtonDefaultTypes.Warning}
            onClick={() => {setWarningVisibility(false);}}
            autoFocus
          >
            I understand
          </ButtonDefault>
        </div>
      ) : undefined}
    </div>
  );
}

function Wrapper() {
  return (
    <ReduxStoreProvider>
      <App/>
    </ReduxStoreProvider>
  );
}

export default Wrapper;
