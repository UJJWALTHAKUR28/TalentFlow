import { useState, useEffect } from 'react';
import type { Job } from '../../db/talenshowDb';

interface JobFormProps {
  job?: Job;
  onClose: () => void;
  onSaved: () => void;
}

export default function JobForm({ job, onClose, onSaved }: JobFormProps) {
  const [title, setTitle] = useState(job?.title || '');
  const [status, setStatus] = useState<'active' | 'archived'>(job?.status || 'active');
  const [tags, setTags] = useState<string[]>(job?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Common tag suggestions
  const suggestedTags = [
    'frontend', 'backend', 'fullstack', 'react', 'angular', 'vue', 'nodejs', 'python', 
    'javascript', 'typescript', 'java', 'php', 'ruby', 'go', 'rust', 'swift',
    'mobile', 'ios', 'android', 'flutter', 'react-native',
    'devops', 'aws', 'azure', 'gcp', 'docker', 'kubernetes',
    'senior', 'junior', 'mid-level', 'lead', 'architect',
    'remote', 'onsite', 'hybrid', 'contract', 'full-time', 'part-time'
  ];

  const filteredSuggestions = suggestedTags.filter(
    suggestion => 
      !tags.includes(suggestion) && 
      suggestion.toLowerCase().includes(tagInput.toLowerCase()) &&
      tagInput.length > 0
  );

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput('');
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (tagInput.trim()) {
        addTag(tagInput.trim());
      }
    } else if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const saveJob = async () => {
    const payload = { title, status, tags };

    const url = job ? `/api/jobs/${job.id}` : '/api/jobs';
    const method = job ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      onSaved();
      onClose();
    } else {
      alert(await res.text());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {job ? 'Edit Job' : 'Add New Job'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Job Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              placeholder="Enter job title..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as 'active' | 'archived')}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
            >
              <option value="active"> Active</option>
              <option value="archived"> Archived</option>
            </select>
          </div>

          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tags
            </label>
            
            {/* Selected Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
                >
                  #{tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>

            {/* Tag Input */}
            <div className="relative">
              <input
                type="text"
                value={tagInput}
                onChange={e => {
                  setTagInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onKeyDown={handleTagInputKeyDown}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Type to add tags or select from suggestions..."
              />

              {/* Tag Suggestions */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {filteredSuggestions.slice(0, 8).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => addTag(suggestion)}
                      className="w-full px-4 py-2 text-left hover:bg-blue-50 hover:text-blue-800 transition-colors first:rounded-t-xl last:rounded-b-xl"
                    >
                      #{suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Popular Tags Quick Add */}
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-2">Popular tags:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedTags.filter(tag => !tags.includes(tag)).slice(0, 6).map((tag, index) => (
                  <button
                    key={index}
                    onClick={() => addTag(tag)}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-800 transition-colors"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              Press Enter to add custom tags or click suggestions above
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button
            onClick={saveJob}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-700 hover:to-green-800 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {job ? ' Update Job' : ' Create Job'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}