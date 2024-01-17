import React, {FC} from 'react';
import {MainLayout} from '../../../../shared/ui/layouts/main/MainLayout';
import {LinkButton} from '../../../../shared/ui/links/button/LinkButton';
import {useSearchParams} from 'react-router-dom';
import {Field, Form, Formik} from 'formik';
import {ButtonDefault, ButtonDefaultTypes} from '../../../../shared/ui/buttons/default/ButtonDefault';
import {useAppDispatch} from '../../../../shared/lib/store/useAppDispatch';
import {dumpState} from '../../model/actions/dumpState';
import {saveToFileSystem} from '../../model/actions/saveToFileSystem';
import {ArrowLeft} from 'lucide-react';

const LocalExportView: FC = () => {
  const dispatch = useAppDispatch();

  const generatedTitle = `myAwesomeCards-${new Date().toLocaleDateString()}-${new Date().getHours()}.${new Date().getMinutes()}`;

  return (
    <div className={'flex flex-col gap-7'}>
      <header className={'flex gap-3 p-3 bg-[#F7F7F7] rounded border items-center'}>
        <LinkButton to={'/export'}><ArrowLeft/></LinkButton>
        <h1 className={'text-3xl font-bold'}>Export to local file</h1>
      </header>

      <div className={'flex flex-col p-3 gap-7 border rounded bg-[#F7F7F7]'}>
        <Formik
          initialValues={{
            title: generatedTitle,
          }}
          onSubmit={(values: {title: string}) => {
            console.log('wgl onSubmit.values', values);
            dispatch(dumpState()).then((s) => {
              saveToFileSystem(JSON.stringify(s.payload), `${values.title || generatedTitle}.json`, 'application/json');
            }, null);
          }}
        >
          <Form className={'flex flex-col gap-3'}>
            <label className={'flex items-center gap-2'}>
              Filename:
              <Field
                className={'border rounded p-2 flex-1'}
                name={'title'}
                placeholder={generatedTitle}
              />
            </label>
            <ButtonDefault theme={ButtonDefaultTypes.Accent}>Save</ButtonDefault>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

const MethodSelectorView: FC = () => {
  return (
    <div className={'flex flex-col gap-7'}>
      <header className={'flex gap-3 p-3 bg-[#F7F7F7] rounded border'}>
        <LinkButton to={'/'}><ArrowLeft/></LinkButton>
        <h1 className={'text-3xl font-bold'}>Export methods</h1>
      </header>

      <div className={'flex flex-col p-3 gap-3 border rounded bg-[#F7F7F7] items-start'}>
        <LinkButton to={'/export?exportType=local'}>Export as local JSON file</LinkButton>

        <ButtonDefault disabled>Export to Google Drive</ButtonDefault>
      </div>
    </div>
  );
};

export const ExportPage: FC = () => {
  const [search] = useSearchParams();

  const type = search.get('exportType');

  return (
    <MainLayout>
      {
        type === 'local'
        ? <LocalExportView/>
        : <MethodSelectorView/>
      }
    </MainLayout>
  );
};
