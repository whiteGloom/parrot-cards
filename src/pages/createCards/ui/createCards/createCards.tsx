import React, {FC} from 'react';
import {useAppDispatch} from '../../../../shared/lib/store/useAppDispatch';
import {FieldArray, Form, Formik, FormikHelpers} from 'formik';
import {useSelectAllTags} from '../../../../entity/tag';
import {createCard} from '../../../../features/card/createCard';
import {createTag} from '../../../../features/tag/createTag';
import {LayoutMain} from '../../../../shared/ui/layouts/LayoutMain/LayoutMain';
import {ArrowLeft} from 'lucide-react';
import {LinkButton} from '../../../../shared/ui/links/LinkButton/LinkButton';
import {ButtonDefault, ButtonDefaultTypes} from '../../../../shared/ui/buttons/ButtonDefault/ButtonDefault';
import {CheckboxLabeled} from '../../../../shared/ui/fields/CheckboxLabeled/CheckboxLabeled';
import {InputDefault} from '../../../../shared/ui/fields/InputDefault/InputDefault';
import {LabelAbove} from '../../../../shared/ui/fields/LabelAbove/LabelAbove';
import {ErrorLabel} from '../../../../shared/ui/fields/ErrorLabel/ErrorLabel';
import {Fieldset} from '../../../../shared/ui/fields/Fieldset/Fieldset';

enum GroupNames {
  FrontSide='frontSide',
  BackSide='backSide',
}

type ValuesType = {
  [GroupNames.FrontSide]: {
    title: string;
    description: string;
    hints: string[];
  };
  [GroupNames.BackSide]: {
    title: string;
    description: string;
    hints: string[];
  };
  tags: string[];
  newTagTitle: string,
};

function titleValidator(value: string): string | undefined {
  if (!value.trim()) return 'Title is required field for both sides of the Card';
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
  tags: [],
  newTagTitle: '',
};

export const CreateCards: FC = () => {
  const dispatch = useAppDispatch();
  const firstFieldRef = React.useRef<HTMLInputElement>(null);
  const newTagTitleInputRef = React.useRef<HTMLInputElement>(null);

  const tags = useSelectAllTags();

  async function createNewTag(values: ValuesType, formControl: FormikHelpers<ValuesType>) {
    formControl.setSubmitting(true);

    const title = values.newTagTitle.trim();

    await dispatch(createTag({
      title: values.newTagTitle.trim(),
      connectedCardsIds: [],
    }));

    await formControl.setFieldValue('newTagTitle', '');
    if (!values.tags.includes(title)) {
      await formControl.setFieldValue('tags', [...values.tags, title]);
    }

    newTagTitleInputRef.current?.focus();

    formControl.setSubmitting(false);
  }

  return (
    <LayoutMain>
      <header className={'flex gap-3 p-3 bg-gray-50 rounded border items-center'}>
        <LinkButton to={'/'}><ArrowLeft/></LinkButton>
        <h1 className={'text-3xl font-bold'}>Create new cards</h1>
      </header>

      <section className={'flex flex-col gap-3 p-3 bg-gray-50 rounded border'}>
        <Formik
          validateOnMount={true}
          initialValues={emptyInitialValues}
          onSubmit={async (values: ValuesType, control) => {
            await dispatch(createCard({
              frontSide: prepareDataFromSideFields(values[GroupNames.FrontSide]),
              backSide: prepareDataFromSideFields(values[GroupNames.BackSide]),
              tagsIds: values.tags,
            }));

            control.resetForm();
            firstFieldRef.current?.focus();

            control.setSubmitting(false);
          }}
        >
          {(formState) => (
            <Form className={'flex flex-col gap-3'}>
              <div className={'flex gap-7 flex-wrap'}>
                {[{groupName: GroupNames.FrontSide, title: 'Front side'}, {groupName: GroupNames.BackSide, title: 'Back side'}]
                  .map((sideGroupParams, groupIndex) => {
                    const groupName = sideGroupParams.groupName;

                    return (
                      <Fieldset key={groupName} legend={sideGroupParams.title}>
                        <LabelAbove label={'Title'} required>
                          <InputDefault
                            name={`${groupName}.title`}
                            validate={titleValidator}
                            autoFocus={!groupIndex}
                            innerRef={!groupIndex ? firstFieldRef : undefined}
                            errorString={(formState.touched[groupName]?.title && formState.errors[groupName]?.title) || ''}
                          />

                          <ErrorLabel name={`${groupName}.title`}/>
                        </LabelAbove>

                        <LabelAbove label={'Description'}>
                          <InputDefault name={`${groupName}.description`} as={'textarea'}/>
                        </LabelAbove>

                        <FieldArray
                          name={`${groupName}.hints`}
                          render={(helpers) => {
                            return (
                              <>
                                {formState.values[groupName].hints.map((_value, index) => {
                                  return (
                                    <LabelAbove key={index} label={`Hint ${index + 1}`}>
                                      <InputDefault
                                        name={`${groupName}.hints[${index}]`}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                          formState.handleChange(event);

                                          if (event.target.value && formState.values[groupName].hints.length - 1 === index) {
                                            helpers.push('');
                                          }
                                        }}
                                      />
                                    </LabelAbove>
                                  );
                                })}
                              </>
                            );
                          }}
                        />
                      </Fieldset>
                    );
                  })
                }
              </div>

              <ButtonDefault
                type={'submit'}
                theme={ButtonDefaultTypes.Accent}
                disabled={formState.isSubmitting || formState.isValidating || !formState.isValid}
              >
                Create card
              </ButtonDefault>

              <Fieldset legend={'Tags'}>
                <ul className={'flex flex-col gap-1 max-h-64 overflow-scroll'}>
                  {tags.map((tag) => (
                    <li key={tag.id}>
                      <CheckboxLabeled name={'tags'} value={tag.id} style={{color: tag.color}}>
                        {tag.title}
                      </CheckboxLabeled>
                    </li>
                  ))}
                </ul>

                <LabelAbove label={'Title for a new tag'} required>
                  <InputDefault
                    name={'newTagTitle'}
                    onKeyDown={(event: React.KeyboardEvent) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();

                        if (formState.values.newTagTitle.trim()) {
                          createNewTag(formState.values, formState).catch(null);
                        }
                      }
                    }}
                    innerRef={newTagTitleInputRef}
                    placeholder={'Enter title for new tag'}
                  />
                </LabelAbove>

                <ButtonDefault
                  type={'button'}
                  disabled={!formState.values.newTagTitle.trim() || formState.isSubmitting}
                  onClick={() => {createNewTag(formState.values, formState).catch(null);}}
                >
                  Create new Tag
                </ButtonDefault>
              </Fieldset>
            </Form>
          )}
        </Formik>
      </section>
    </LayoutMain>
  );
};
