import reducer, { logout, setCredentials } from './authSlice';

describe('authSlice', () => {
  it('stores the token and clears it on logout', () => {
    let state = reducer({ token: null }, setCredentials({ token: 'abc' }));
    expect(state.token).toBe('abc');
    expect(localStorage.getItem('school.token')).toBe('abc');
    state = reducer(state, logout());
    expect(state.token).toBeNull();
    expect(localStorage.getItem('school.token')).toBeNull();
  });
});
