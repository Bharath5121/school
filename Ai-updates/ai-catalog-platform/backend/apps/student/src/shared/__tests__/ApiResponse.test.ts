import { ApiResponse } from '../response/ApiResponse';

describe('ApiResponse', () => {
  describe('success', () => {
    it('should create a success response with data', () => {
      const data = { id: 1, name: 'Test' };
      const response = ApiResponse.success(data);

      expect(response.success).toBe(true);
      expect(response.message).toBe('Success');
      expect(response.data).toEqual(data);
      expect(response.meta).toBeUndefined();
    });

    it('should accept a custom success message', () => {
      const response = ApiResponse.success(null, 'Created successfully');

      expect(response.success).toBe(true);
      expect(response.message).toBe('Created successfully');
      expect(response.data).toBeNull();
    });

    it('should include meta when provided', () => {
      const meta = { page: 1, limit: 10, total: 50 };
      const response = ApiResponse.success([1, 2, 3], 'Success', meta);

      expect(response.meta).toEqual(meta);
      expect(response.meta?.page).toBe(1);
      expect(response.meta?.limit).toBe(10);
      expect(response.meta?.total).toBe(50);
    });

    it('should not include meta key when meta is not provided', () => {
      const response = ApiResponse.success('data');

      expect(response.meta).toBeUndefined();
    });

    it('should handle various data types', () => {
      expect(ApiResponse.success('string').data).toBe('string');
      expect(ApiResponse.success(42).data).toBe(42);
      expect(ApiResponse.success(true).data).toBe(true);
      expect(ApiResponse.success([1, 2]).data).toEqual([1, 2]);
      expect(ApiResponse.success(null).data).toBeNull();
    });
  });

  describe('error', () => {
    it('should create an error response with message', () => {
      const response = ApiResponse.error('Something went wrong');

      expect(response.success).toBe(false);
      expect(response.message).toBe('Something went wrong');
      expect(response.data).toBeNull();
    });

    it('should always have null data', () => {
      const response = ApiResponse.error('Error');

      expect(response.data).toBeNull();
    });

    it('should not include meta', () => {
      const response = ApiResponse.error('Error');

      expect(response.meta).toBeUndefined();
    });
  });
});
