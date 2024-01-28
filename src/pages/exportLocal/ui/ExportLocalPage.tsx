import React, {FC, useEffect, useMemo, useState} from 'react';
import {LinkButton} from '../../../shared/ui/links/LinkButton/LinkButton';
import {ArrowLeft} from 'lucide-react';
import {Form, Formik} from 'formik';
import {InputDefault} from '../../../shared/ui/fields/InputDefault/InputDefault';
import {LabelAbove} from '../../../shared/ui/fields/LabelAbove/LabelAbove';
import {LayoutMain} from '../../../shared/ui/layouts/LayoutMain/LayoutMain';
import {useDumpDataThunk} from '../../../features/dumpData/model/actions/dumpData';
import {unwrapResult} from '@reduxjs/toolkit';
import {ButtonDefault, ButtonDefaultTypes} from '../../../shared/ui/buttons/ButtonDefault/ButtonDefault';
import {getDateStringForSave} from '../../../shared/lib/getDateStringForSave';
import {DownloadButton} from '../../../shared/ui/buttons/DownloadButton/DownloadButton';
import {useAddNotificationThunk} from '../../../features/notifications/addNotification';
import {NotificationType} from '../../../entity/notification';

type DumpInfo = {
  isLoading: boolean,
  dumpString?: string,
}

export const ExportLocalPage: FC = () => {
  const dispatchDumpData = useDumpDataThunk();
  const addNotification = useAddNotificationThunk();

  const [dumpInfo, setDumpInfo] = useState<DumpInfo>({isLoading: true, dumpString: undefined});

  const generatedTitle = useMemo(() => `parrot-cards-${getDateStringForSave()}`, []);

  useEffect(() => {
    dispatchDumpData()
      .then((result) => {
        setDumpInfo({isLoading: false, dumpString: JSON.stringify(unwrapResult(result))});
      })
      .catch((error: unknown) => {
        setDumpInfo({isLoading: false, dumpString: undefined});

        addNotification({
          title: `Preparing for export failed: ${error as string}`,
          type: NotificationType.Error,
        }).catch(null);
      });
  }, [addNotification, dispatchDumpData]);

  return (
    <LayoutMain>
      <header className={'flex gap-3 p-3 bg-gray-50 rounded border items-center'}>
        <LinkButton to={'/export'}><ArrowLeft/></LinkButton>

        <h1 className={'text-3xl font-bold'}>Export to local file</h1>
      </header>

      <section className={'flex flex-col p-3 gap-7 border rounded bg-gray-50'}>
        <Formik
          initialValues={{title: generatedTitle}}
          onSubmit={(values, formikHelpers) => {
            formikHelpers.setSubmitting(false);
          }}
        >
          {(formState) => (
            <Form className={'flex flex-col gap-3'}>
              <LabelAbove label={'Filename'}>
                <InputDefault
                  name={'title'}
                  placeholder={generatedTitle}
                />
              </LabelAbove>

              {dumpInfo.isLoading && <ButtonDefault theme={ButtonDefaultTypes.Accent} disabled>Loading...</ButtonDefault>}

              {!dumpInfo.isLoading && dumpInfo.dumpString && (
                <DownloadButton
                  fileName={`${formState.values.title || generatedTitle}.json`}
                  dumpString={dumpInfo.dumpString}
                  fileExtension={'application/json'}
                />
              )}

              {!dumpInfo.isLoading && !dumpInfo.dumpString && (
                <ButtonDefault
                  theme={ButtonDefaultTypes.Warning}
                  disabled
                >An error occurred while preparing the export</ButtonDefault>
              )}
            </Form>
          )}
        </Formik>
      </section>
    </LayoutMain>
  );
};
