/**
 * The active navigation paths (from -> to)
 */
import { writable } from 'svelte/store';
import type { NavigationPath } from "../types";

export { 
  setNavigationPath, 
  navigationPath,
  redirectUrl,
  loginFormShow,
  isOnPhone
} ;

const navigationPath = writable({
  from: "",
  to: "",
  type: ""
})

const loginFormShow = writable(false)

const redirectUrl = writable('');

function setNavigationPath(path: NavigationPath) {
  navigationPath.set({
    from: normalizePath(path.from),
    to: normalizePath(path.to),
    type: path.type
  }) 
};

function normalizePath(path: string): string {
  return (path || "")
    .replace('/(home)','') 
    .replace('/(grids)', '')
    .replace('/(detail)', '')
    || '/home'; 
}

function createIsPhone() {
  const { subscribe, set, update } = writable(true);

  return {
      subscribe,
      checkDimenssions: () => update((n) => window.innerWidth < 750),
      reset: () => set(true)
  };
}

const isOnPhone = createIsPhone();