import { Request, Response } from 'express';

export function mockRequest(overrides: Partial<Request> = {}): Request {
  const req = {
    body: {},
    params: {},
    query: {},
    headers: {},
    cookies: {},
    ip: '127.0.0.1',
    user: undefined,
    ...overrides,
  } as unknown as Request;
  return req;
}

export function mockResponse(): Response & { _json: any; _status: number } {
  const res: any = {
    _status: 200,
    _json: null,
    status(code: number) {
      res._status = code;
      return res;
    },
    json(data: any) {
      res._json = data;
      return res;
    },
    cookie: jest.fn().mockReturnThis(),
    clearCookie: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
    write: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
    headersSent: false,
  };
  return res;
}

export function mockNext(): jest.Mock {
  return jest.fn();
}
