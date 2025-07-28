"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { DatabaseService, type Presentation } from "@/lib/database"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  CheckCircle2Icon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
  MoreVerticalIcon,
  PlusIcon,
  CalendarIcon,
  FileTextIcon,
  LoaderIcon,
  PresentationIcon,
  BookOpenIcon,
  GraduationCapIcon,
  BrainIcon,
  LightbulbIcon,
  TargetIcon,
  TrendingUpIcon,
  StarIcon,
  SparklesIcon,
  RocketIcon,
} from "lucide-react"
import { toast } from "sonner"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Fun colorful icons for presentations
const presentationIcons = [
  { icon: PresentationIcon, color: 'text-blue-500' },
  { icon: BookOpenIcon, color: 'text-green-500' },
  { icon: GraduationCapIcon, color: 'text-purple-500' },
  { icon: BrainIcon, color: 'text-pink-500' },
  { icon: LightbulbIcon, color: 'text-yellow-500' },
  { icon: TargetIcon, color: 'text-red-500' },
  { icon: TrendingUpIcon, color: 'text-indigo-500' },
  { icon: StarIcon, color: 'text-orange-500' },
  { icon: SparklesIcon, color: 'text-cyan-500' },
  { icon: RocketIcon, color: 'text-emerald-500' },
]

