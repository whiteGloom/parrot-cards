import React, {FC} from 'react';
import styles from './styles.module.scss';
import {Field, FieldArray, Form, Formik} from 'formik';
import clsx from 'clsx';

enum GroupNames {
  FrontSide='frontSide',
  BackSide='backSide',
}

type ValuesType = {
  [GroupNames.FrontSide]: {
    title: string;
    description: string;
    hints: string[];
  },
  [GroupNames.BackSide]: {
    title: string;
    description: string;
    hints: string[];
  }
};

function titleValidator(value: string): string | undefined {
  if (!value.trim()) {
    return 'Title is required field for both sides of Card';
  }

  return undefined;
}

function prepareDataFromSideFields(sideFields: ValuesType['frontSide']) {
  return {
    title: sideFields.title.trim(),
    description: sideFields.description.trim(),
    hints: sideFields.hints.reduce((acc: string[], hint) => {
      const valueTrimmed = hint.trim();

      if (valueTrimmed.length) {
        acc.push(valueTrimmed);
      }

      return acc;
    }, []),
  };
}

export interface IEditCardFormProps {
  initialValues?: Partial<ValuesType>,
  onSubmit?: (values: ValuesType) => void,
  resetOnSubmit?: boolean,
  submitTitle: string;
}

const emptyInitialValues: ValuesType = {
  frontSide: {
    title: '',
    description: '',
    hints: [''],
  },
  backSide: {
    title: '',
    description: '',
    hints: [''],
  },
};

export const CardForm: FC<IEditCardFormProps> = (props) => {
  const firstFieldRef = React.createRef<HTMLInputElement>();

  return (
    <Formik
      validateOnChange={false}
      validateOnBlur={false}
      initialValues={{...emptyInitialValues, ...(JSON.parse(JSON.stringify(props.initialValues || {})) as ValuesType)}}
      onSubmit={(values: ValuesType, control) => {
        console.log('CreateCardForm onSubmit', values); // TODO REMOVE

        if (props.onSubmit) {
          props.onSubmit({
            [GroupNames.FrontSide]: prepareDataFromSideFields(values[GroupNames.FrontSide]),
            [GroupNames.BackSide]: prepareDataFromSideFields(values[GroupNames.BackSide]),
          });
        }

        if (props.resetOnSubmit) {
          control.resetForm();
          firstFieldRef.current?.focus();
        }

        control.setSubmitting(false);
      }}
    >
      {(formState) => (
        <Form className={styles.cardEditor}>
          <div className={styles.sidesWrapper}>
            {[{groupName: GroupNames.FrontSide, title: 'Front side'}, {groupName: GroupNames.BackSide, title: 'Back side'}]
              .map((sideGroupParams, groupIndex) => {
                const groupName = sideGroupParams.groupName;

                return (
                  <fieldset className={styles.sideEditor} key={groupName}>
                    <legend>{sideGroupParams.title}</legend>

                    <label>
                      {'Title: '}
                      <Field
                        name={`${groupName}.title`}
                        validate={titleValidator}
                        autoFocus={!groupIndex}
                        innerRef={!groupIndex ? firstFieldRef : undefined}
                        className={clsx(formState.errors[groupName]?.title && styles.fieldError)}
                      />
                    </label>

                    <label>Description: <Field name={`${groupName}.description`} as={'textarea'} /></label>

                    <FieldArray
                      name={`${groupName}.hints`}
                      render={(helpers) => {
                        return (
                          <>
                            {formState.values[groupName].hints.map((_value, index) => {
                              return (
                                <label key={index}>
                                  {`Hint ${index + 1}: `}
                                  <Field
                                    name={`${groupName}.hints[${index}]`}
                                    onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                      await formState.setFieldValue(`${groupName}.hints[${index}]`, event.target.value);

                                      if (event.target.value && formState.values[groupName].hints.length - 1 === index) {
                                        helpers.push('');
                                      }
                                    }}
                                  />
                                </label>
                              );
                            })}
                          </>
                        );
                      }}
                    />
                  </fieldset>
                );
              })
            }
          </div>

          <button type={'submit'} disabled={formState.isSubmitting || formState.isValidating}>{props.submitTitle}</button>
        </Form>
      )}
    </Formik>
  );
};
