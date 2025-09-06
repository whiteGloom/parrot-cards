import { createStore, useStore } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createContext, useContext } from 'react';
import type { Tag, TagDraft } from '../entities/tags.ts';
import { uid } from 'uid';

export interface TagsStoreFields {
  tags: Record<string, Tag>
  tagsIds: string[]
}

export interface TagsStoreActions {
  removeTags: (ids: string[]) => void
  createTag: (tag: TagDraft) => Tag
  maybeCreateTag: (tag: TagDraft) => Tag
  addTags: (tag: Tag[]) => void
  updateTag: (id: string, updatedTag: Partial<TagDraft>) => void
}

export interface TagsStoreState extends TagsStoreFields, TagsStoreActions {
}

export function createTagsStore() {
  return createStore<TagsStoreState>()(
    immer((set, getState): TagsStoreState => {
      return {
        tags: {},
        tagsIds: [],
        createTag: (tag: TagDraft) => {
          const newTag: Tag = {
            id: uid(),
            title: tag.title,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            color: tag.color || { angle: Math.round(Math.random() * 360), saturation: 100, lightness: 16 },
          };

          set((state) => {
            state.tags[newTag.id] = newTag;
            state.tagsIds.push(newTag.id);
          });

          return newTag;
        },
        maybeCreateTag: (tag: TagDraft) => {
          const state = getState();
          const tagTitle = tag.title;

          const existingTagWithSameName = state.tagsIds.find((tagId) => {
            const tag = state.tags[tagId];
            return tag.title === tagTitle;
          });

          if (existingTagWithSameName) {
            return state.tags[existingTagWithSameName];
          }
          else {
            return state.createTag({
              title: tagTitle,
            });
          }
        },
        removeTags: (ids: string[]) => {
          set((state) => {
            for (const id of ids) {
              delete state.tags[id];
            }

            const newIds = [];
            for (const id of state.tagsIds) {
              if (!ids.includes(id)) {
                newIds.push(id);
              }
            }

            state.tagsIds = newIds;
          });
        },
        addTags: (cards: Tag[]) => {
          set((state) => {
            for (const card of cards) {
              if (!state.tags[card.id]) {
                state.tags[card.id] = card;
                state.tagsIds.push(card.id);
              }
            }

            state.tagsIds.sort((a, b) => {
              return state.tags[a].updatedAt - state.tags[b].updatedAt;
            });
          });
        },
        updateTag: (id: string, updatedTag: Partial<Tag>) => {
          set((state) => {
            if (state.tags[id]) {
              state.tags[id] = {
                ...state.tags[id],
                ...updatedTag,
                updatedAt: Date.now(),
              };
            }
          });
        },
      };
    }),
  );
}

export type TagsStore = ReturnType<typeof createTagsStore>;

export const TagsStoreContext = createContext<TagsStore | null>(null);

export const useTagsStore = () => {
  const tagsStoreFromContext = useContext(TagsStoreContext);
  return useStore(tagsStoreFromContext!);
};