// Function to get consistent icon for presentation
const getPresentationIcon = (presentationId: string) => {
  const hash = presentationId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  const index = Math.abs(hash) % presentationIcons.length
  return presentationIcons[index]
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'generating':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'draft':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'error':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

interface ActionsCellProps {
  presentation: Presentation
}

function ActionsCell({ presentation }: ActionsCellProps) {
  const router = useRouter()
  const supabase = createClient()
  const dbService = new DatabaseService(supabase)

  const handleRename = async () => {
    const newTitle = prompt("Enter new presentation title:", presentation.title)
    if (newTitle && newTitle.trim() !== presentation.title) {
      try {
        await dbService.updatePresentation(presentation.id, { title: newTitle.trim() })
        toast.success("Presentation renamed successfully")
        // Refresh the page to show updated title
        window.location.reload()
      } catch (error) {
        console.error('Error renaming presentation:', error)
        toast.error("Failed to rename presentation")
      }
    }
  }

  const handleDuplicate = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: originalSlides } = await supabase
        .from('slides')
        .select('*')
        .eq('presentation_id', presentation.id)
        .order('position', { ascending: true })

      const newPresentation = await dbService.createPresentation({
        prompt: presentation.prompt,
        cardCount: presentation.card_count,
        style: presentation.style,
        themeId: presentation.theme_id,
        userId: user.id
      })
      
      // Update title after creation
      await dbService.updatePresentation(newPresentation.id, { 
        title: `${presentation.title} (Copy)` 
      })

      if (originalSlides && originalSlides.length > 0) {
        await Promise.all(
          originalSlides.map((slide) => 
            dbService.createSlide({
              presentation_id: newPresentation.id,
              title: slide.title,
              content: slide.content,
              bullet_points: slide.bullet_points,
              template_type: slide.template_type,
              position: slide.position,
              image_url: slide.image_url,
              image_prompt: slide.image_prompt,
              is_hidden: slide.is_hidden,
              is_generating: slide.is_generating,
              is_generating_image: slide.is_generating_image,
              images_metadata: slide.images_metadata,
              has_multiple_images: slide.has_multiple_images,
              primary_image_id: slide.primary_image_id
            })
          )
        )
      }

      toast.success("Presentation duplicated successfully")
      router.push(`/docs/${newPresentation.id}`)
    } catch (error) {
      console.error('Error duplicating presentation:', error)
      toast.error("Failed to duplicate presentation")
    }
  }

  const handleSendToTrash = async () => {
    const confirmed = confirm("Are you sure you want to send this presentation to trash?")
    if (confirmed) {
      try {
        await dbService.updatePresentation(presentation.id, { status: 'trashed' as any })
        toast.success("Presentation sent to trash")
        window.location.reload()
      } catch (error) {
        console.error('Error sending to trash:', error)
        toast.error("Failed to send to trash")
      }
    }
  }

  const handleHardDelete = async () => {
    const confirmed = confirm("Are you sure you want to permanently delete this presentation? This action cannot be undone.")
    if (confirmed) {
      try {
        await dbService.deletePresentation(presentation.id)
        toast.success("Presentation permanently deleted")
        window.location.reload()
      } catch (error) {
        console.error('Error deleting presentation:', error)
        toast.error("Failed to delete presentation")
      }
    }
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}/docs/${presentation.id}`
    navigator.clipboard.writeText(url)
    toast.success("Link copied to clipboard")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreVerticalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => router.push(`/docs/${presentation.id}`)}
        >
          Open Presentation
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleRename}>
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink}>
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDuplicate}>
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-destructive" 
          onClick={handleSendToTrash}
        >
          Send to Trash
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="text-destructive font-semibold" 
          onClick={handleHardDelete}
        >
          Delete Permanently
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const columns: ColumnDef<Presentation>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Presentation",
    cell: ({ row }) => {
      const presentation = row.original
      const iconData = getPresentationIcon(presentation.id)
      const IconComponent = iconData.icon
      
      return (
        <div className="flex items-center gap-3">
          <div className="w-10 h-8 bg-gradient-to-br from-primary/10 to-primary/20 rounded flex items-center justify-center">
            <IconComponent className={`w-4 h-4 ${iconData.color}`} />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="font-medium line-clamp-1 max-w-xs md:max-w-sm lg:max-w-md">{presentation.title}</div>
            <div className="text-sm text-muted-foreground line-clamp-1 max-w-xs md:max-w-sm lg:max-w-md">
              {presentation.prompt}
            </div>
          </div>
        </div>
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={`flex gap-1 px-2 py-1 text-xs ${getStatusColor(row.original.status)}`}
      >
        {row.original.status === "completed" && (
          <CheckCircle2Icon className="w-3 h-3" />
        )}
        {row.original.status === "generating" && (
          <LoaderIcon className="w-3 h-3 animate-spin" />
        )}
        <span className="capitalize">{row.original.status}</span>
      </Badge>
    ),
  },
  {
    accessorKey: "style",
    header: "Style",
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.original.style}
      </Badge>
    ),
  },
  {
    accessorKey: "card_count",
    header: "Slides",
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.original.card_count}
      </div>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm">
        <CalendarIcon className="w-3 h-3 text-muted-foreground" />
        {formatDate(row.original.created_at)}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => <ActionsCell presentation={row.original} />,
  },
]

export function DataTable() {
  const [presentations, setPresentations] = useState<Presentation[]>([])
  const [loading, setLoading] = useState(true)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  
  const router = useRouter()
  const supabase = createClient()
  const dbService = new DatabaseService(supabase)

  useEffect(() => {
    fetchUserPresentations()
  }, [])

  const fetchUserPresentations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const userPresentations = await dbService.getUserPresentations(user.id)
      setPresentations(userPresentations)
    } catch (error) {
      console.error('Error fetching presentations:', error)
      toast.error('Failed to load presentations')
    } finally {
      setLoading(false)
    }
  }

  const table = useReactTable({
    data: presentations,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  if (loading) {
    return (
      <div className="space-y-4 px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
          <div className="h-8 w-32 bg-muted rounded animate-pulse"></div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {[...Array(6)].map((_, i) => (
                  <TableHead key={i}>
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(6)].map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-muted rounded animate-pulse"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Filter presentations..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <ColumnsIcon className="mr-2 h-4 w-4" />
                View
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button onClick={() => router.push('/create')} className="ml-4">
          <PlusIcon className="mr-2 h-4 w-4" />
          New Presentation
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer"
                  onClick={() => router.push(`/docs/${row.original.id}`)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FileTextIcon className="h-8 w-8 text-muted-foreground" />
                    <div className="text-muted-foreground">
                      No presentations found.
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => router.push('/create')}
                      className="mt-2"
                    >
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Create your first presentation
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
