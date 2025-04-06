// src/pages/MainPage.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Book } from "../../endPointTypes/types";
import { useAuth } from "../../hooks/userAuth";
import {
  startReadingSession,
  endReadingSession,
  updateBookProgress,
} from "../../api/bookTrackingApi";
import KonvaStage from "./Konva/KonvaStage";
import RightHand from "./RightHand";
import ProgressBar from "./ProgressBar";
import { displayPageAtom } from "./Konva/konvaAtoms";
import { useAtom, useSetAtom } from "jotai";
import { bookIdAtom, offsetPositionAtom } from "./Konva/konvaAtoms";
import { easeInOutCubic } from "./Notes/utils";
import { Card, CardContent } from "../../components/ui/card";
import { debounce } from "lodash";
import {
  arrowsAtom,
  canvaElementsAtom,
  highlightsAtom,
  scaleAtom,
} from "./Konva/konvaAtoms";
import { isEqual } from "lodash";
import BookSidebar from "./BookSidebar";

export type HighlightRange = {
  startElementId: string;
  startOffset: number;
  endElementId: string;
  endOffset: number;
  highlightedText: string;
  intermediateElementIds?: string[];
  highlightId: string;
};

// Fetch book function
const fetchBook = async (id: string, accessToken: string): Promise<Book> => {
  const { data } = await axios.get(`/api/book/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return data;
};

// Unified update function using PATCH
const patchBook = async (
  updateData: Partial<Book>,
  id: string,
  accessToken: string
): Promise<Book> => {
  const { data } = await axios.patch(`/api/book/${id}`, updateData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log("Updated Book Data:", data);
  return data;
};

function MainPage() {
  const { accessToken, user } = useAuth();
  const [searchParams] = useSearchParams();
  const bookId = searchParams.get("id");

  // Move these definitions to the top, before any useEffects
  const getCanvasStorageKey = useCallback(
    () => `book_${bookId}_canvas_elements`,
    [bookId]
  );
  const getCurveStorageKey = useCallback(
    () => `book_${bookId}_curve_elements`,
    [bookId]
  );
  const prevStateRef = useRef<Partial<Book>>({});

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [displayPage, setDisplayPage] = useAtom(displayPageAtom);
  const [internalPage, setInternalPage] = useState(1);
  const [lastPosition, setLastPosition] = useState<number>(0);
  const [offsetPosition, setOffsetPosition] = useAtom(offsetPositionAtom);
  const [navigateBack, setNavigateBack] = useState(false);
  const offsetPositionRef = useRef(offsetPosition);
  const [updated, setUpdated] = useState(false);
  const queryClient = useQueryClient();
  const [arrows, setArrows] = useAtom(arrowsAtom);
  const [canvaElements, setCanvaElements] = useAtom(canvaElementsAtom);
  const [highlights, setHighlights] = useAtom(highlightsAtom);
  const [scale, setScale] = useAtom(scaleAtom);
  const [loaded, setLoaded] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  useEffect(() => {
    if (offsetPosition.x > 200 / scale || offsetPosition.x < -600 / scale) {
      setNavigateBack(true);
    } else {
      setNavigateBack(false);
    }
  }, [offsetPosition]);

  const setBookID = useSetAtom(bookIdAtom);
  // Use refs to track the latest values for the cleanup function
  const sessionIdRef = useRef<string | null>(null);
  const accessTokenRef = useRef<string | null>(null);

  // Update refs when values change
  useEffect(() => {
    sessionIdRef.current = sessionId;
    accessTokenRef.current = accessToken || null;
  }, [sessionId, accessToken]);

  // React Query: Fetch book data
  const {
    data: book,
    error,
    isLoading,
  } = useQuery({
    queryFn: () => {
      if (bookId) {
        setBookID(bookId!);
      }
      return fetchBook(bookId!, accessToken!);
    },
    queryKey: ["book", bookId],
    enabled: !!accessToken && !!user && !!bookId,
  });
  useEffect(() => {
    console.log("book", book);
    if (book) {
      setLoaded(true);
      setOffsetPosition(book.offsetPosition);
      setArrows(book.curveElements);
      setCanvaElements(book.canvaElements);
      setArrows(book.curveElements);
      setHighlights(book.highlights);
      setScale(1);
    }
  }, [book]);
  const removeUnwantedProperties = (obj, propertiesToRemove) => {
    if (Array.isArray(obj)) {
      return obj.map((item) =>
        removeUnwantedProperties(item, propertiesToRemove)
      );
    } else if (typeof obj === "object" && obj !== null) {
      return Object.keys(obj).reduce((acc, key) => {
        if (!propertiesToRemove.includes(key)) {
          acc[key] = removeUnwantedProperties(obj[key], propertiesToRemove);
        }
        return acc;
      }, {});
    }
    return obj;
  };

  // React Query: Mutation for updating the book
  const mutation = useMutation<Book, Error, Partial<Book>, unknown>({
    mutationFn: (updateData) => patchBook(updateData, bookId!, accessToken!),
    onError: (error) => {
      console.error("Error updating book:", error.message);
      // Optionally, display an error message to the user
    },
    onSuccess: (data) => {
      console.log("Book updated successfully:", data);
      queryClient.setQueryData<Book>(["book", bookId], data);
    },
  });

  // Create debounced functions for saving to local storage
  const debouncedSaveCanvasElements = useCallback(
    debounce((elements, key) => {
      localStorage.setItem(key, JSON.stringify(elements));
      console.log("Saved canvas elements to local storage:", elements.length);
    }, 1000), // 1 second delay
    []
  );

  const debouncedSaveCurveElements = useCallback(
    debounce((elements, key) => {
      localStorage.setItem(key, JSON.stringify(elements));
      console.log("Saved curve elements to local storage:", elements.length);
    }, 1000), // 1 second delay
    []
  );

  // Create a debounced function for database updates
  const debouncedUpdateBookData = useCallback(
    debounce(async (changes: Partial<Book>) => {
      console.log("Debounced update with changes:", changes);
      if (!bookId || !accessToken) return;

      try {
        console.log("Saving changes to server:", changes);
        // Your API call to update the book
        await patchBook(changes, bookId!, accessToken!);

        // Update tracking data if page position changed
        if (changes.currentPage !== undefined) {
          await updateBookProgress(
            bookId!,
            changes.currentPage / (book?.totalPages || 100), // Calculate percentage
            changes.currentPage,
            accessTokenRef.current!
          );
        }
      } catch (error) {
        console.error("Failed to update book data:", error);
        // Optionally show an error notification
      }
    }, 2000), // 2 second delay for server updates
    [bookId, accessToken, book?.totalPages]
  );

  // Load canvas elements from local storage on initial load
  useEffect(() => {
    if (bookId && loaded) {
      // Try to get canvas elements from local storage
      const storedCanvasElements = localStorage.getItem(getCanvasStorageKey());
      if (storedCanvasElements) {
        try {
          const parsedElements = JSON.parse(storedCanvasElements);
          setCanvaElements(parsedElements);
          console.log(
            "Loaded canvas elements from local storage:",
            parsedElements.length
          );
        } catch (error) {
          console.error(
            "Error parsing canvas elements from local storage:",
            error
          );
        }
      }

      // Try to get curve elements from local storage
      const storedCurveElements = localStorage.getItem(getCurveStorageKey());
      if (storedCurveElements) {
        try {
          const parsedElements = JSON.parse(storedCurveElements);
          setArrows(parsedElements);
          console.log(
            "Loaded curve elements from local storage:",
            parsedElements.length
          );
        } catch (error) {
          console.error(
            "Error parsing curve elements from local storage:",
            error
          );
        }
      }
    }
  }, [bookId, loaded, getCanvasStorageKey, getCurveStorageKey]);

  // Save canvas elements to local storage when they change (debounced)
  useEffect(() => {
    if (bookId && loaded && canvaElements) {
      debouncedSaveCanvasElements(canvaElements, getCanvasStorageKey());
    }

    // Cleanup function to ensure pending saves are executed
    return () => {
      debouncedSaveCanvasElements.flush();
    };
  }, [
    canvaElements,
    bookId,
    loaded,
    getCanvasStorageKey,
    debouncedSaveCanvasElements,
  ]);

  // Save curve elements to local storage when they change (debounced)
  useEffect(() => {
    if (bookId && loaded && arrows) {
      debouncedSaveCurveElements(arrows, getCurveStorageKey());
    }

    // Cleanup function to ensure pending saves are executed
    return () => {
      debouncedSaveCurveElements.flush();
    };
  }, [arrows, bookId, loaded, getCurveStorageKey, debouncedSaveCurveElements]);

  // Update the highlights effect to use the debounced function
  useEffect(() => {
    if (!bookId || !accessToken || !book || !loaded) return;

    // Only check highlights changes
    if (!isEqual(highlights, prevStateRef.current.highlights)) {
      const changes: Partial<Book> = {
        highlights,
      };

      console.log("Highlights changed, queueing update:", changes);
      debouncedUpdateBookData(changes);

      // Update the reference
      prevStateRef.current = {
        ...prevStateRef.current,
        highlights,
      };
    }
  }, [highlights, bookId, accessToken, book, loaded, debouncedUpdateBookData]);

  // Update the scale effect to use the debounced function
  useEffect(() => {
    if (!bookId || !accessToken || !book || !loaded) return;

    // Only check scale changes
    if (scale !== prevStateRef.current.scale) {
      const changes: Partial<Book> = {
        scale,
      };

      console.log("Scale changed, queueing update:", changes);
      debouncedUpdateBookData(changes);

      // Update the reference
      prevStateRef.current = {
        ...prevStateRef.current,
        scale,
      };
    }
  }, [scale, bookId, accessToken, book, loaded, debouncedUpdateBookData]);

  // Update the offset position effect to use the debounced function
  useEffect(() => {
    if (!bookId || !accessToken || !book || !loaded) return;

    // Only check offsetPosition changes
    if (!isEqual(offsetPosition, prevStateRef.current.offsetPosition)) {
      const changes: Partial<Book> = {
        offsetPosition: {
          // Use the proper nested update format
          upsert: {
            create: {
              x: offsetPosition.x,
              y: offsetPosition.y,
            },
            update: {
              x: offsetPosition.x,
              y: offsetPosition.y,
            },
          },
        },
      };

      console.log("Offset position changed, queueing update:", changes);
      debouncedUpdateBookData(changes);

      // Update the reference
      prevStateRef.current = {
        ...prevStateRef.current,
        offsetPosition,
      };
    }
  }, [
    offsetPosition,
    bookId,
    accessToken,
    book,
    loaded,
    debouncedUpdateBookData,
  ]);

  // Update the page change effect to use the debounced function
  useEffect(() => {
    if (!bookId || !accessToken || !book || !loaded) return;

    // Only check page changes
    if (internalPage !== prevStateRef.current.currentPage) {
      const changes: Partial<Book> = {
        currentPage: internalPage,
      };

      console.log("Page changed, queueing update:", changes);
      debouncedUpdateBookData(changes);

      // Update the reference
      prevStateRef.current = {
        ...prevStateRef.current,
        currentPage: internalPage,
      };
    }
  }, [
    internalPage,
    bookId,
    accessToken,
    book,
    loaded,
    debouncedUpdateBookData,
  ]);

  // Cleanup all debounced functions on component unmount
  useEffect(() => {
    return () => {
      debouncedSaveCanvasElements.cancel();
      debouncedSaveCurveElements.cancel();
      debouncedUpdateBookData.cancel();
    };
  }, [
    debouncedSaveCanvasElements,
    debouncedSaveCurveElements,
    debouncedUpdateBookData,
  ]);

  const startSessionMutation = useMutation({
    mutationFn: () => startReadingSession(bookId!, accessToken!),
    onSuccess: (data) => {
      console.log("Reading session started:", data);
      setSessionId(data.id);
      setStartTime(new Date());
    },
    onError: (error) => {
      console.error("Error starting reading session:", error);
    },
  });

  // Add this mutation for updating progress
  const updateProgressMutation = useMutation({
    mutationFn: () => {
      if (!book) return Promise.reject("Book data not available");
      console.log("Updating session progress", internalPage, book.totalPages);
      // Calculate progress percentage
      const progressPercent = Math.min(
        Math.max(internalPage / (book.totalPages || 100), 0),
        1
      );

      // Cap pages at the book's total pages
      const pagesRead = Math.min(internalPage, book.totalPages || 1);

      return updateBookProgress(
        bookId!,
        progressPercent,
        pagesRead,
        accessTokenRef.current!
      );
    },
    onSuccess: (data) => {
      console.log("Book progress updated:", data);
    },
    onError: (error) => {
      console.error("Error updating book progress:", error);
    },
  });

  // Modify the endSessionMutation to also update progress
  const endSessionMutation = useMutation({
    mutationFn: async () => {
      if (!sessionIdRef.current) return Promise.reject("No active session");

      // First end the reading session
      const sessionResult = await endReadingSession(
        sessionIdRef.current,
        internalPage,
        lastPosition,
        accessTokenRef.current!
      );

      // Then update the book progress
      if (book) {
        // Calculate progress percentage (0-1)
        const progressPercent = Math.min(
          Math.max(internalPage / (book.totalPages || 100), 0),
          1
        );

        // Cap pages at the book's total pages
        const pagesRead = Math.min(internalPage, book.totalPages || 1);

        await updateBookProgress(
          bookId!,
          progressPercent,
          pagesRead,
          accessTokenRef.current!
        );
      }

      return sessionResult;
    },
    onSuccess: (data) => {
      console.log("Reading session ended and progress updated:", data);
      setSessionId(null);
      setStartTime(null);
    },
    onError: (error) => {
      console.error("Error ending reading session:", error);
    },
  });

  // Update reading session mutation (for periodic updates)
  const updateSessionMutation = useMutation({
    mutationFn: () => {
      if (!sessionIdRef.current) return Promise.reject("No active session");
      return endReadingSession(
        sessionIdRef.current,
        internalPage,
        lastPosition,
        accessTokenRef.current!
      );
    },
    onSuccess: (data) => {
      console.log("Reading session updated:", data);
      // Don't reset the session ID or start time for updates
    },
    onError: (error) => {
      console.error("Error updating reading session:", error);
    },
  });

  // Start reading session when component mounts
  useEffect(() => {
    if (bookId && accessToken && user && !sessionId) {
      startSessionMutation.mutate();
    }
  }, [bookId, accessToken, user]);

  // Also update the periodic updates to include progress
  useEffect(() => {
    if (!sessionId) return;

    const updateInterval = setInterval(() => {
      if (sessionIdRef.current) {
        console.log("Periodic update of reading session");
        updateSessionMutation.mutate();
        updateProgressMutation.mutate(); // Also update progress
      }
    }, 5 * 1000); // 5 seconds

    return () => clearInterval(updateInterval);
  }, [sessionId, book]);

  // End reading session when component unmounts
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (sessionIdRef.current) {
        // Use synchronous fetch for beforeunload
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `/api/tracking/session/end`, false); // Synchronous request
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader(
          "Authorization",
          `Bearer ${accessTokenRef.current}`
        );
        xhr.send(
          JSON.stringify({
            sessionId: sessionIdRef.current,
            pagesRead: internalPage,
            lastPosition: lastPosition,
          })
        );
      }
    };

    // Add beforeunload event listener
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Regular cleanup function for component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);

      if (sessionIdRef.current) {
        // Try to end the session when component unmounts
        endSessionMutation.mutate();
      }
    };
  }, []);

  // Add visibility change listener to update session when tab becomes hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && sessionIdRef.current) {
        console.log("Page hidden, updating reading session");
        // Use the update mutation to save progress when tab becomes hidden
        updateSessionMutation.mutate();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Add a flag to track the source of page changes
  const [navigationSource, setNavigationSource] = useState<
    "scroll" | "progressBar"
  >("scroll");

  // Modify handlePageChange to only update internal state
  const handlePageChange = (page: number, position: number) => {
    console.log("Page changed", page, position);
    if (navigationSource !== "progressBar") {
      setInternalPage(page);
      setLastPosition(position);
      // Also update the display page for UI consistency
      setDisplayPage(page);
    }
  };
  useEffect(() => {
    offsetPositionRef.current = offsetPosition;
  }, [offsetPosition]);

  // Update handleNavigate to directly set display page
  const handleNavigate = (page: number) => {
    setDisplayPage(page);
    if (konvaStageRef.current) {
      konvaStageRef.current.navigateToPage(page);
    }
  };
  const smoothScroll = (targetX: number, targetY: number, duration: number) => {
    const start = performance.now();
    const initialOffset = { ...offsetPositionRef.current };
    const deltaX = targetX - initialOffset.x;
    const deltaY = targetY - initialOffset.y;

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easeInOutCubic(progress);

      setOffsetPosition({
        x: initialOffset.x + deltaX * easeProgress,
        y: initialOffset.y + deltaY * easeProgress,
      });

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };
  const navigateBackToText = () => {
    setScale(1);
    smoothScroll(-200 / scale, offsetPositionRef.current.y / scale, 500);
  };

  // Add a ref to the KonvaStage with proper typing
  const konvaStageRef = useRef<any>(null);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full bg-amber-50 dark:bg-gray-900 items-center justify-center">
        <div className="flex flex-col items-center p-8 rounded-lg">
          <div className="relative w-24 h-24 mb-6">
            {/* Book loading animation */}
            <div className="absolute w-16 h-20 bg-amber-600 rounded-r-md animate-pulse"></div>
            <div className="absolute w-16 h-20 left-8 bg-amber-500 rounded-l-md animate-pulse"></div>
            <div className="absolute top-2 left-4 w-16 h-16 bg-amber-50 dark:bg-gray-800 rounded-md border-2 border-amber-600 animate-spin"></div>
            <div className="absolute bottom-0 w-full flex justify-center">
              <div className="h-1 w-16 bg-amber-600 animate-pulse"></div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-amber-800 dark:text-amber-500 mb-2">
            Loading your book
          </h2>

          <div className="flex space-x-2 mt-4">
            <div
              className="w-3 h-3 rounded-full bg-amber-600 animate-bounce"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="w-3 h-3 rounded-full bg-amber-600 animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-3 h-3 rounded-full bg-amber-600 animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mt-4 text-center max-w-sm">
            Preparing your reading experience. This should only take a moment...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error loading book: {error.message}</div>;
  }
  if (!book) {
    return null;
  }
  // Extract book elements from the fetched book data
  const bookElements = book.bookElements;
  if (!bookElements) {
    return <div>No book elements found</div>;
  }
  return (
    <div className="flex min-h-screen flex-row w-full bg-zinc-800 text-gray-300 relative">
      <BookSidebar
        isCollapsed={sidebarCollapsed}
        toggleCollapse={toggleSidebar}
      />
      <KonvaStage
        ref={konvaStageRef}
        chaptersData={book.chaptersData}
        bookElements={bookElements}
        onPageChange={handlePageChange}
        totalPages={book.totalPages || 0}
      />
      <RightHand
        sessionActive={!!sessionId}
        startTime={startTime}
        currentPage={internalPage}
        totalPages={book.totalPages || 0}
        onEndSession={endSessionMutation.mutate}
      />
      <ProgressBar
        currentPage={displayPage}
        totalPages={book.totalPages || 0}
        onNavigate={handleNavigate}
      />
      {navigateBack && (
        <div className="absolute bottom-32 left-1/2  flex items-center justify-center">
          <button
            className="bg-gray-100 text-black px-4 py-2 rounded-md"
            onClick={navigateBackToText}
          >
            Back to Text
          </button>
        </div>
      )}
    </div>
  );
}

export default MainPage;
