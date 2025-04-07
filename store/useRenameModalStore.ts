import { create } from "zustand";

type RenameModalStoreState = {
  isOpen: boolean;
  initialValues: typeof defaultValues;
  onOpen: (id: string, title: string) => void;
  onClose: () => void;
};

const defaultValues = { id: "", title: "" }; 

export const useRenameModalStore = create<RenameModalStoreState>((set) => ({
  isOpen: false,
  initialValues: defaultValues,
  onOpen: (id, title) =>
    set({
      isOpen: true,
      initialValues: { id, title },
    }),
  onClose: () =>
    set({
      isOpen: false,
      initialValues: defaultValues,
    }),
}));
