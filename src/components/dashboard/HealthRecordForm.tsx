// 'use client';

// import { useState, type ReactNode } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { useAuth } from '@/hooks/use-auth';
// import { addHealthRecord } from '@/lib/firebase/firestore';

// import { Button } from '@/components/ui/button';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover';
// import { Calendar } from '@/components/ui/calendar';
// import { cn } from '@/lib/utils';
// import { format } from 'date-fns';
// import { Calendar as CalendarIcon, Loader2, Paperclip } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';

// const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
// const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];

// const formSchema = z.object({
//   type: z.enum(['prescription', 'lab_report', 'allergy', 'note']),
//   title: z.string().min(1, 'Title is required.'),
//   content: z.string().min(1, 'Content is required.'),
//   date: z.date({ required_error: 'A date is required.' }),
//   bloodPressure: z.string().optional(),
//   pulseRate: z.coerce.number().optional(),
//   attachment: z.any()
//     .refine((files) => {
//       // If no files are selected, it's valid
//       if (!files || files.length === 0) return true;
//       // If files are selected, check size
//       return files[0]?.size <= MAX_FILE_SIZE;
//     }, `Max file size is 5MB.`)
//     .refine(
//       (files) => {
//         // If no files are selected, it's valid
//         if (!files || files.length === 0) return true;
//         // If files are selected, check type
//         return ACCEPTED_FILE_TYPES.includes(files[0]?.type);
//       },
//       ".jpg, .png, and .pdf files are accepted."
//     )
//     .optional(),
// });

// interface HealthRecordFormProps {
//   children: ReactNode;
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onSuccess: () => void;
// }

// export function HealthRecordForm({
//   children,
//   open,
//   onOpenChange,
//   onSuccess,
// }: HealthRecordFormProps) {
//   const { user } = useAuth();
//   const { toast } = useToast();
//   const [isLoading, setIsLoading] = useState(false);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       title: '',
//       content: '',
//       date: new Date(),
//       type: 'note',
//       bloodPressure: '',
//       pulseRate: undefined,
//       attachment: undefined,
//     },
//   });

//   const attachmentRef = form.register("attachment");

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     if (!user) {
//       toast({
//         title: 'Error',
//         description: 'You must be logged in to add a record.',
//         variant: 'destructive',
//       });
//       return;
//     }
//     setIsLoading(true);
//     try {
//       // NOTE: File upload is not implemented yet.
//       // The 'attachment' field is present in the form but not processed here.
//       const { attachment, ...recordData } = values;

//       await addHealthRecord(user.uid, recordData);
      
//       toast({
//         title: 'Success',
//         description: 'Health record added successfully.',
//       });
//       form.reset();
//       onSuccess();
//     } catch (error) {
//         console.error(error);
//       toast({
//         title: 'Error',
//         description: 'Failed to add health record.',
//         variant: 'destructive',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogTrigger asChild>{children}</DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Add New Health Record</DialogTitle>
//           <DialogDescription>
//             Fill in the details of your new medical record.
//           </DialogDescription>
//         </DialogHeader>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <FormField
//               control={form.control}
//               name="type"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Record Type</FormLabel>
//                   <Select
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}
//                   >
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select a record type" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectItem value="note">Note</SelectItem>
//                       <SelectItem value="prescription">Prescription</SelectItem>
//                       <SelectItem value="lab_report">Lab Report</SelectItem>
//                       <SelectItem value="allergy">Allergy</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="title"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Title / Diagnosis</FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g., Annual Check-up" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="date"
//               render={({ field }) => (
//                 <FormItem className="flex flex-col">
//                   <FormLabel>Date</FormLabel>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <FormControl>
//                         <Button
//                           variant={'outline'}
//                           className={cn(
//                             'w-full pl-3 text-left font-normal',
//                             !field.value && 'text-muted-foreground'
//                           )}
//                         >
//                           {field.value ? (
//                             format(field.value, 'PPP')
//                           ) : (
//                             <span>Pick a date</span>
//                           )}
//                           <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                         </Button>
//                       </FormControl>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0" align="start">
//                       <Calendar
//                         mode="single"
//                         selected={field.value}
//                         onSelect={field.onChange}
//                         disabled={(date) =>
//                           date > new Date() || date < new Date('1900-01-01')
//                         }
//                         initialFocus
//                       />
//                     </PopoverContent>
//                   </Popover>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//              <div className="grid grid-cols-2 gap-4">
//                 <FormField
//                 control={form.control}
//                 name="bloodPressure"
//                 render={({ field }) => (
//                     <FormItem>
//                     <FormLabel>Blood Pressure</FormLabel>
//                     <FormControl>
//                         <Input placeholder="e.g., 120/80" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                     </FormItem>
//                 )}
//                 />
//                 <FormField
//                 control={form.control}
//                 name="pulseRate"
//                 render={({ field }) => (
//                     <FormItem>
//                     <FormLabel>Pulse Rate</FormLabel>
//                     <FormControl>
//                         <Input type="number" placeholder="e.g., 72" {...field} value={field.value ?? ''} />
//                     </FormControl>
//                     <FormMessage />
//                     </FormItem>
//                 )}
//                 />
//             </div>


