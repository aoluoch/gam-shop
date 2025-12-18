import { useState } from 'react'
import { format } from 'date-fns'
import {
  Mail,
  MailOpen,
  Reply,
  Archive,
  Trash2,
  MoreHorizontal,
  Eye,
  User,
  Calendar,
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { ContactMessage, ContactMessageStatus } from '@/types/contact'

interface ContactMessagesTableProps {
  messages: ContactMessage[]
  loading: boolean
  onStatusChange: (id: string, status: ContactMessageStatus) => void
  onDelete: (id: string) => void
}

const statusConfig: Record<ContactMessageStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive'; icon: React.ComponentType<{ className?: string }> }> = {
  unread: { label: 'Unread', variant: 'default', icon: Mail },
  read: { label: 'Read', variant: 'secondary', icon: MailOpen },
  replied: { label: 'Replied', variant: 'outline', icon: Reply },
  archived: { label: 'Archived', variant: 'destructive', icon: Archive },
}

export function ContactMessagesTable({
  messages,
  loading,
  onStatusChange,
  onDelete,
}: ContactMessagesTableProps) {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  const handleView = (message: ContactMessage) => {
    setSelectedMessage(message)
    setViewDialogOpen(true)
    if (message.status === 'unread') {
      onStatusChange(message.id, 'read')
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No messages yet</h3>
        <p className="text-muted-foreground">
          Contact form submissions will appear here.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>From</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((message) => {
              const status = statusConfig[message.status]
              const StatusIcon = status.icon
              return (
                <TableRow
                  key={message.id}
                  className={message.status === 'unread' ? 'bg-muted/50 font-medium' : ''}
                >
                  <TableCell>
                    <Badge variant={status.variant} className="gap-1">
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{message.name}</span>
                      <span className="text-sm text-muted-foreground">{message.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="line-clamp-1">{message.subject}</span>
                  </TableCell>
                  <TableCell>
                    {format(new Date(message.createdAt), 'MMM d, yyyy h:mm a')}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(message)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Message
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onStatusChange(message.id, 'unread')}
                          disabled={message.status === 'unread'}
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Mark as Unread
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onStatusChange(message.id, 'read')}
                          disabled={message.status === 'read'}
                        >
                          <MailOpen className="mr-2 h-4 w-4" />
                          Mark as Read
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onStatusChange(message.id, 'replied')}
                          disabled={message.status === 'replied'}
                        >
                          <Reply className="mr-2 h-4 w-4" />
                          Mark as Replied
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onStatusChange(message.id, 'archived')}
                          disabled={message.status === 'archived'}
                        >
                          <Archive className="mr-2 h-4 w-4" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(message.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedMessage.subject}</DialogTitle>
                <DialogDescription>
                  Contact form submission
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{selectedMessage.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-primary hover:underline"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {format(new Date(selectedMessage.createdAt), 'PPpp')}
                    </span>
                  </div>
                </div>
                <div className="border rounded-lg p-4 bg-muted/50">
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <Badge variant={statusConfig[selectedMessage.status].variant}>
                    {statusConfig[selectedMessage.status].label}
                  </Badge>
                  <Button asChild>
                    <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}>
                      <Reply className="mr-2 h-4 w-4" />
                      Reply via Email
                    </a>
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ContactMessagesTable
