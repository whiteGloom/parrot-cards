import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button, ButtonTheme } from '../widgets/buttons';
import { ArrowLeft } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { TagsStoreContext, useTagsStore } from '../stores/tagsStore.ts';
import { Formik } from 'formik';
import { inlineFor } from '../utils/inline-for.ts';
import { useCardsStore } from '../stores/cardsStore.ts';
import { InputWrapped } from '../widgets/input/input-wrapped.tsx';
import { InputWrapper } from '../widgets/input/intput-wrapper.tsx';
import { TagPreview } from '../widgets/tags/selectable-tag.tsx';

export const Route = createFileRoute('/create-new-cards')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const tagsStore = useContext(TagsStoreContext);
  const tagsStoreState = useTagsStore();
  const cardsStoreState = useCardsStore();
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set<string>());
  const [newTagTitle, setNewTagTitle] = useState('');
  const [hintsCount, setHintsCount] = useState<[number, number]>([1, 1]);

  useEffect(() => {
    tagsStore?.subscribe((state, prevState) => {
      if (state.tagsIds !== prevState.tagsIds) {
        setSelectedTags(new Set(Array.from(selectedTags).filter(tagId => state.tagsIds.includes(tagId))));
      }
    });
  }, [selectedTags, tagsStore]);

  return (
    <div
      className="flex flex-col min-h-full justify-center items-center bg-gradient-to-tr from-purple-300 to-blue-300 p-3"
    >
      <div className="flex flex-col gap-3 md:min-w-3xl min-w-full">
        <div
          className="flex bg-white p-2 gap-3 border items-center border-gray-200 rounded"
        >
          <Button
            className="self-start"
            theme={ButtonTheme.secondary}
            onClick={() => {
              navigate({
                to: '/',
              }).catch(null);
            }}
          >
            <ArrowLeft />
          </Button>
          <h1 className="text-2xl text-purple-800">Create new cards</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-3">
          <Formik
            onSubmit={(values, helpers) => {
              cardsStoreState.createCard({
                targetLanguageSide: {
                  title: values.targetLanguage.title,
                  description: values.targetLanguage.description,
                  hints: values.targetLanguage.hints!.reduce((stored, hint) => {
                    const trimmed = hint.trim();
                    if (trimmed) {
                      stored.push(trimmed);
                    }
                    return stored;
                  }, [] as string[]),
                },
                knownLanguageSide: {
                  title: values.knownLanguage.title,
                  description: values.knownLanguage.description,
                  hints: values.knownLanguage.hints!.reduce((stored, hint) => {
                    const trimmed = hint.trim();
                    if (trimmed) {
                      stored.push(trimmed);
                    }
                    return stored;
                  }, [] as string[]),
                },
                tags: Array.from(selectedTags),
              });

              setSelectedTags(new Set());
              helpers.resetForm();
            }}
            validate={(values) => {
              const errors: Partial<{
                targetLanguage?: { title: string }
                knownLanguage?: { title: string }
              }> = {};

              if (!values.targetLanguage.title.trim()) {
                errors.targetLanguage = { title: 'Required' };
              }

              if (!values.knownLanguage.title.trim()) {
                errors.knownLanguage = { title: 'Required' };
              }

              return errors;
            }}
            validateOnChange={true}
            initialValues={{
              targetLanguage: {
                title: '',
                description: '',
                hints: [''],
              },
              knownLanguage: {
                title: '',
                description: '',
                hints: [''],
              },
            }}
          >
            {({ values, handleChange, errors, handleSubmit }) => {
              return (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <div
                    className="flex flex-col bg-white p-3 gap-3 justify-center border border-gray-200 rounded"
                  >
                    <h2 className="text-xl text-purple-800">Target language side</h2>
                    <InputWrapped
                      label="Title"
                      isRequired={true}
                      name="targetLanguage.title"
                      value={values.targetLanguage.title}
                      onChange={handleChange}
                      error={errors.targetLanguage?.title}
                      autofocus={true}
                    />
                    <InputWrapper
                      label="Description"
                      isRequired={true}
                      id="targetLanguage.description"
                    >
                      <textarea
                        id="targetLanguage.description"
                        name="targetLanguage.description"
                        value={values.targetLanguage.description}
                        className="border p-1 rounded border-gray-400 shadow bg-white"
                        rows={4}
                        onChange={handleChange}
                      />
                    </InputWrapper>
                    {inlineFor(hintsCount[0], index => (
                      <InputWrapped
                        key={index}
                        label={`Hint ${index + 1}`}
                        isRequired={true}
                        name={`targetLanguage.hints[${index}]`}
                        value={values.targetLanguage.hints[index]}
                        onChange={(event) => {
                          if (hintsCount[0] < index + 2) {
                            setHintsCount([
                              hintsCount[0] + 1,
                              hintsCount[1],
                            ]);
                          }

                          handleChange(event);
                        }}
                      />
                    ))}
                  </div>
                  <div
                    className="flex flex-col bg-white p-3 gap-3 justify-center border border-gray-200 rounded"
                  >
                    <h2 className="text-xl text-purple-800">Known language side</h2>
                    <InputWrapped
                      label="Title"
                      isRequired={true}
                      name="knownLanguage.title"
                      value={values.knownLanguage.title}
                      onChange={handleChange}
                      error={errors.knownLanguage?.title}
                    />
                    <InputWrapper
                      label="Description"
                      isRequired={true}
                      id="knownLanguage.description"
                    >
                      <textarea
                        id="knownLanguage.description"
                        name="knownLanguage.description"
                        value={values.knownLanguage.description}
                        className="border p-1 rounded border-gray-400 shadow bg-white"
                        rows={4}
                        onChange={handleChange}
                      />
                    </InputWrapper>
                    {inlineFor(hintsCount[1], index => (
                      <InputWrapped
                        key={index}
                        label={`Hint ${index + 1}`}
                        isRequired={true}
                        name={`knownLanguage.hints[${index}]`}
                        value={values.knownLanguage.hints[index]}
                        onChange={(event) => {
                          if (hintsCount[1] < index + 2) {
                            setHintsCount([
                              hintsCount[0],
                              hintsCount[1] + 1,
                            ]);
                          }

                          handleChange(event);
                        }}
                      />
                    ))}
                  </div>
                  <Button type="submit">
                    Create new card
                  </Button>
                </form>
              );
            }}
          </Formik>
          <div
            className="bg-white border border-gray-200 rounded relative"
          >
            <div
              className="md:absolute top-0 left-0 md:w-full md:h-full md:overflow-y-auto flex flex-col p-3 gap-3"
            >
              <h2 className="text-xl text-purple-800">Tags</h2>
              <div className="flex flex-col gap-2">
                {tagsStoreState.tagsIds.map((tagId) => {
                  return (
                    <TagPreview
                      tagId={tagId}
                      key={tagId}
                      isSelected={selectedTags.has(tagId)}
                      onSelectedChange={(isSelected) => {
                        const setCopy = new Set(selectedTags);
                        if (isSelected) {
                          setCopy.add(tagId);
                        }
                        else {
                          setCopy.delete(tagId);
                        }
                        setSelectedTags(setCopy);
                      }}
                    />
                  );
                })}
                {!tagsStoreState.tagsIds.length && (
                  <p className="text-gray-600">No tags loaded</p>
                )}
              </div>
              <InputWrapped
                label="New tag"
                name="newTagTitle"
                isRequired={true}
                value={newTagTitle}
                onChange={(value) => {
                  setNewTagTitle(value.target.value);
                }}
              />
              <Button
                theme={ButtonTheme.primary}
                disabled={!newTagTitle.trim()}
                onClick={() => {
                  const tagTitle = newTagTitle.trim();

                  if (!tagTitle) {
                    return;
                  }

                  setNewTagTitle('');

                  let tagId: string;

                  const existingTagWithSameName = tagsStoreState.tagsIds.find((tagId) => {
                    const tag = tagsStoreState.tags[tagId];
                    return tag.title === tagTitle;
                  });

                  if (existingTagWithSameName) {
                    tagId = existingTagWithSameName;
                  }
                  else {
                    tagId = tagsStoreState.createTag({
                      title: tagTitle,
                    }).id;
                  }

                  setSelectedTags(new Set([...selectedTags, tagId]));
                }}
              >
                Create new card
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
