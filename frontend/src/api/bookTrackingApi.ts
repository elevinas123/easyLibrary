import axios from "axios";

// Start a reading session
export const startReadingSession = async (bookId: string, accessToken: string) => {
  const { data } = await axios.post(
    `/api/tracking/session/start`,
    { bookId },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return data;
};

// End a reading session
export const endReadingSession = async (
  sessionId: string,
  pagesRead: number,
  lastPosition: number,
  accessToken: string
) => {
  const { data } = await axios.post(
    `/api/tracking/session/end`,
    { sessionId, pagesRead, lastPosition },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return data;
};

// Get book progress
export const getBookProgress = async (bookId: string, accessToken: string) => {
  const { data } = await axios.get(`/api/tracking/progress/book/${bookId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return data;
};

// Update book progress
export const updateBookProgress = async (
  bookId: string,
  percentComplete: number,
  currentPage: number,
  accessToken: string
): Promise<any> => {
  const response = await fetch(`/api/tracking/progress/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      bookId,
      percentComplete,
      currentPage
    })
  });
  
  if (!response.ok) {
    throw new Error('Failed to update book progress');
  }
  
  return response.json();
}; 