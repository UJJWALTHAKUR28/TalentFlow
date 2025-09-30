import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import JobForm from '../components/Jobs/JobForm';

interface Job {
  id: number;
  title: string;
  slug: string;
  status: 'active' | 'archived';
  tags: string[];
  order: number;
}

export default function JobListPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]); 
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [draggedJob, setDraggedJob] = useState<Job | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const dragCounter = useRef(0);


  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tagsFilter, setTagsFilter] = useState('');
  const [sortField, setSortField] = useState('order'); 
  useEffect(() => {
    loadJobs();
}, []);

  const loadJobs = async () => {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('pageSize', '5');
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      if (tagsFilter) params.append('tags', tagsFilter);
      if (sortField) params.append('sort', sortField);

      const pageRes = await fetch(`/api/jobs?${params.toString()}`);
      const pageData = await pageRes.json();
      setJobs(pageData.data);
      setTotalPages(Math.ceil(pageData.total / 5));

      const allRes = await fetch(`/api/jobs?page=1&pageSize=1000&sort=${sortField}`);
      const allData = await allRes.json();
      setAllJobs(allData.data);
    } catch (error) {
      console.error('Failed to load jobs:', error);
      setJobs([]);  
        setAllJobs([]);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [page, search, statusFilter, tagsFilter, sortField]); 

  const smoothReorder = async (draggedJob: Job, targetIndex: number) => {
  if (isReordering) return;
  setIsReordering(true);

  try {
    const newOrder = targetIndex + 1;
    const updatedJobs = allJobs
      .map(job => {
        if (job.id === draggedJob.id) {
          return { ...job, order: newOrder };
        }
        if (draggedJob.order < newOrder) {
          if (job.order > draggedJob.order && job.order <= newOrder) {
            return { ...job, order: job.order - 1 };
          }
        } else {
          if (job.order >= newOrder && job.order < draggedJob.order) {
            return { ...job, order: job.order + 1 };
          }
        }
        return job;
      })
      .sort((a, b) => a.order - b.order);

    setAllJobs(updatedJobs);

    const startIndex = (page - 1) * 5;
    setJobs(updatedJobs.slice(startIndex, startIndex + 5));


    const res = await fetch(`/api/jobs/reorder/smooth`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        updates: updatedJobs.map(job => ({ id: job.id, order: job.order })),
      }),
    });

    if (!res.ok) throw new Error('Failed to reorder');
  } catch (error) {
    console.error('Reorder failed:', error);
    loadJobs();
  } finally {
    setIsReordering(false);
  }
};


  const handleDragStart = (e: React.DragEvent, job: Job) => {
    setDraggedJob(job);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
    if (typeof e.dataTransfer.setDragImage === 'function') {
      const dragElement = e.currentTarget as HTMLElement;
      dragElement.style.opacity = '0.5';
      setTimeout(() => {
        dragElement.style.opacity = '1';
      }, 0);
    }
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragCounter.current++;
    setDragOverIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    dragCounter.current = 0;
    setDragOverIndex(null);
    if (draggedJob) {
      const globalTargetIndex = (page - 1) * 5 + targetIndex;
      smoothReorder(draggedJob, globalTargetIndex);
    }
    setDraggedJob(null);
  };

  const handleDragEnd = () => {
    setDraggedJob(null);
    setDragOverIndex(null);
    dragCounter.current = 0;
  };

  const handleListDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedJob) {
      const targetIndex = (page - 1) * 5 + jobs.length;
      smoothReorder(draggedJob, targetIndex);
    }
    setDraggedJob(null);
    setDragOverIndex(null);
  };

  const quickReorder = async (job: Job, direction: 'up' | 'down') => {
    const currentIndex = allJobs.findIndex(j => j.id === job.id);
    let targetIndex;
    if (direction === 'up') targetIndex = currentIndex > 0 ? currentIndex - 1 : allJobs.length - 1;
    else targetIndex = currentIndex < allJobs.length - 1 ? currentIndex + 1 : 0;
    await smoothReorder(job, targetIndex);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-green-50 p-6">
      <div className="max-w-6xl mx-auto">
   
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Jobs</h1>
              <p className="text-green-600">
               Manage your job postings and track applications • Page {page} of {totalPages}
              </p>
            </div>
            <button
              onClick={() => {
                setEditingJob(null);
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add New Job</span>
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="archived">Archive</option>
            </select>
            <input
              type="text"
              placeholder="Filter by tags (comma-separated)..."
              value={tagsFilter}
              onChange={(e) => setTagsFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />


            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="order">Sort by Order</option>
              <option value="title">Sort by Title</option>
              <option value="id">Sort by ID</option>
            </select>
          </div>
        </div>


        {isReordering && (
          <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span>Reordering...</span>
          </div>
        )}


        <div
          className="space-y-3 mb-8 min-h-[400px]"
          onDragOver={handleDragOver}
          onDrop={handleListDrop}
        >
          {jobs.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600">Try adjusting your filters or search term</p>
            </div>
          ) : (
            jobs.map((job, index) => (
              <div key={job.id} className="relative">
                {dragOverIndex === index && draggedJob?.id !== job.id && (
                  <div className="h-2 bg-blue-500 rounded-full mx-4 mb-2 shadow-lg animate-pulse"></div>
                )}
                <div
                  draggable={!isReordering}
                  onDragStart={(e) => handleDragStart(e, job)}
                  onDragEnter={(e) => handleDragEnter(e, index)}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`bg-white rounded-2xl shadow-md border-2 overflow-hidden group ${
                    draggedJob?.id === job.id
                      ? 'opacity-60 scale-105 rotate-1 shadow-2xl z-10 cursor-grabbing'
                      : isReordering
                      ? 'cursor-wait'
                      : 'border-gray-100 hover:border-gray-200 hover:shadow-lg cursor-grab active:cursor-grabbing'
                  }`}
                >
                  <div className="p-10 flex justify-between items-center">
                    <div>
                      <Link
                        to={`/jobs/${job.id}`}
                        className="text-2xl font-bold mb-3 text-gray-900 hover:text-blue-600"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {job.title}
                      </Link>
                      <span  className={`px-2 py-1 ml-3 rounded-full text-xs font-medium     ${job.status === 'active' 
      ? 'bg-green-50 text-green-700' 
      : 'bg-red-50 text-red-700'}`}
>
  {job.status === 'active' ? 'Active' : 'Archived'}
</span>
                      <div className="text-sm text-gray-500">{job.slug}</div>
                      <div className="flex gap-2 mt-2">
                        {job.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

              
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          quickReorder(job, 'up');
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600"
                      >
                        ↑
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          quickReorder(job, 'down');
                        }}
                        className="p-2 text-gray-400 hover:text-orange-600"
                      >
                        ↓
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingJob(job);
                          setShowForm(true);
                        }}
                        className="p-2 text-green-600"
                      >
                        ✎
                      </button>
                      <Link to={`/jobs/${job.id}`} className="p-2 text-purple-600">
                        👁
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

 
        <div className="flex justify-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-green-100 rounded-lg">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>


      {showForm && (
        <JobForm job={editingJob ?? undefined} onClose={() => setShowForm(false)} onSaved={loadJobs} />
      )}
    </div>
  );
}
