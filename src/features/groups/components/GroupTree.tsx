import { useState, useRef, useEffect } from 'react'
import { ChevronRight, Folder, FolderOpen, Star, Trash2, Plus, Pencil, Trash, FolderPlus } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { useGroupsStore } from '@/features/groups/store/groupsStore'
import type { KdbxGroup } from '@/shared/types/kdbx.types'

interface ContextMenuState {
  x: number
  y: number
  group: KdbxGroup
}

interface GroupNodeProps {
  group: KdbxGroup
  depth: number
  onContextMenu: (e: React.MouseEvent, group: KdbxGroup) => void
}

function GroupNode({ group, depth, onContextMenu }: GroupNodeProps) {
  const selectedGroupId = useGroupsStore((s) => s.selectedGroupId)
  const expandedGroupIds = useGroupsStore((s) => s.expandedGroupIds)
  const selectGroup = useGroupsStore((s) => s.selectGroup)
  const toggleGroupExpanded = useGroupsStore((s) => s.toggleGroupExpanded)

  const isSelected = selectedGroupId === group.id
  const isExpanded = expandedGroupIds.has(group.id)
  const hasChildren = group.children.length > 0

  return (
    <div>
      <button
        className={cn(
          'flex items-center gap-1.5 w-full px-2 py-1.5 text-sm rounded-md transition-colors text-left',
          'hover:bg-[rgb(var(--color-accent))]',
          isSelected && 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)] dark:bg-[var(--color-primary-950)] dark:text-[var(--color-primary-300)]'
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => selectGroup(group.id)}
        onContextMenu={(e) => onContextMenu(e, group)}
      >
        {hasChildren ? (
          <ChevronRight
            className={cn(
              'h-3.5 w-3.5 shrink-0 transition-transform',
              isExpanded && 'rotate-90'
            )}
            onClick={(e) => {
              e.stopPropagation()
              toggleGroupExpanded(group.id)
            }}
          />
        ) : (
          <span className="w-3.5" />
        )}
        {isExpanded ? (
          <FolderOpen className="h-4 w-4 shrink-0 text-[var(--color-primary-500)]" />
        ) : (
          <Folder className="h-4 w-4 shrink-0 text-[rgb(var(--color-foreground-muted))]" />
        )}
        <span className="truncate flex-1">{group.name}</span>
        {group.entryCount > 0 && (
          <span className="text-xs text-[rgb(var(--color-foreground-muted))]">
            {group.entryCount}
          </span>
        )}
      </button>
      {isExpanded && hasChildren && (
        <div>
          {group.children.map((child) => (
            <GroupNode key={child.id} group={child} depth={depth + 1} onContextMenu={onContextMenu} />
          ))}
        </div>
      )}
    </div>
  )
}

function ContextMenu({ x, y, group, onCreateSubgroup, onRename, onDelete, onClose }: {
  x: number
  y: number
  group: KdbxGroup
  onCreateSubgroup: (group: KdbxGroup) => void
  onRename: (group: KdbxGroup) => void
  onDelete: (group: KdbxGroup) => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  return (
    <div
      ref={ref}
      className="fixed z-50 bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] rounded-lg shadow-lg py-1 min-w-[160px]"
      style={{ left: x, top: y }}
    >
      <button
        className="flex items-center gap-2 w-full px-3 py-1.5 text-sm hover:bg-[rgb(var(--color-accent))] transition-colors"
        onClick={() => { onCreateSubgroup(group); onClose() }}
      >
        <FolderPlus className="h-3.5 w-3.5" />
        Untergruppe erstellen
      </button>
      <button
        className="flex items-center gap-2 w-full px-3 py-1.5 text-sm hover:bg-[rgb(var(--color-accent))] transition-colors"
        onClick={() => { onRename(group); onClose() }}
      >
        <Pencil className="h-3.5 w-3.5" />
        Umbenennen
      </button>
      <div className="border-t border-[rgb(var(--color-border))] my-1" />
      <button
        className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        onClick={() => { onDelete(group); onClose() }}
      >
        <Trash className="h-3.5 w-3.5" />
        Löschen
      </button>
    </div>
  )
}

interface GroupTreeProps {
  onCreateGroup?: (parentId?: string) => void
  onRenameGroup?: (group: KdbxGroup) => void
  onDeleteGroup?: (group: KdbxGroup) => void
}

export function GroupTree({ onCreateGroup, onRenameGroup, onDeleteGroup }: GroupTreeProps) {
  const groups = useGroupsStore((s) => s.groups)
  const selectGroup = useGroupsStore((s) => s.selectGroup)
  const selectedGroupId = useGroupsStore((s) => s.selectedGroupId)
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)

  const handleContextMenu = (e: React.MouseEvent, group: KdbxGroup) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, group })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-foreground-muted))]">
          Gruppen
        </h2>
        {onCreateGroup && (
          <button
            className="h-5 w-5 flex items-center justify-center rounded hover:bg-[rgb(var(--color-accent))] transition-colors"
            onClick={() => onCreateGroup()}
            title="Neue Gruppe"
          >
            <Plus className="h-3.5 w-3.5 text-[rgb(var(--color-foreground-muted))]" />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-1">
        {groups.map((group) => (
          <GroupNode key={group.id} group={group} depth={0} onContextMenu={handleContextMenu} />
        ))}
      </div>

      <div className="border-t border-[rgb(var(--color-border))] px-1 py-2 space-y-0.5">
        <button
          className={cn(
            'flex items-center gap-2 w-full px-3 py-1.5 text-sm rounded-md transition-colors',
            'hover:bg-[rgb(var(--color-accent))]',
            selectedGroupId === '__favorites' && 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)]'
          )}
          onClick={() => selectGroup('__favorites')}
        >
          <Star className="h-4 w-4 text-yellow-500" />
          <span>Favoriten</span>
        </button>
        <button
          className={cn(
            'flex items-center gap-2 w-full px-3 py-1.5 text-sm rounded-md transition-colors',
            'hover:bg-[rgb(var(--color-accent))]',
            selectedGroupId === '__trash' && 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)]'
          )}
          onClick={() => selectGroup('__trash')}
        >
          <Trash2 className="h-4 w-4 text-[rgb(var(--color-foreground-muted))]" />
          <span>Papierkorb</span>
        </button>
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          group={contextMenu.group}
          onCreateSubgroup={(g) => onCreateGroup?.(g.id)}
          onRename={(g) => onRenameGroup?.(g)}
          onDelete={(g) => onDeleteGroup?.(g)}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  )
}
