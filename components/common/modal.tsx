"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

// Stessa soglia della variante `desktop:` in `app/globals.css`.
const DESKTOP_QUERY = "(width >= 48rem)";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(DESKTOP_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

/** Lato server vale `false`: le modali partono chiuse, quindi non c'è differenza visibile all'idratazione. */
function useIsDesktop() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );
}

const DesktopContext = createContext(false);

/** Bottom sheet su mobile, dialog centrata da desktop. Stessa API di `Drawer`/`Dialog` controllati. */
export function Modal(props: { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode }) {
  const isDesktop = useIsDesktop();
  return (
    <DesktopContext.Provider value={isDesktop}>
      {isDesktop ? <Dialog {...props} /> : <Drawer {...props} />}
    </DesktopContext.Provider>
  );
}

export function ModalTrigger(props: { asChild?: boolean; children: React.ReactNode }) {
  return useContext(DesktopContext) ? <DialogTrigger {...props} /> : <DrawerTrigger {...props} />;
}

export function ModalContent({ children }: { children: React.ReactNode }) {
  if (!useContext(DesktopContext)) return <DrawerContent>{children}</DrawerContent>;
  return (
    <DialogContent showCloseButton={false} className="max-h-[85dvh] gap-0 overflow-y-auto p-0 sm:max-w-md">
      {children}
      <DialogClose asChild>
        <Button variant="ghost" size="icon" className="absolute top-2 right-2" aria-label="Chiudi" title="Chiudi">
          <XIcon aria-hidden />
        </Button>
      </DialogClose>
    </DialogContent>
  );
}

export function ModalHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-0.5 p-4 text-left", className)} {...props} />;
}

export function ModalFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />;
}

export function ModalTitle({ className, ...props }: React.ComponentProps<"h2">) {
  const Title = useContext(DesktopContext) ? DialogTitle : DrawerTitle;
  return <Title className={cn("font-heading text-base font-medium text-foreground", className)} {...props} />;
}

export function ModalDescription(props: React.ComponentProps<"p">) {
  const Description = useContext(DesktopContext) ? DialogDescription : DrawerDescription;
  return <Description {...props} />;
}
