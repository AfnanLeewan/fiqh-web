import * as React from "react";import * as React from "react";

import { type DialogProps } from "@radix-ui/react-dialog";import { type DialogProps } from "@radix-ui/react-dialog";

import { Search } from "lucide-react";import { Search } from "lucide-react";



import { cn } from "@/lib/utils";import { cn } from "@/lib/utils";

import { Dialog, DialogContent } from "@/components/ui/dialog";import { Dialog, DialogContent } from "@/components/ui/dialog";



// Stub implementation - these components are not currently used// Stub implementation - these components are not currently used

const Command = React.forwardRef<const Command = React.forwardRef<

  HTMLDivElement,  HTMLDivElement,

  React.HTMLAttributes<HTMLDivElement>  React.HTMLAttributes<HTMLDivElement>

>(({ className, ...props }, ref) => (>(({ className, ...props }, ref) => (

  <div  <div

    ref={ref}    ref={ref}

    className={cn(    className={cn(

      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",

      className,      className,

    )}    )}

    {...props}    {...props}

  />  />

));));

Command.displayName = "Command";Command.displayName = "Command";



interface CommandDialogProps extends DialogProps {interface CommandDialogProps extends DialogProps {

  children?: React.ReactNode;  children?: React.ReactNode;

}}



const CommandDialog = ({ children, ...props }: CommandDialogProps) => {const CommandDialog = ({ children, ...props }: CommandDialogProps) => {

  return (  return (

    <Dialog {...props}>    <Dialog {...props}>

      <DialogContent className="overflow-hidden p-0 shadow-lg">      <DialogContent className="overflow-hidden p-0 shadow-lg">

        <Command>        <Command>

          {children}          {children}

        </Command>        </Command>

      </DialogContent>      </DialogContent>

    </Dialog>    </Dialog>

  );  );

};};



const CommandInput = React.forwardRef<const CommandInput = React.forwardRef<

  HTMLInputElement,  HTMLInputElement,

  React.InputHTMLAttributes<HTMLInputElement>  React.InputHTMLAttributes<HTMLInputElement>

>(({ className, ...props }, ref) => (>(({ className, ...props }, ref) => (

  <div className="flex items-center border-b px-3">  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">

    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />

    <input    <input

      ref={ref}      ref={ref}

      className={cn(      className={cn(

        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",

        className,        className,

      )}      )}

      {...props}      {...props}

    />    />

  </div>  </div>

));));

CommandInput.displayName = "CommandInput";CommandInput.displayName = "CommandInput";



const CommandList = React.forwardRef<const CommandList = React.forwardRef<

  HTMLDivElement,  HTMLDivElement,

  React.HTMLAttributes<HTMLDivElement>  React.HTMLAttributes<HTMLDivElement>

>(({ className, ...props }, ref) => (>(({ className, ...props }, ref) => (

  <div  <div

    ref={ref}    ref={ref}

    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}

    {...props}    {...props}

  />  />

));));

CommandList.displayName = "CommandList";CommandList.displayName = "CommandList";



const CommandEmpty = React.forwardRef<const CommandEmpty = React.forwardRef<

  HTMLDivElement,  HTMLDivElement,

  React.HTMLAttributes<HTMLDivElement>  React.HTMLAttributes<HTMLDivElement>

>((props, ref) => (>((props, ref) => (

  <div  <div

    ref={ref}    ref={ref}

    className="py-6 text-center text-sm"    className="py-6 text-center text-sm"

    {...props}    {...props}

  />  />

));));

CommandEmpty.displayName = "CommandEmpty";CommandEmpty.displayName = "CommandEmpty";



const CommandGroup = React.forwardRef<const CommandGroup = React.forwardRef<

  HTMLDivElement,  HTMLDivElement,

  React.HTMLAttributes<HTMLDivElement>  React.HTMLAttributes<HTMLDivElement>

>(({ className, ...props }, ref) => (>(({ className, ...props }, ref) => (

  <div  <div

    ref={ref}    ref={ref}

    className={cn(    className={cn(

      "overflow-hidden p-1 text-foreground",      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",

      className,      className,

    )}    )}

    {...props}    {...props}

  />  />

));));

CommandGroup.displayName = "CommandGroup";CommandGroup.displayName = "CommandGroup";



const CommandSeparator = React.forwardRef<const CommandSeparator = React.forwardRef<

  HTMLDivElement,  HTMLDivElement,

  React.HTMLAttributes<HTMLDivElement>  React.HTMLAttributes<HTMLDivElement>

>(({ className, ...props }, ref) => (>(({ className, ...props }, ref) => (

  <div  <div

    ref={ref}    ref={ref}

    className={cn("-mx-1 h-px bg-border", className)}    className={cn("-mx-1 h-px bg-border", className)}

    {...props}    {...props}

  />  />

));));

CommandSeparator.displayName = "CommandSeparator";CommandSeparator.displayName = "CommandSeparator";



const CommandItem = React.forwardRef<const CommandItem = React.forwardRef<

  HTMLDivElement,  HTMLDivElement,

  React.HTMLAttributes<HTMLDivElement>  React.HTMLAttributes<HTMLDivElement>

>(({ className, ...props }, ref) => (>(({ className, ...props }, ref) => (

  <div  <div

    ref={ref}    ref={ref}

    className={cn(    className={cn(

      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",

      className,      className,

    )}    )}

    {...props}    {...props}

  />  />

));));

CommandItem.displayName = "CommandItem";CommandItem.displayName = "CommandItem";



const CommandShortcut = ({const CommandShortcut = ({

  className,  className,

  ...props  ...props

}: React.HTMLAttributes<HTMLSpanElement>) => {}: React.HTMLAttributes<HTMLSpanElement>) => {

  return (  return (

    <span    <span

      className={cn(      className={cn(

        "ml-auto text-xs tracking-widest text-muted-foreground",        "ml-auto text-xs tracking-widest text-muted-foreground",

        className,        className,

      )}      )}

      {...props}      {...props}

    />    />

  );  );

};};

CommandShortcut.displayName = "CommandShortcut";CommandShortcut.displayName = "CommandShortcut";



export {export {

  Command,  Command,

  CommandDialog,  CommandDialog,

  CommandInput,  CommandInput,

  CommandList,  CommandList,

  CommandEmpty,  CommandEmpty,

  CommandGroup,  CommandGroup,

  CommandItem,  CommandItem,

  CommandShortcut,  CommandShortcut,

  CommandSeparator,  CommandSeparator,

};};

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  </div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
));

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => <CommandPrimitive.Empty ref={ref} className="py-6 text-center text-sm" {...props} />);

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className,
    )}
    {...props}
  />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator ref={ref} className={cn("-mx-1 h-px bg-border", className)} {...props} />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50",
      className,
    )}
    {...props}
  />
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props} />;
};
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
