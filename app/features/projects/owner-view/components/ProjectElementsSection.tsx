'use client';

import { Plus, Loader2, Settings, Check, DollarSign, Clock, X, ListChecks, ShoppingCart, Wrench } from 'lucide-react';
import { ProjectElement, ElementCategory } from '../types';

interface ProjectElementsSectionProps {
  elements: ProjectElement[];
  categories: ElementCategory[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  elementsManager: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
}

export function ProjectElementsSection({
  elements,
  categories,
  elementsManager,
  t,
}: ProjectElementsSectionProps) {
  const {
    newElementTitle,
    setNewElementTitle,
    newElementType,
    setNewElementType,
    newElementPrice,
    setNewElementPrice,
    newElementCategoryId,
    setNewElementCategoryId,
    newElementParentId,
    setNewElementParentId,
    isAddingElement,
    showAdvancedElementForm,
    setShowAdvancedElementForm,
    handleAddElement,
    handleToggleElementDone,
    handleDeleteElement,
    resetForm,
  } = elementsManager;

  return (
    <div className="space-y-4">
      {/* Add element form */}
      <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={newElementTitle}
            onChange={e => setNewElementTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !showAdvancedElementForm && handleAddElement()}
            placeholder={t.projectElements.element_title_placeholder}
            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40"
          />
          <select
            value={newElementType}
            onChange={e => setNewElementType(e.target.value as 'buy' | 'make' | 'task')}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
          >
            <option value="buy" className="bg-secondary">{t.projectDetail.elements.buy}</option>
            <option value="make" className="bg-secondary">{t.projectDetail.elements.make}</option>
            <option value="task" className="bg-secondary">{t.projectDetail.elements.task}</option>
          </select>
          <button
            onClick={() => setShowAdvancedElementForm(!showAdvancedElementForm)}
            className={`px-4 py-2 rounded-lg transition-colors ${showAdvancedElementForm
              ? 'bg-primary/20 text-primary border border-primary/30'
              : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
            }`}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Advanced fields */}
        {showAdvancedElementForm && (
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10">
            <div>
              <label className="text-white/50 text-xs mb-1 block">{t.projectElements.label_price}</label>
              <input
                type="number"
                step="0.01"
                value={newElementPrice}
                onChange={e => setNewElementPrice(e.target.value)}
                placeholder="25.99"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40"
              />
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1 block">{t.projectElements.label_category}</label>
              <select
                value={newElementCategoryId}
                onChange={e => setNewElementCategoryId(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              >
                <option value="" className="bg-secondary">{t.projectElements.no_category}</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id} className="bg-secondary">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1 block">{t.projectElements.label_parent_element}</label>
              <select
                value={newElementParentId}
                onChange={e => setNewElementParentId(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              >
                <option value="" className="bg-secondary">{t.projectElements.no_parent}</option>
                {elements.filter(el => !el.parent_id).map(el => (
                  <option key={el.id} value={el.id} className="bg-secondary">{el.title}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleAddElement}
            disabled={isAddingElement || !newElementTitle.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAddingElement ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {newElementParentId ? t.projectElements.add_sub_element : t.projectElements.add_element}
          </button>
          {(newElementTitle || newElementPrice || newElementCategoryId || newElementParentId) && (
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg"
            >
              {t.projectElements.reset}
            </button>
          )}
        </div>
      </div>

      {/* Elements list */}
      <div className="space-y-2">
        {elements.length === 0 ? (
          <p className="text-white/40 text-center py-8">{t.projectElements.no_elements}</p>
        ) : (
          <>
            {/* Parent elements */}
            {elements.filter(el => !el.parent_id).map(element => (
              <div key={element.id}>
                <div
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${element.is_done ? 'bg-green-500/5 border-green-500/20' : 'bg-white/5 border-white/10'
                  }`}
                >
                  <button
                    onClick={() => handleToggleElementDone(element)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${element.is_done ? 'bg-green-500 border-green-500' : 'border-white/30 hover:border-white/50'
                    }`}
                  >
                    {element.is_done && <Check className="w-4 h-4 text-white" />}
                  </button>
                  <div className={`p-1.5 rounded flex-shrink-0 ${element.type === 'task' ? 'bg-blue-500/20 text-blue-400' :
                    element.type === 'make' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-orange-500/20 text-orange-400'
                  }`}>
                    {element.type === 'task' ? <ListChecks className="w-4 h-4" /> :
                      element.type === 'make' ? <Wrench className="w-4 h-4" /> :
                        <ShoppingCart className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`block ${element.is_done ? 'text-white/50 line-through' : 'text-white'}`}>
                      {element.title}
                    </span>
                  </div>
                  {element.price && elements.filter(child => child.parent_id === element.id).length === 0 && (
                    <span className="text-green-400 text-sm flex items-center gap-1 flex-shrink-0">
                      <DollarSign className="w-3 h-3" />
                      {element.price}
                    </span>
                  )}
                  {element.category && (
                    <span className="text-white/40 text-xs bg-white/5 px-2 py-1 rounded flex-shrink-0">
                      {element.category.name}
                    </span>
                  )}
                  {element.total_working_time && element.total_working_time !== '0m' && (
                    <span className="text-white/40 text-sm flex items-center gap-1 flex-shrink-0">
                      <Clock className="w-3 h-3" />
                      {element.total_working_time}
                    </span>
                  )}
                  <button
                    onClick={() => handleDeleteElement(element.id)}
                    className="p-1 text-white/40 hover:text-red-400 transition-colors flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Child elements */}
                {elements.filter(child => child.parent_id === element.id).length > 0 && (
                  <div className="ml-12 mt-1 space-y-1">
                    {elements.filter(child => child.parent_id === element.id).map(child => (
                      <div
                        key={child.id}
                        className={`flex items-center gap-3 p-2 rounded-lg border transition-colors ${child.is_done ? 'bg-green-500/5 border-green-500/20' : 'bg-white/5 border-white/10'
                        }`}
                      >
                        <button
                          onClick={() => handleToggleElementDone(child)}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${child.is_done ? 'bg-green-500 border-green-500' : 'border-white/30 hover:border-white/50'
                          }`}
                        >
                          {child.is_done && <Check className="w-3 h-3 text-white" />}
                        </button>
                        <span className={`text-sm ${child.is_done ? 'text-white/50 line-through' : 'text-white/80'}`}>
                          {child.title}
                        </span>
                        {child.price && (
                          <span className="text-green-400 text-xs flex items-center gap-1 ml-auto">
                            <DollarSign className="w-3 h-3" />
                            {child.price}
                          </span>
                        )}
                        <button
                          onClick={() => handleDeleteElement(child.id)}
                          className="p-1 text-white/40 hover:text-red-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

