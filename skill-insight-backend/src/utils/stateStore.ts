const stateStore = new Set<string>();

export const saveState = (state: string) => {
  stateStore.add(state);
};

export const verifyState = (state: string) => {
  if (!stateStore.has(state)) return false;
  stateStore.delete(state);
  return true;
};
