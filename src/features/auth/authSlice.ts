import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const STORAGE_KEY = 'school.token';

function readToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

type AuthState = { token: string | null };

const slice = createSlice({
  name: 'auth',
  initialState: (): AuthState => ({ token: readToken() }),
  reducers: {
    setCredentials(state, action: PayloadAction<{ token: string }>) {
      state.token = action.payload.token;
      try {
        localStorage.setItem(STORAGE_KEY, action.payload.token);
      } catch {
        /* storage may be unavailable */
      }
    },
    logout(state) {
      state.token = null;
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* storage may be unavailable */
      }
    },
  },
});

export const { setCredentials, logout } = slice.actions;
export default slice.reducer;
