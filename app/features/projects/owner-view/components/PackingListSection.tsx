'use client';

import { Plus, X, Check, ChevronDown, ChevronUp, Loader2, Package, Calendar } from 'lucide-react';
import { PackingList } from '../types';
import { useLocale } from '@/app/lib/locale-context';

interface PackingListSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  packingListManager: any;
}

export function PackingListSection({ packingListManager }: PackingListSectionProps) {
  const { t, locale } = useLocale();
  const {
    packingLists,
    isLoading,
    showAddList,
    setShowAddList,
    newListForm,
    setNewListForm,
    isAddingList,
    handleAddList,
    handleDeleteList,
    addingItemToList,
    setAddingItemToList,
    newItemForm,
    setNewItemForm,
    isAddingItem,
    handleAddItem,
    handleToggleItem,
    handleDeleteItem,
    expandedLists,
    toggleListExpanded,
  } = packingListManager;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header + Add button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-primary" />
          <span className="text-white font-medium">{t.packingList.title}</span>
          <span className="text-white/40 text-sm">({packingLists.length})</span>
        </div>
        <button
          onClick={() => setShowAddList(!showAddList)}
          className="flex items-center gap-2 px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          {t.packingList.add_new_list}
        </button>
      </div>

      {/* Add list form */}
      {showAddList && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
          <input
            type="text"
            value={newListForm.name}
            onChange={e => setNewListForm((prev: typeof newListForm) => ({ ...prev, name: e.target.value }))}
            placeholder={t.packingList.name_placeholder}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 text-sm"
            autoFocus
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={newListForm.description}
              onChange={e => setNewListForm((prev: typeof newListForm) => ({ ...prev, description: e.target.value }))}
              placeholder={t.packingList.description_placeholder}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 text-sm"
            />
            <input
              type="date"
              value={newListForm.due_date}
              onChange={e => setNewListForm((prev: typeof newListForm) => ({ ...prev, due_date: e.target.value }))}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddList}
              disabled={isAddingList || !newListForm.name.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm disabled:opacity-50"
            >
              {isAddingList ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              {t.packingList.create_button}
            </button>
            <button
              onClick={() => { setShowAddList(false); setNewListForm({ name: '', description: '', due_date: '' }); }}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm"
            >
              {t.common.cancel}
            </button>
          </div>
        </div>
      )}

      {/* Lists */}
      {packingLists.length === 0 && !showAddList ? (
        <p className="text-white/40 text-center py-6 text-sm">{t.packingList.no_lists}</p>
      ) : (
        <div className="space-y-3">
          {packingLists.map((list: PackingList) => {
            const isExpanded = expandedLists.has(list.id);
            const packedCount = list.items.filter(i => i.is_packed).length;
            const totalCount = list.items.length;

            return (
              <div key={list.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                {/* List header */}
                <div className="flex items-center gap-3 p-4">
                  <button
                    onClick={() => toggleListExpanded(list.id)}
                    className="flex-1 flex items-center gap-3 text-left"
                  >
                    {isExpanded
                      ? <ChevronUp className="w-4 h-4 text-white/50 flex-shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-white/50 flex-shrink-0" />
                    }
                    <div className="min-w-0">
                      <span className="text-white font-medium block">{list.name}</span>
                      {list.description && (
                        <span className="text-white/50 text-xs">{list.description}</span>
                      )}
                    </div>
                  </button>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {list.due_date && (
                      <span className="flex items-center gap-1 text-white/40 text-xs">
                        <Calendar className="w-3 h-3" />
                        {new Date(list.due_date).toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </span>
                    )}
                    {totalCount > 0 && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${packedCount === totalCount ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/60'}`}>
                        {packedCount}/{totalCount}
                      </span>
                    )}
                    <button
                      onClick={() => handleDeleteList(list.id)}
                      className="p-1 text-white/30 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                {totalCount > 0 && (
                  <div className="h-0.5 bg-white/5">
                    <div
                      className="h-full bg-green-500 transition-all"
                      style={{ width: `${(packedCount / totalCount) * 100}%` }}
                    />
                  </div>
                )}

                {/* Items */}
                {isExpanded && (
                  <div className="p-4 pt-3 space-y-2">
                    {list.items.length === 0 ? (
                      <p className="text-white/30 text-xs text-center py-2">{t.packingList.no_items}</p>
                    ) : (
                      list.items.map(item => (
                        <div key={item.id} className={`flex items-center gap-3 p-2.5 rounded-lg border transition-colors ${item.is_packed ? 'bg-green-500/5 border-green-500/20' : 'bg-white/5 border-white/10'}`}>
                          <button
                            onClick={() => handleToggleItem(list.id, item)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${item.is_packed ? 'bg-green-500 border-green-500' : 'border-white/30 hover:border-white/50'}`}
                          >
                            {item.is_packed && <Check className="w-3 h-3 text-white" />}
                          </button>
                          <span className={`flex-1 text-sm ${item.is_packed ? 'text-white/40 line-through' : 'text-white'}`}>
                            {item.name}
                          </span>
                          {item.quantity > 1 && (
                            <span className="text-white/40 text-xs bg-white/5 px-2 py-0.5 rounded flex-shrink-0">
                              ×{item.quantity}
                            </span>
                          )}
                          {item.category && (
                            <span className="text-white/40 text-xs bg-white/5 px-2 py-0.5 rounded flex-shrink-0">
                              {item.category}
                            </span>
                          )}
                          {item.notes && (
                            <span className="text-white/30 text-xs italic flex-shrink-0 max-w-[120px] truncate" title={item.notes}>
                              {item.notes}
                            </span>
                          )}
                          <button
                            onClick={() => handleDeleteItem(list.id, item.id)}
                            className="p-1 text-white/30 hover:text-red-400 transition-colors flex-shrink-0"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    )}

                    {/* Add item form */}
                    {addingItemToList === list.id ? (
                      <div className="space-y-2 pt-2 border-t border-white/10">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newItemForm.name}
                            onChange={e => setNewItemForm((prev: typeof newItemForm) => ({ ...prev, name: e.target.value }))}
                            placeholder={t.packingList.item_name_placeholder}
                            className="flex-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 text-sm"
                            autoFocus
                          />
                          <input
                            type="number"
                            value={newItemForm.quantity}
                            onChange={e => setNewItemForm((prev: typeof newItemForm) => ({ ...prev, quantity: e.target.value }))}
                            placeholder={t.packingList.quantity_placeholder}
                            min="1"
                            className="w-16 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                          />
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newItemForm.category}
                            onChange={e => setNewItemForm((prev: typeof newItemForm) => ({ ...prev, category: e.target.value }))}
                            placeholder={t.packingList.category_placeholder}
                            className="flex-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 text-sm"
                          />
                          <input
                            type="text"
                            value={newItemForm.notes}
                            onChange={e => setNewItemForm((prev: typeof newItemForm) => ({ ...prev, notes: e.target.value }))}
                            placeholder={t.packingList.notes_placeholder}
                            className="flex-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 text-sm"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddItem(list.id)}
                            disabled={isAddingItem || !newItemForm.name.trim()}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm disabled:opacity-50"
                          >
                            {isAddingItem ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                            {t.common.add}
                          </button>
                          <button
                            onClick={() => { setAddingItemToList(null); setNewItemForm({ name: '', quantity: '1', category: '', notes: '' }); }}
                            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm"
                          >
                            {t.common.cancel}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAddingItemToList(list.id)}
                        className="flex items-center gap-1.5 text-white/50 hover:text-white/80 text-xs transition-colors pt-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        {t.packingList.add_item}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
