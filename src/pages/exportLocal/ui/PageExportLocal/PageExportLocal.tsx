import React, {FC} from 'react';
import {useAppDispatch} from '../../../../shared/lib/store/useAppDispatch';
import {LinkButton} from '../../../../shared/ui/links/LinkButton/LinkButton';
import {ArrowLeft} from 'lucide-react';
import {Form, Formik} from 'formik';
import {dumpState} from '../../model/actions/dumpState';
import {saveToFileSystem} from '../../model/actions/saveToFileSystem';
import {ButtonDefault, ButtonDefaultTypes} from '../../../../shared/ui/buttons/ButtonDefault/ButtonDefault';
import {InputDefault} from '../../../../shared/ui/fields/InputDefault/InputDefault';
import {LabelAbove} from '../../../../shared/ui/fields/LabelAbove/LabelAbove';
import {LayoutMain} from '../../../../shared/ui/layouts/LayoutMain/LayoutMain';

export const PageExportLocal: FC = () => {
  const dispatch = useAppDispatch();

  const generatedTitle = `myAwesomeCards-${new Date().toLocaleDateString()}-${new Date().getHours()}.${new Date().getMinutes()}`;

  return (
    <LayoutMain>
      <header className={'flex gap-3 p-3 bg-gray-50 rounded border items-center'}>
        <LinkButton to={'/export'}><ArrowLeft/></LinkButton>

        <h1 className={'text-3xl font-bold'}>Export to local file</h1>
      </header>

      <section className={'flex flex-col p-3 gap-7 border rounded bg-gray-50'}>
        <Formik
          initialValues={{
            title: generatedTitle,
          }}
          onSubmit={(values: {title: string}) => {
            dispatch(dumpState())
              .then((s) => {
                saveToFileSystem(JSON.stringify(s.payload), `${values.title || generatedTitle}.json`, 'application/json');
              }, null);
          }}
        >
          <Form className={'flex flex-col gap-3'}>
            <LabelAbove label={'Filename'}>
              <InputDefault
                name={'title'}
                placeholder={generatedTitle}
              />
            </LabelAbove>

            <ButtonDefault theme={ButtonDefaultTypes.Accent}>Export</ButtonDefault>
          </Form>
        </Formik>
      </section>
    </LayoutMain>
  );
};
