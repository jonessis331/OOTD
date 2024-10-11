import { renderHook, act } from '@testing-library/react-hooks';
import New from '~/src/app/(tabs)/new'
import { useMockData } from '~/src/utils/config';

// Optional: Mock only the image picker and manipulator if you want to use real/mocked data from your pipeline
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
}));

jest.mock('expo-image-manipulator', () => ({
  manipulateAsync: jest.fn(),
}));

describe('Image Preprocessing Pipeline', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Ensure useMockData is set to true or false depending on your testing needs
    //useMockData = true;

    // Mock ImagePicker and ImageManipulator for consistency in tests
    require('expo-image-picker').launchImageLibraryAsync.mockResolvedValue({
      cancelled: false,
      assets: [{ uri: "https://example.com/test-image.jpg" }],
    });

    require('expo-image-manipulator').manipulateAsync.mockResolvedValue({
      uri: "https://example.com/test-image-800x600.jpg",
    });
  });

  it('should preprocess image and detect items using mock data', async () => {
    const { result } = renderHook(() => New() as any) ;

    // Simulate picking an image
    await act(async () => {
      await result.current.pickImage();
    });

    // Ensure the image and URL are correctly set
    expect(result.current.image).toBe("https://example.com/test-image-800x600.jpg");
    expect(result.current.imageUrl).toBe("https://example.com/test-image-800x600.jpg");

    // Process the detected items
    await act(async () => {
      await result.current.processDetectedItems(result.current.items, result.current.imageUrl);
    });

    // Check if items were enriched correctly
    expect(result.current.items.length).toBeGreaterThan(0);
    expect(result.current.items[0].tags).toBeDefined();
  });
});
