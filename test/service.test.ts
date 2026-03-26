// Mock the repository module
jest.mock('../src/api/v1/repositories/firestoreRepository');

// Mock the Firebase configuration to avoid actual database calls
jest.mock('../config/firebaseConfig', () => {
  const getMock = jest.fn().mockResolvedValue({ size: 5 });
  const collectionMock = jest.fn(() => ({ get: getMock }));

  return {
    db: {
      collection: collectionMock,
    },
  };
});


import * as postService from '../src/api/v1/services/eventPostService';
import * as firestoreRepository from '../src/api/v1/repositories/firestoreRepository';
import { EventCategory, EventStatus } from '../src/api/v1/models/eventPostModel';



describe('Post Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Post Service - CreatePost', () => {
    // test case # 1
    it('should create a new post successfully', async () => {
      // Arrange
      const mockInput = {
        name: "Test Event",
        capacity: 100,
        registrationCount: 0,
        date: new Date(),
        status: "active" as EventStatus,
        category: "conference" as EventCategory
      };

      const mockRepositoryResponse = {
        id: "evt_000006"


      };

      (firestoreRepository.createEventDocument as jest.Mock).mockResolvedValue(mockRepositoryResponse);

      // Act
      const result = await postService.createEventPost(mockInput);

      // Assert
      expect(firestoreRepository.createEventDocument).toHaveBeenCalledWith("posts", expect.objectContaining({
        id: expect.any(String),
        ...mockInput
      }));

      expect(result).toEqual({
        id: expect.any(String),
        name: mockInput.name,
        capacity: mockInput.capacity,
        registrationCount: mockInput.registrationCount,
        date: mockInput.date,
        status: mockInput.status,
        category: mockInput.category,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });

      (firestoreRepository.createEventDocument as jest.Mock)
        .mockResolvedValue("evt_000006");
    });
  });

  // test case # 2
  describe('Post Service - GetAllPosts', () => {

    it('should retrieve the list of all posts successfully', async () => {
      // Arrange
      const mockRepositoryResponse = [{
        // response should be an array containing all post documents from firestore
        id: "evt_000001"
        ,
        name: "Test Event",
        capacity: 100,
        registrationCount: 0,
        date: new Date(),
        status: "active" as EventStatus,
        category: "conference" as EventCategory,
        createdAt: new Date(),
        updatedAt: new Date()
      }];


      (firestoreRepository.getAllEventDocuments as jest.Mock).mockResolvedValue(mockRepositoryResponse);

      // Act
      const result = await postService.getAllEventPosts();

      // Assert - call firestore repository function with the collection name
      expect(firestoreRepository.getAllEventDocuments).toHaveBeenCalledWith("posts");

      // expected eresults should be an array matching with the mockRepositoryResponse
      expect(result).toEqual(mockRepositoryResponse);
    });
  });
});