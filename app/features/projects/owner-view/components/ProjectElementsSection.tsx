'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Plus, Loader2, Check, DollarSign, Clock, X,
  ListChecks, ShoppingCart, Wrench, Pencil, Save,
  ChevronRight, GripVertical, CornerDownRight,
} from 'lucide-react';
import { ProjectElement, ElementCategory } from '../types';

interface ProjectElementsSectionProps {
  elements: ProjectElement[];
  categories: ElementCategory[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  elementsManager: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
}

function SortableItem({
  id,
  children,
}: {
  id: number;
  children: (dragHandle: React.ReactNode, isDragging: boolean) => React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? 'opacity-50 z-50 relative' : ''}
    >
      {children(
        <button
          {...attributes}
          {...listeners}
          type="button"
          tabIndex={-1}
          className="cursor-grab active:cursor-grabbing p-1 text-white/20 hover:text-white/40 transition-colors flex-shrink-0 touch-none"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>,
        isDragging,
      )}
    </div>
  );
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
    isAddingElement,
    editingElement,
    showElementModal,
    openAddModal,
    openEditModal,
    closeModal,
    showAddCategory,
    setShowAddCategory,
    newCategoryName,
    setNewCategoryName,
    isAddingCategory,
    handleAddCategory,
    handleAddElement,
    handleUpdateElement,
    handleToggleElementDone,
    handleDeleteElement,
    reorderElements,
  } = elementsManager;

  const isEditMode = editingElement !== null;
  const [collapsedParents, setCollapsedParents] = useState<Set<number>>(new Set());
  const toggleCollapsed = (id: number) => {
    setCollapsedParents(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const typeOptions = [
    { value: 'buy' as const, label: t.projectDetail.elements.buy, icon: ShoppingCart, activeColor: 'bg-orange-500/30 border border-orange-500/50 text-orange-300' },
    { value: 'make' as const, label: t.projectDetail.elements.make, icon: Wrench, activeColor: 'bg-purple-500/30 border border-purple-500/50 text-purple-300' },
    { value: 'task' as const, label: t.projectDetail.elements.task, icon: ListChecks, activeColor: 'bg-blue-500/30 border border-blue-500/50 text-blue-300' },
  ];

  const parentElement = !isEditMode && newElementParentId
    ? elements.find(el => el.id === parseInt(newElementParentId))
    : null;

  const handleSubmit = isEditMode ? handleUpdateElement : handleAddElement;

  const modalTitle = isEditMode
    ? "Modifier l'élément"
    : parentElement
      ? t.projectElements.add_sub_element
      : t.projectElements.add_element;

  const sortedParents = [...elements.filter(el => !el.parent_id)]
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

  const getChildren = (parentId: number) =>
    [...elements.filter(el => el.parent_id === parentId)]
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

  const typeIcon = (type: string) => {
    if (type === 'task') return <ListChecks className="w-4 h-4" />;
    if (type === 'make') return <Wrench className="w-4 h-4" />;
    return <ShoppingCart className="w-4 h-4" />;
  };

  const typeColor = (type: string) => {
    if (type === 'task') return 'bg-blue-500/20 text-blue-400';
    if (type === 'make') return 'bg-purple-500/20 text-purple-400';
    return 'bg-orange-500/20 text-orange-400';
  };

  return (
    <div className="space-y-4">
      {/* Add element button */}
      <button
        onClick={() => openAddModal()}
        className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-sm transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        {t.projectElements.add_element}
      </button>

      {/* Elements list */}
      {elements.length === 0 ? (
        <p className="text-white/40 text-center py-8">{t.projectElements.no_elements}</p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(e: DragEndEvent) => {
            const { active, over } = e;
if (over && active.id !== over.id)
              reorderElements(elements, null, Number(active.id), Number(over.id));
          }}
        >
          <SortableContext items={sortedParents.map(el => el.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-1">
              {sortedParents.map(element => {
                const children = getChildren(element.id);
                const hasChildren = children.length > 0;
                const isCollapsed = collapsedParents.has(element.id);

                return (
                  <SortableItem key={element.id} id={element.id}>
                    {(dragHandle) => (
                      <div>
                        {/* Parent row */}
                        <div className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                          element.is_done ? 'bg-green-500/5 border-green-500/20' : 'bg-white/5 border-white/10'
                        }`}>
                          {dragHandle}

                          {hasChildren ? (
                            <button
                              onClick={() => toggleCollapsed(element.id)}
                              className="w-5 h-5 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors flex-shrink-0"
                            >
                              <ChevronRight className={`w-4 h-4 transition-transform ${isCollapsed ? '' : 'rotate-90'}`} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleElementDone(element)}
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                                element.is_done ? 'bg-green-500 border-green-500' : 'border-white/30 hover:border-white/50'
                              }`}
                            >
                              {element.is_done && <Check className="w-3 h-3 text-white" />}
                            </button>
                          )}

                          <div className={`p-1.5 rounded flex-shrink-0 ${typeColor(element.type)}`}>
                            {typeIcon(element.type)}
                          </div>

                          <span className={`flex-1 min-w-0 text-sm ${element.is_done ? 'text-white/50 line-through' : 'text-white'}`}>
                            {element.title}
                          </span>

                          {element.price && !hasChildren && (
                            <span className="text-green-400 text-xs flex items-center gap-0.5 flex-shrink-0">
                              <DollarSign className="w-3 h-3" />{element.price}
                            </span>
                          )}
                          {element.category && (
                            <span className="text-white/40 text-xs bg-white/5 px-2 py-0.5 rounded flex-shrink-0">
                              {element.category.name}
                            </span>
                          )}
                          {element.total_working_time && element.total_working_time !== '0m' && (
                            <span className="text-white/40 text-xs flex items-center gap-0.5 flex-shrink-0">
                              <Clock className="w-3 h-3" />{element.total_working_time}
                            </span>
                          )}
                          <button onClick={() => openEditModal(element)} className="p-1 text-white/25 hover:text-white/60 transition-colors flex-shrink-0">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => openAddModal(element.id)} className="p-1 text-white/25 hover:text-primary transition-colors flex-shrink-0" title={t.projectElements.add_sub_element}>
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeleteElement(element.id)} className="p-1 text-white/25 hover:text-red-400 transition-colors flex-shrink-0">
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Children — hidden when collapsed */}
                        {hasChildren && !isCollapsed && (
                          <div className="ml-6 mt-0.5">
                            {/* Full view with DnD */}
                              <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={(e: DragEndEvent) => {
                                  const { active, over } = e;
                                  if (over && active.id !== over.id)
                                    reorderElements(elements, element.id, Number(active.id), Number(over.id));
                                }}
                              >
                                <SortableContext items={children.map(c => c.id)} strategy={verticalListSortingStrategy}>
                                  <div className="space-y-0.5 py-0.5">
                                    {children.map(child => (
                                      <SortableItem key={child.id} id={child.id}>
                                        {(childDragHandle) => (
                                          <div className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${
                                            child.is_done ? 'bg-green-500/5 border-green-500/20' : 'bg-white/5 border-white/10'
                                          }`}>
                                            <CornerDownRight className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />
                                            {childDragHandle}
                                            <button
                                              onClick={() => handleToggleElementDone(child)}
                                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                                                child.is_done ? 'bg-green-500 border-green-500' : 'border-white/30 hover:border-white/50'
                                              }`}
                                            >
                                              {child.is_done && <Check className="w-2.5 h-2.5 text-white" />}
                                            </button>
                                            <span className={`text-sm flex-1 min-w-0 ${child.is_done ? 'text-white/50 line-through' : 'text-white/80'}`}>
                                              {child.title}
                                            </span>
                                            {child.price && (
                                              <span className="text-green-400 text-xs flex items-center gap-0.5 flex-shrink-0">
                                                <DollarSign className="w-3 h-3" />{child.price}
                                              </span>
                                            )}
                                            {child.category && (
                                              <span className="text-white/40 text-xs bg-white/5 px-2 py-0.5 rounded flex-shrink-0">
                                                {child.category.name}
                                              </span>
                                            )}
                                            <button onClick={() => openEditModal(child)} className="p-1 text-white/25 hover:text-white/60 transition-colors flex-shrink-0">
                                              <Pencil className="w-3 h-3" />
                                            </button>
                                            <button onClick={() => handleDeleteElement(child.id)} className="p-1 text-white/25 hover:text-red-400 transition-colors flex-shrink-0">
                                              <X className="w-3 h-3" />
                                            </button>
                                          </div>
                                        )}
                                      </SortableItem>
                                    ))}
                                  </div>
                                </SortableContext>
                              </DndContext>
                          </div>
                        )}
                      </div>
                    )}
                  </SortableItem>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Create / Edit modal */}
      {showElementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={closeModal} />
          <div className="relative bg-secondary border border-white/10 rounded-2xl p-6 max-w-md w-full space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white font-bold text-lg">{modalTitle}</h3>
                {parentElement && <p className="text-white/50 text-sm mt-0.5">↳ {parentElement.title}</p>}
              </div>
              <button onClick={closeModal} className="p-1.5 text-white/40 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-white/60 text-xs font-medium uppercase tracking-wider mb-2 block">
                {t.projectElements.element_title_placeholder} *
              </label>
              <input
                type="text"
                value={newElementTitle}
                onChange={e => setNewElementTitle(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && !showAddCategory && handleSubmit()}
                placeholder={t.projectElements.element_title_placeholder}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50"
                autoFocus
              />
            </div>

            <div>
              <label className="text-white/60 text-xs font-medium uppercase tracking-wider mb-2 block">Type</label>
              <div className="grid grid-cols-3 gap-2">
                {typeOptions.map(opt => {
                  const Icon = opt.icon;
                  const isActive = newElementType === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setNewElementType(opt.value)}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-all ${
                        isActive ? opt.activeColor : 'bg-white/5 border border-white/10 text-white/50 hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" /><span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-white/60 text-xs font-medium uppercase tracking-wider mb-2 block">
                {t.projectElements.label_category}
              </label>
              <div className="flex gap-2">
                <select
                  value={newElementCategoryId}
                  onChange={e => setNewElementCategoryId(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white"
                >
                  <option value="" className="bg-secondary text-white">{t.projectElements.no_category}</option>
                  {categories.map((cat: ElementCategory) => (
                    <option key={cat.id} value={cat.id} className="bg-secondary text-white">{cat.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => setShowAddCategory(!showAddCategory)}
                  className={`px-3 py-2.5 rounded-xl text-sm transition-colors ${
                    showAddCategory ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 border border-white/10 text-white/50 hover:bg-white/10'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {showAddCategory && (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                    onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && handleAddCategory()}
                    placeholder="Nom de la catégorie"
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-primary/50"
                    autoFocus
                  />
                  <button onClick={handleAddCategory} disabled={isAddingCategory || !newCategoryName.trim()} className="px-3 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm disabled:opacity-50">
                    {isAddingCategory ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Créer'}
                  </button>
                  <button onClick={() => { setShowAddCategory(false); setNewCategoryName(''); }} className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="text-white/60 text-xs font-medium uppercase tracking-wider mb-2 block">
                {t.projectElements.label_price} <span className="text-white/30 normal-case font-normal">(optionnel)</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newElementPrice}
                  onChange={e => setNewElementPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={handleSubmit}
                disabled={isAddingElement || !newElementTitle.trim()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl disabled:opacity-50 transition-colors"
              >
                {isAddingElement ? <Loader2 className="w-4 h-4 animate-spin" /> : isEditMode ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {isEditMode ? 'Enregistrer' : newElementParentId ? t.projectElements.add_sub_element : t.projectElements.add_element}
              </button>
              <button onClick={closeModal} className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
