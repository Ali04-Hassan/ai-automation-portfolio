import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const PASSCODE = "Aliram3971";

type AdminContextValue = {
  isAdmin: boolean;
  openPasscode: () => void;
  signOut: () => void;
};

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");

  const openPasscode = useCallback(() => {
    if (isAdmin) {
      setIsAdmin(false);
      toast.info("Admin mode disabled");
      return;
    }
    setCode("");
    setOpen(true);
  }, [isAdmin]);

  const signOut = useCallback(() => setIsAdmin(false), []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "a") {
        event.preventDefault();
        openPasscode();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openPasscode]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (code === PASSCODE) {
      setIsAdmin(true);
      setOpen(false);
      toast.success("Admin mode enabled — editing tools unlocked");
    } else {
      toast.error("Incorrect passcode");
    }
    setCode("");
  }

  const value = useMemo(() => ({ isAdmin, openPasscode, signOut }), [isAdmin, openPasscode, signOut]);

  return (
    <AdminContext.Provider value={value}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>Admin access</DialogTitle>
              <DialogDescription>
                Enter the passcode to unlock the editing tools on this portfolio.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="admin-passcode">Passcode</FieldLabel>
                <Input
                  id="admin-passcode"
                  type="password"
                  autoFocus
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="Enter admin passcode"
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={!code.trim()}>
                Unlock
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within an AdminProvider");
  return context;
}
