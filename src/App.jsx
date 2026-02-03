import { useState, useCallback, useEffect } from 'react';
import { Plus, Trash2, Circle, CheckCircle2 } from 'lucide-react';
import { cn } from './lib/utils';

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = useCallback((e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    setTodos(prev => [...prev, {
      id: Date.now(),
      text: inputValue,
      completed: false,
      createdAt: new Date().toISOString()
    }]);
    setInputValue('');
  }, [inputValue]);

  const toggleTodo = useCallback((id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []);

  const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3b82f6] via-[#8b5cf6] to-[#06b6d4] p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-700">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 drop-shadow-lg">
            할 일 관리
          </h1>
          <p className="text-white/90 text-sm sm:text-base">
            오늘 해야 할 일을 체계적으로 관리하세요
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6 animate-in fade-in slide-in-from-top duration-700 delay-100">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30">
            <div className="text-2xl sm:text-3xl font-bold text-white">{stats.total}</div>
            <div className="text-xs sm:text-sm text-white/90 mt-1">전체</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30">
            <div className="text-2xl sm:text-3xl font-bold text-white">{stats.active}</div>
            <div className="text-xs sm:text-sm text-white/90 mt-1">진행 중</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30">
            <div className="text-2xl sm:text-3xl font-bold text-white">{stats.completed}</div>
            <div className="text-xs sm:text-sm text-white/90 mt-1">완료</div>
          </div>
        </div>

        {/* Input Form */}
        <form 
          onSubmit={addTodo}
          className="mb-6 animate-in fade-in slide-in-from-top duration-700 delay-200"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="새로운 할 일을 입력하세요..."
              className="flex-1 px-4 py-3 rounded-xl bg-white/95 backdrop-blur-sm border-2 border-white/50 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/30 transition-all placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-[#3b82f6] rounded-xl font-semibold hover:bg-white/90 active:scale-95 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">추가</span>
            </button>
          </div>
        </form>

        {/* Filters */}
        <div className="flex gap-2 mb-6 animate-in fade-in slide-in-from-top duration-700 delay-300">
          {[
            { key: 'all', label: '전체' },
            { key: 'active', label: '진행 중' },
            { key: 'completed', label: '완료' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                'flex-1 px-4 py-2 rounded-lg font-medium transition-all',
                filter === key
                  ? 'bg-white text-[#3b82f6] shadow-lg scale-105'
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12 animate-in fade-in duration-500">
              <div className="text-white/60 text-lg">
                {filter === 'active' && '진행 중인 할 일이 없습니다'}
                {filter === 'completed' && '완료된 할 일이 없습니다'}
                {filter === 'all' && '할 일을 추가해보세요'}
              </div>
            </div>
          ) : (
            filteredTodos.map((todo, index) => (
              <div
                key={todo.id}
                className="group bg-white/95 backdrop-blur-sm rounded-xl p-4 border-2 border-white/50 hover:border-white transition-all hover:shadow-xl animate-in fade-in slide-in-from-bottom duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="flex-shrink-0 transition-all active:scale-90"
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-[#06b6d4] animate-in zoom-in duration-200" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400 group-hover:text-[#3b82f6] transition-colors" />
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'text-gray-800 transition-all break-words',
                      todo.completed && 'line-through text-gray-400'
                    )}>
                      {todo.text}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(todo.createdAt).toLocaleString('ko-KR', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 active:scale-90"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {todos.length > 0 && (
          <div className="mt-8 text-center text-white/80 text-sm animate-in fade-in duration-700 delay-500">
            {stats.completed > 0 && (
              <p>
                🎉 {stats.completed}개의 할 일을 완료했습니다!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;