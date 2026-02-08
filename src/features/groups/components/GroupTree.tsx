import { ChevronRight, Folder, FolderOpen, Star, Trash2 } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { useGroupsStore } from '@/features/groups/store/groupsStore'
import type { KdbxGroup } from '@/shared/types/kdbx.types'

interface GroupNodeProps {
  group: KdbxGroup
  depth: number
}

function GroupNode({ group, depth }: GroupNodeProps) {
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
            <GroupNode key={child.id} group={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export function GroupTree() {
  const groups = useGroupsStore((s) => s.groups)
  const selectGroup = useGroupsStore((s) => s.selectGroup)
  const selectedGroupId = useGroupsStore((s) => s.selectedGroupId)

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-foreground-muted))]">
          Gruppen
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto px-1">
        {groups.map((group) => (
          <GroupNode key={group.id} group={group} depth={0} />
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
    </div>
  )
}
