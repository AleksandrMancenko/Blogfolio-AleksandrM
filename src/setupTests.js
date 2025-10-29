// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Minimal react-router-dom mocks to avoid resolving real router during unit tests
jest.mock('react-router-dom', () => {
  return {
    Link: ({ children }) => <a>{children}</a>,
    useNavigate: () => jest.fn(),
    MemoryRouter: ({ children }) => <div>{children}</div>,
    BrowserRouter: ({ children }) => <div>{children}</div>,
    Routes: ({ children }) => <div>{children}</div>,
    Route: ({ element }) => element || null,
    Navigate: () => null,
  };
});
