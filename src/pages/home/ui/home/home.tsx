import React, {FC} from 'react';
import {Link, useSearchParams} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {Field, Form, Formik} from 'formik';
import {selectAllTags} from '../../../../entity/tag';
import {Card} from '../cardListItem/card';
import {selectCardsByFilters} from '../../model/selectors/selectCardsByFilters';
import {dumpState} from '../../model/actions/dumpState';
import {useAppDispatch} from '../../../../shared/lib/store/useAppDispatch';
import {saveToFileSystem} from '../../model/actions/saveToFileSystem';
import {loadFileFromFileSystem} from '../../model/actions/loadFileFromFileSystem';
import {loadState, StateObjectType} from '../../model/actions/loadState';
import {OauthLoginButton} from '../../../../features/google/oauthLogin';
import {AppState} from '../../../../shared/lib/store/appState';
import {MainLayout} from '../../../../shared/ui/layouts/main/MainLayout';
import {ENV_GOOGLE_DRIVE_API_KEY} from '../../../../shared/lib/enironmentVariables';

type ValuesType = {
  tags: string[],
};

export const Home: FC = () => {
  const tags = useSelector(selectAllTags());
  const dispatch = useAppDispatch();
  const [fileToLoad, setFileToLoad] = React.useState<File | undefined>(undefined);

  const [searchParams, setSearchParams] = useSearchParams();

  const selectedTags = React.useMemo(() => {
    return searchParams.get('tags')?.split(',').filter(t => t.length) || [];
  }, [searchParams]);

  const tokenData = useSelector((state: AppState) => state.googleOauth.tokenData);
  const isAuthorized = useSelector((state: AppState) => state.googleOauth.isAuthorized);

  const cards = useSelector(selectCardsByFilters({tagsIds: selectedTags}));

  return (
    <MainLayout>
      <header className={'flex justify-between items-end'}>
        <h1 className={'text-3xl font-bold underline'}>Cards List</h1>
        <Link to={'/create-cards'}>Create new cards</Link>
      </header>

      <div>
        <button
          onClick={() => {
            dispatch(dumpState()).then((s) => {
              saveToFileSystem(JSON.stringify(s.payload), `pcd-${new Date().toLocaleDateString()}.json`, 'application/json');
            }, null);
          }}
        >
          Save to local file
        </button>

        <div>
          <button
            disabled={!fileToLoad}
            onClick={() => {
              loadFileFromFileSystem(fileToLoad as File)
                .then(result => dispatch(loadState(JSON.parse(result) as StateObjectType)))
                .catch((err) => console.log('Load from file failed. Reason: ', err));
            }}
          >
            Load cards
          </button>

          <input
            type={'file'}
            onChange={(e) => {
              setFileToLoad(e.target.files?.[0] || undefined);
            }}
          />
        </div>
      </div>

      <div>
        <OauthLoginButton scopes={['https://www.googleapis.com/auth/drive.file']}>
          Login via Google
        </OauthLoginButton>

        <button
          onClick={() => {
            if (!tokenData) {
              return;
            }

            const view = new google.picker.DocsView(google.picker.ViewId.FOLDERS);

            view.setSelectFolderEnabled(true);
            view.setParent('root');

            const picker = new google.picker.PickerBuilder()
              .addView(view)
              .setDeveloperKey(ENV_GOOGLE_DRIVE_API_KEY)
              .setOAuthToken(tokenData?.accessToken)
              .setCallback((e) => {
                console.log('wgl picker callback', e);
              })
              .build();
            picker.setVisible(true);
          }}
          disabled={!isAuthorized}
        >
          Select folder in Google Drive
        </button>

        <button
          onClick={() => {
            dispatch(dumpState()).then((s) => {
              if (!tokenData) {
                return;
              }

              const dest = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

              const metadata = {
                name: 'testfile.json',
                mimeType: 'application/json',
                parents: ['1hdYhgQVaYft-3BiB09vK7lg8ypU5nQFn'],
              };

              const body = new FormData();

              body.set(
                'metadata',
                new Blob([JSON.stringify(metadata)], {type: 'application/json'})
              );

              body.set('file', new Blob([JSON.stringify(s)], {type: 'application/json'}));

              fetch(dest, {
                method: 'POST',
                headers: new Headers({
                  Authorization: `${tokenData.tokenType} ${tokenData.accessToken}`,
                }),
                body: body,
              }).then((res) => console.log(res), (err) => console.log('Upload to Google Disk failed. Error:', err));
            }, null);
          }}
          disabled={!isAuthorized}
        >
          Upload to Google Drive
        </button>
      </div>

      <Formik
        initialValues={{tags: selectedTags}}
        onSubmit={(values: ValuesType, control) => {
          searchParams.set('tags', values.tags.length ? values.tags.join(',') : '');
          setSearchParams(searchParams);

          control.setSubmitting(false);
        }}
      >
        <Form>
          <fieldset style={{display: 'flex', flexDirection: 'column'}}>
            <legend>Filter by tags</legend>

            {tags.map((tag) => (
              <label key={tag.id} style={{color: tag.color}}>
                <Field type={'checkbox'} name={'tags'} value={tag.id}/>
                {tag.title}
              </label>
            ))}
          </fieldset>

          <button type={'submit'}>Apply filters</button>
        </Form>
      </Formik>

      <ul className={'bg-[#F7F7F7] p-3 rounded flex flex-col gap-3'}>
        {!cards.length ? (
          'No cards available yet'
        ) : undefined}

        {cards.map((card) => (
          <li key={card.id}>
            <Card cardData={card}/>
          </li>
        ))}
      </ul>
    </MainLayout>
  );
};
