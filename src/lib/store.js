import { useSyncExternalStore } from 'react';
import { POSTS as DEFAULT_POSTS, PROJECTS as DEFAULT_PROJECTS } from './content';

const KEY = 'ashrafyau_content_v1';

const clone = (x) => JSON.parse(JSON.stringify(x));

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        posts: Array.isArray(parsed.posts) ? parsed.posts : clone(DEFAULT_POSTS),
        projects: Array.isArray(parsed.projects) ? parsed.projects : clone(DEFAULT_PROJECTS),
      };
    }
  } catch (e) {
    console.error('content store load failed', e);
  }
  return { posts: clone(DEFAULT_POSTS), projects: clone(DEFAULT_PROJECTS) };
}

let state = load();
const listeners = new Set();

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    console.error('content store save failed (storage quota?)', e);
    throw e;
  }
  for (const l of listeners) l();
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export const getPosts = () => state.posts;
export const getProjects = () => state.projects;

export function usePosts() {
  return useSyncExternalStore(subscribe, getPosts, getPosts);
}
export function useProjects() {
  return useSyncExternalStore(subscribe, getProjects, getProjects);
}

export function upsertPost(originalSlug, post) {
  const posts = [...state.posts];
  const i = originalSlug ? posts.findIndex((p) => p.slug === originalSlug) : -1;
  if (i >= 0) posts[i] = post;
  else posts.unshift(post);
  state = { ...state, posts };
  persist();
}

export function deletePost(slug) {
  state = { ...state, posts: state.posts.filter((p) => p.slug !== slug) };
  persist();
}

export function upsertProject(originalSlug, project) {
  const projects = [...state.projects];
  const i = originalSlug ? projects.findIndex((p) => p.slug === originalSlug) : -1;
  if (i >= 0) projects[i] = project;
  else projects.unshift(project);
  state = { ...state, projects };
  persist();
}

export function deleteProject(slug) {
  state = { ...state, projects: state.projects.filter((p) => p.slug !== slug) };
  persist();
}

export function move(kind, slug, dir) {
  const list = [...(kind === 'post' ? state.posts : state.projects)];
  const i = list.findIndex((x) => x.slug === slug);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= list.length) return;
  [list[i], list[j]] = [list[j], list[i]];
  state = kind === 'post' ? { ...state, posts: list } : { ...state, projects: list };
  persist();
}

export function slugExists(kind, slug, exceptSlug) {
  const list = kind === 'post' ? state.posts : state.projects;
  return list.some((x) => x.slug === slug && x.slug !== exceptSlug);
}

export function resetAll() {
  state = { posts: clone(DEFAULT_POSTS), projects: clone(DEFAULT_PROJECTS) };
  persist();
}

export function exportData() {
  return JSON.stringify(state, null, 2);
}

export function importData(json) {
  const parsed = typeof json === 'string' ? JSON.parse(json) : json;
  state = {
    posts: Array.isArray(parsed.posts) ? parsed.posts : [],
    projects: Array.isArray(parsed.projects) ? parsed.projects : [],
  };
  persist();
}
