// src/pages/MainPage.tsx
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Book } from "../../endPointTypes/types";
import { useAuth } from "../../hooks/userAuth";
import { startReadingSession, endReadingSession, updateBookProgress } from "../../api/bookTrackingApi";
import KonvaStage from "./Konva/KonvaStage";
import RightHand from "./RightHand";
import ProgressBar from "./ProgressBar";
import { displayPageAtom } from './Konva/konvaAtoms';
import { useAtom } from 'jotai';

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
/*
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
*/
function MainPage() {
    const { accessToken, user } = useAuth();
    const [searchParams] = useSearchParams();
    const bookId = searchParams.get("id");
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [displayPage, setDisplayPage] = useAtom(displayPageAtom);
    const [internalPage, setInternalPage] = useState(1);
    const [lastPosition, setLastPosition] = useState<number>(0);
    
    // Use refs to track the latest values for the cleanup function
    const sessionIdRef = useRef<string | null>(null);
    const accessTokenRef = useRef<string | null>(null);
    
    // Update refs when values change
    useEffect(() => {
        sessionIdRef.current = sessionId;
        accessTokenRef.current = accessToken;
    }, [sessionId, accessToken]);

    // React Query: Fetch book data
    const {
        data: book,
        error,
        isLoading,
    } = useQuery({
        queryFn: () => fetchBook(bookId!, accessToken!),
        queryKey: ["book", bookId],
        enabled: !!accessToken && !!user && !!bookId,
    });
    /*
    // React Query: Mutation for updating the book
    const mutation = useMutation<Book, Error, Partial<Book>, unknown>({
        mutationFn: (updateData) =>
            patchBook(updateData, bookId!, accessToken!),
        onError: (error) => {
            console.error("Error updating book:", error.message);
            // Optionally, display an error message to the user
        },
        onSuccess: (data) => {
            console.log("Book updated successfully:", data);
            queryClient.setQueryData<Book>(["book", bookId], data);
        },
    });

    const debouncedUpdate = useCallback(
        debounce((updatedFields: Partial<Book>) => {
            mutation.mutate(updatedFields);
        }, 500),
        [mutation]
    );
    useEffect(() => {
        if (book && !updated) {
            setArrows(book?.curveElements ?? []);
            setCanvaElements(book?.canvaElements ?? []);
            setHighlights(book?.highlights ?? []);
            setScale(book?.scale ?? 1);
            setOffsetPosition(
                book?.offsetPosition ?? {
                    x: 0,
                    y: 0,
                }
            );
            console.log("bookUpdated", book);
            setUpdated(true);
        }
        console.log("Book data updated:", book);
    }, [book]);

    const hasChanged = (newValue: any, oldValue: any) =>
        !isEqual(newValue, oldValue);

    useEffect(() => {
        if (!bookId || !accessToken || !book) return;

        const updateData: Partial<Book> = {};

        if (hasChanged(arrows, book.curveElements)) {
            updateData.curveElements = arrows;
        }
        if (hasChanged(canvaElements, book.canvaElements)) {
            updateData.canvaElements = canvaElements;
        }
        if (hasChanged(highlights, book.highlights)) {
            updateData.highlights = highlights;
        }
        if (hasChanged(scale, book.scale)) {
            updateData.scale = scale;
        }
        if (hasChanged(offsetPosition, book.offsetPosition)) {
            updateData.offsetPosition = offsetPosition;
        }
        console.log("updateData", updateData);
        if (Object.keys(updateData).length > 0) {
            debouncedUpdate(updateData);
        }

        // Cleanup on unmount
        return () => {
            debouncedUpdate.cancel();
        };
    }, [
        arrows,
        canvaElements,
        highlights,
        scale,
        offsetPosition,
        bookId,
        accessToken,
    ]);
*/
    // Start reading session mutation
    const startSessionMutation = useMutation({
        mutationFn: () => startReadingSession(bookId!, accessToken!),
        onSuccess: (data) => {
            console.log("Reading session started:", data);
            setSessionId(data.id);
            setStartTime(new Date());
        },
        onError: (error) => {
            console.error("Error starting reading session:", error);
        }
    });

    // Add this mutation for updating progress
    const updateProgressMutation = useMutation({
        mutationFn: () => {
            if (!book) return Promise.reject("Book data not available");
            
            // Calculate progress percentage
            const progressPercent = Math.min(Math.max(internalPage / (book.totalPages || 100), 0), 1);
            
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
        }
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
                const progressPercent = Math.min(Math.max(internalPage / (book.totalPages || 100), 0), 1);
                
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
        }
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
        }
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
        }, 20 * 1000); // 20 seconds
        
        return () => clearInterval(updateInterval);
    }, [sessionId, book]);

    // End reading session when component unmounts
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (sessionIdRef.current) {
                // Use synchronous fetch for beforeunload
                const xhr = new XMLHttpRequest();
                xhr.open('POST', `/api/tracking/session/end`, false); // Synchronous request
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Authorization', `Bearer ${accessTokenRef.current}`);
                xhr.send(JSON.stringify({
                    sessionId: sessionIdRef.current,
                    pagesRead: internalPage,
                    lastPosition: lastPosition
                }));
            }
        };

        // Add beforeunload event listener
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        // Regular cleanup function for component unmount
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            
            if (sessionIdRef.current) {
                // Try to end the session when component unmounts
                endSessionMutation.mutate();
            }
        };
    }, []);

    // Add visibility change listener to update session when tab becomes hidden
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden' && sessionIdRef.current) {
                console.log("Page hidden, updating reading session");
                // Use the update mutation to save progress when tab becomes hidden
                updateSessionMutation.mutate();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    // Add a flag to track the source of page changes
    const [navigationSource, setNavigationSource] = useState<'scroll' | 'progressBar'>('scroll');

    // Modify handlePageChange to only update internal state
    const handlePageChange = (page: number, position: number) => {
        if (navigationSource !== 'progressBar') {
            setInternalPage(page);
            setLastPosition(position);
            // Also update the display page for UI consistency
            setDisplayPage(page);
        }
    };

    // Update handleNavigate to directly set display page
    const handleNavigate = (page: number) => {
        setDisplayPage(page);
        if (konvaStageRef.current) {
            konvaStageRef.current.navigateToPage(page);
        }
    };

    // Add a ref to the KonvaStage
    const konvaStageRef = useRef(null);

    // Handle loading and error states
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading book: {error.message}</div>;
    }
    if (!book) {
        return <div>No book found</div>;
    }
    // Extract book elements from the fetched book data
    const bookElements = book.bookElements;
    if (!bookElements) {
        return <div>No book elements found</div>;
    }
    return (
        <div className="flex min-h-screen flex-row w-full bg-zinc-800 text-gray-300 relative">
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
        </div>
    );
}

export default MainPage;
