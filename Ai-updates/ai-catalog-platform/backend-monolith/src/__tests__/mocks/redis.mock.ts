export const redisMock = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  flushdb: jest.fn(),
  disconnect: jest.fn(),
  on: jest.fn(),
};

jest.mock('../../config/redis', () => ({
  redis: redisMock,
}));
