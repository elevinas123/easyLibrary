import { Note } from "../types";
import {
  ArrowLeftRight,
  Book,
  StickyNote,
  Image,
  ArrowRight,
  Clock,
  ChevronDown,
  List,
} from "lucide-react";
import { cn } from "../../../../lib/utils";
import { Button } from "../../../../components/ui/button";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { motion } from "framer-motion";
import { NoteActions } from "./NoteActions";
import {
  getConnectionLabel,
  getConnectionTypeColor,
  truncateText,
} from "../utils";

type CardViewProps = {
  notes: Note[];
  isDarkMode: boolean;
  expandedNote: string | null;
  setExpandedNote: (id: string | null) => void;
  handleNoteClick: (note: Note) => void;
};

export const CardView = ({
  notes,
  isDarkMode,
  expandedNote,
  setExpandedNote,
  handleNoteClick,
}: CardViewProps) => {
  // Get appropriate icon for element type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "BookText":
        return <Book className="h-4 w-4" />;
      case "StickyNote":
        return <StickyNote className="h-4 w-4" />;
      case "Image":
        return <Image className="h-4 w-4" />;
      default:
        return <Book className="h-4 w-4" />;
    }
  };

  // Get additional type-specific info based on element type
  const getTypeSpecificInfo = (type: string) => {
    switch (type) {
      case "BookText":
        return <span className="text-xs opacity-80">Book Content</span>;
      case "StickyNote":
        return <span className="text-xs opacity-80">Personal Note</span>;
      case "Image":
        return <span className="text-xs opacity-80">Visual Element</span>;
      default:
        return null;
    }
  };

  // Get a different truncation length based on expanded state
  const getTruncatedText = (text: string, noteId: string) => {
    return expandedNote === noteId ? text : truncateText(text);
  };
  return (
    <ScrollArea className="h-full pb-4">
      <div className="p-3 space-y-3 w-72">
        {notes.map((note) => (
          <motion.div
            key={note.arrowId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className={cn(
                "rounded-lg overflow-hidden  border shadow-sm transition-all duration-300",
                expandedNote === note.arrowId ? "shadow-md" : "",
                isDarkMode ? "border-gray-700" : "border-gray-200"
              )}
            >
              {/* Card header with gradient background */}
              <div
                className={cn(
                  "p-3 flex items-center justify-between bg-gradient-to-r",
                  getConnectionTypeColor(
                    note.startType,
                    note.endType,
                    isDarkMode
                  )
                )}
              >
                <div className="flex items-center gap-1.5">
                  <ArrowLeftRight className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">
                    {getConnectionLabel(note.startType, note.endType)}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {note.createdAt && (
                    <span className="text-xs opacity-80 mr-1">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  )}

                  <div className="flex">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full opacity-70 hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedNote(
                          expandedNote === note.arrowId ? null : note.arrowId
                        );
                      }}
                    >
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform",
                          expandedNote === note.arrowId
                            ? "transform rotate-180"
                            : ""
                        )}
                      />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Card content */}
              <div
                className={cn(
                  "transition-all duration-300 p-3",

                  isDarkMode ? "bg-gray-800" : "bg-white"
                )}
                onClick={() => handleNoteClick(note)}
              >
                <div className="flex flex-col space-y-3">
                  {/* Start element (from) */}
                  <div className="flex items-start gap-2">
                    <div
                      className={cn(
                        "p-1.5 rounded-md mt-0.5",
                        isDarkMode ? "bg-gray-700" : "bg-gray-100"
                      )}
                    >
                      {getTypeIcon(note.startType)}
                    </div>
                    <div className="flex-1 text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <p
                          className={cn(
                            "text-xs font-medium",
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          )}
                        >
                          From: {note.startType}
                        </p>
                        {getTypeSpecificInfo(note.startType)}
                      </div>
                      <p className="break-words">
                        {getTruncatedText(
                          note.startText || note.text || "",
                          note.arrowId
                        )}
                      </p>

                      {/* Type-specific content for BookText */}
                      {expandedNote === note.arrowId &&
                        note.startType === "BookText" && (
                          <div
                            className={cn(
                              "mt-2 p-1.5 text-xs rounded",
                              isDarkMode
                                ? "bg-emerald-900/20 text-emerald-300"
                                : "bg-emerald-50 text-emerald-700"
                            )}
                          >
                            <div className="flex items-center gap-1 mb-1 font-medium">
                              <List className="h-3 w-3" />
                              <span>Context</span>
                            </div>
                            <p className="opacity-80">Part of book content</p>
                          </div>
                        )}

                      {/* Type-specific content for StickyNote */}
                      {expandedNote === note.arrowId &&
                        note.startType === "StickyNote" && (
                          <div
                            className={cn(
                              "mt-2 p-1.5 text-xs rounded",
                              isDarkMode
                                ? "bg-amber-900/20 text-amber-300"
                                : "bg-amber-50 text-amber-700"
                            )}
                          >
                            <div className="flex items-center gap-1 mb-1 font-medium">
                              <StickyNote className="h-3 w-3" />
                              <span>User Note</span>
                            </div>
                            <p className="opacity-80">
                              Your personal annotation
                            </p>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* End element (to) */}
                  <div className="flex items-start gap-2">
                    <div
                      className={cn(
                        "p-1.5 rounded-md mt-0.5",
                        isDarkMode ? "bg-gray-700" : "bg-gray-100"
                      )}
                    >
                      {getTypeIcon(note.endType)}
                    </div>
                    <div className="flex-1 text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <p
                          className={cn(
                            "text-xs font-medium",
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          )}
                        >
                          To: {note.endType}
                        </p>
                        {getTypeSpecificInfo(note.endType)}
                      </div>
                      <p className="break-words">
                        {getTruncatedText(
                          note.endText || note.text || "",
                          note.arrowId
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  );
};
