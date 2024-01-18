import React, {FC} from 'react';
import {useAppDispatch} from '../../../../shared/lib/store/useAppDispatch';
import {FieldArray, Form, Formik, FormikHelpers} from 'formik';
import {useSelector} from 'react-redux';
import {selectAllTags} from '../../../../entity/tag';
import {createCard} from '../../../../features/card/createCard';
import {createTag} from '../../../../features/tag/createTag';
import {MainLayout} from '../../../../shared/ui/layouts/main/MainLayout';
import {ArrowLeft} from 'lucide-react';
import {LinkButton} from '../../../../shared/ui/links/button/LinkButton';
import {ButtonDefault, ButtonDefaultTypes} from '../../../../shared/ui/buttons/default/ButtonDefault';
import {LabeledCheckbox} from '../../../../shared/ui/inputs/LabeledCheckbox/LabeledCheckbox';
import {InputDefault} from '../../../../shared/ui/inputs/InputDefault/InputDefault';
import {LabelAbove} from '../../../../shared/ui/inputs/LabelAbove/LabelAbove';
import {ErrorLabel} from '../../../../shared/ui/inputs/ErrorLabel/ErrorLabel';
import {Fieldset} from '../../../../shared/ui/Fieldset/Fieldset';

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
  if (!value.trim()) {
    return 'Title is required field for both sides of the Card';
  }

  return undefined;
}

function tagTitleValidator(value: string): string | undefined {
  if (!value.trim()) {
    return 'Title is required for Tag';
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

  const tags = useSelector(selectAllTags());

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
    <MainLayout>
      <header className={'flex gap-3 p-3 bg-gray-50 rounded border items-center'}>
        <LinkButton to={'/'}><ArrowLeft/></LinkButton>
        <h1 className={'text-3xl font-bold'}>Create new cards</h1>
      </header>

      <div className={'flex flex-col gap-3 p-3 bg-gray-50 rounded border'}>
        <Formik
          isInitialValid={false}
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
              <div className={'flex gap-7'}>
                {[{groupName: GroupNames.FrontSide, title: 'Front side'}, {groupName: GroupNames.BackSide, title: 'Back side'}]
                  .map((sideGroupParams, groupIndex) => {
                    const groupName = sideGroupParams.groupName;

                    return (
                      <Fieldset key={groupName} legend={sideGroupParams.title}>
                        <LabelAbove>
                          Title
                          <InputDefault
                            name={`${groupName}.title`}
                            validate={titleValidator}
                            autoFocus={!groupIndex}
                            innerRef={!groupIndex ? firstFieldRef : undefined}
                            errorString={(formState.touched[groupName]?.title && formState.errors[groupName]?.title) || ''}
                          />

                          <ErrorLabel name={`${groupName}.title`}/>
                        </LabelAbove>

                        <LabelAbove>
                          Description
                          <InputDefault name={`${groupName}.description`} as={'textarea'}/>
                        </LabelAbove>

                        <FieldArray
                          name={`${groupName}.hints`}
                          render={(helpers) => {
                            return (
                              <>
                                {formState.values[groupName].hints.map((_value, index) => {
                                  return (
                                    <LabelAbove key={index}>
                                      Hint {index + 1}
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
                      <LabeledCheckbox name={'tags'} value={tag.id} style={{color: tag.color}}>
                        {tag.title}
                      </LabeledCheckbox>
                    </li>
                  ))}
                </ul>

                <LabelAbove>
                  Title for new tag
                  <InputDefault
                    name={'newTagTitle'}
                    onKeyDown={(event: React.KeyboardEvent) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();

                        if (!tagTitleValidator(formState.values.newTagTitle)) {
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
                  disabled={!!tagTitleValidator(formState.values.newTagTitle) || formState.isSubmitting}
                  onClick={() => {createNewTag(formState.values, formState).catch(null);}}
                >
                  Create new Tag
                </ButtonDefault>
              </Fieldset>
            </Form>
          )}
        </Formik>
      </div>
    </MainLayout>
  );
};
