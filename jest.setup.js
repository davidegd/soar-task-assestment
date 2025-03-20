// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

if (process.env.CI === "true") {
  jest.mock("next/dist/compiled/next-server/pages.runtime.prod.js", () => ({}), { virtual: true });
}

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: "/",
  }),
  usePathname: () => "/",
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

jest.mock("chart.js", () => ({
  Chart: jest.fn(),
  registerables: [],
  register: jest.fn(),
}));

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