//             <FormField
//               control={form.control}
//               name="content"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Details</FormLabel>
//                   <FormControl>
//                     <Textarea
//                       placeholder="e.g., Doctor's notes, medication details, lab results..."
//                       className="resize-none"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//              <FormField
//                 control={form.control}
//                 name="attachment"
//                 render={({ field }) => (
//                     <FormItem>
//                         <FormLabel>Attach File (Optional)</FormLabel>
//                          <FormControl>
//                             <div className="relative">
//                                <Input 
//                                 type="file" 
//                                 className="pl-10"
//                                 {...attachmentRef}
//                                />
//                                <Paperclip className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
//                             </div>
//                         </FormControl>
//                         <FormMessage />
//                     </FormItem>
//                 )}
//             />

//             <DialogFooter>
//               <Button type="submit" disabled={isLoading}>
//                 {isLoading && (
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 )}
//                 Save Record
//               </Button>
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }



'use client';

import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { addHealthRecord } from '@/lib/firebase/firestore';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2, Paperclip } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];

const formSchema = z.object({
  type: z.enum(['prescription', 'lab_report', 'allergy', 'note']),
  title: z.string().min(1, 'Title is required.'),
  content: z.string().min(1, 'Content is required.'),
  date: z.date({ required_error: 'A date is required.' }),
  bloodPressure: z.string().optional(),
  pulseRate: z.coerce.number().optional(),
  attachment: z.any()
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return files[0]?.size <= MAX_FILE_SIZE;
    }, `Max file size is 5MB.`)
    .refine(
      (files) => {
        if (!files || files.length === 0) return true;
        return ACCEPTED_FILE_TYPES.includes(files[0]?.type);
      },
      ".jpg, .png, and .pdf files are accepted."
    )
    .optional(),
});

interface HealthRecordFormProps {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function HealthRecordForm({
  children,
  open,
  onOpenChange,
  onSuccess,
}: HealthRecordFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      date: new Date(),
      type: 'note',
      bloodPressure: '',
      pulseRate: undefined,
      attachment: undefined,
    },
  });

  const attachmentRef = form.register("attachment");

  // 🔹 ADDED: helper function to upload file to local API
  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', user!.uid); // Add user ID for user-specific directory

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData?.error || 'File upload failed');
    }

    return (await res.json()).url; // Returns public URL
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to add a record.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { attachment, ...recordData } = values;

      // 🔹 CHANGED: handle file upload if a file is selected
      let fileUrl: string | undefined = undefined;
      if (attachment && attachment.length > 0) {
        const file = attachment[0]; // single file
        try {
          fileUrl = await uploadFile(file);
        } catch (err: any) {
          toast({
            title: 'File Upload Error',
            description: err.message,
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }
      }

      // 🔹 CHANGED: Save record including uploaded file URL
      await addHealthRecord(user.uid, { ...recordData, attachmentUrl: fileUrl });

      toast({
        title: 'Success',
        description: 'Health record added successfully.',
      });

      form.reset();

      // 🔹 ADDED: clear file input manually
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }

      onSuccess();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to add health record.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Health Record</DialogTitle>
          <DialogDescription>
            Fill in the details of your new medical record.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Record Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Record Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a record type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="note">Note</SelectItem>
                      <SelectItem value="prescription">Prescription</SelectItem>
                      <SelectItem value="lab_report">Lab Report</SelectItem>
                      <SelectItem value="allergy">Allergy</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title / Diagnosis</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Annual Check-up" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Blood Pressure & Pulse Rate */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bloodPressure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Pressure</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 120/80" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pulseRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pulse Rate</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 72" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Content */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Doctor's notes, medication details, lab results..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File Attachment */}
            <FormField
              control={form.control}
              name="attachment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attach File (Optional)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="file"
                        className="pl-10"
                        {...attachmentRef} // unchanged
                      />
                      <Paperclip className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Record
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
