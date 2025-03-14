import { useIdeas } from "@/hooks/useIdeas";
import { formatDate } from "@/utils/formatDate";
import { Trash2, Clock } from "lucide-react";

const IdeaList = () => {
  const { 
    filteredIdeas, 
    selectIdea, 
    confirmDelete,
    isSearching
  } = useIdeas();

  return (
    <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-[500px] md:h-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-neutral">My Murmurs</h2>
        <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
          {filteredIdeas.length}
        </span>
      </div>

      <div className="space-y-4">
        {filteredIdeas.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-12 h-12 mx-auto text-gray-300 mb-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
            <p>{isSearching ? 'No murmurs match your search' : 'No murmurs yet. Create your first one!'}</p>
          </div>
        )}

        {filteredIdeas.map((idea, index) => (
          <div
            key={idea.id}
            className={`idea-item ${
              index < filteredIdeas.length - 1 ? 'border-b border-gray-100' : ''
            } pb-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors`}
            onClick={() => selectIdea(idea.id)}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <h3 className="font-medium text-neutral text-base line-clamp-1">
                  {idea.title}
                </h3>
                {idea.hasAudio && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-4 h-4 ml-2 text-primary"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
                    />
                  </svg>
                )}
              </div>
              <button
                className="text-gray-400 hover:text-red-500 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  confirmDelete(idea.id);
                }}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 text-sm line-clamp-2 mt-1">
              {idea.content}
            </p>
            <div className="text-xs text-gray-400 mt-2 flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{formatDate(idea.timestamp)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IdeaList;
