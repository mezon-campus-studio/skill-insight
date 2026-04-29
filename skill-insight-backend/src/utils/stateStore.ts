const stateStore = new Map<string, boolean>();

export const saveState = (state: string) => {
  stateStore.set(state, true);
};

export const verifyState = (state: string) => {
  if (!stateStore.has(state)) return false;

  stateStore.delete(state);
  return true;
};
