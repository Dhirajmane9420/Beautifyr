import { useEffect, useMemo, useState } from "react";

function getElementValue(target, kind) {
  if (!target) return "";
  if (kind === "image") {
    return target.getAttribute("src") || "";
  }
  return (target.textContent || "").trim();
}

export default function HomeLiveEditor({ isAdmin, onSaveOverride, onUploadImage }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFilePreview, setSelectedFilePreview] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    return () => {
      if (selectedFilePreview) {
        URL.revokeObjectURL(selectedFilePreview);
      }
    };
  }, [selectedFilePreview]);

  const canOpen = isAdmin && isEditMode;

  useEffect(() => {
    const editableNodes = document.querySelectorAll("[data-edit-key]");

    editableNodes.forEach((node) => {
      if (canOpen) {
        node.classList.add("home-edit-highlight");
      } else {
        node.classList.remove("home-edit-highlight");
      }
    });

    return () => {
      editableNodes.forEach((node) => node.classList.remove("home-edit-highlight"));
    };
  }, [canOpen]);

  useEffect(() => {
    if (!canOpen) return undefined;

    const onClick = (event) => {
      const editableNode = event.target.closest("[data-edit-key]");
      if (!editableNode) return;

      event.preventDefault();
      event.stopPropagation();

      const key = editableNode.getAttribute("data-edit-key");
      const kind = editableNode.getAttribute("data-edit-kind") || "text";
      const label = editableNode.getAttribute("data-edit-label") || key;

      setSelected({ key, kind, label });
      setDraft(getElementValue(editableNode, kind));
      setSelectedFile(null);
      setSelectedFilePreview("");
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [canOpen]);

  const panelMessage = useMemo(() => {
    if (!isAdmin) return "";
    if (!isEditMode) return "Edit mode is off";
    if (selected) return `Editing: ${selected.label}`;
    return "Click any highlighted text or image";
  }, [isAdmin, isEditMode, selected]);

  const handleSave = async () => {
    if (!selected) return;

    try {
      setIsSaving(true);
      setNotice("");

      let nextValue = draft;

      if (selected.kind === "image" && selectedFile) {
        nextValue = await onUploadImage(selectedFile);
      }

      await onSaveOverride({
        key: selected.key,
        kind: selected.kind,
        value: nextValue,
      });

      setNotice("Saved");
      setSelected(null);
      setDraft("");
      setSelectedFile(null);
      setSelectedFilePreview("");
    } catch (error) {
      setNotice(error.message || "Failed to save override");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <>
      <div className="fixed bottom-5 right-5 z-[1000] w-[280px] rounded-2xl border border-[#d9c8b3] bg-white/95 p-4 shadow-2xl backdrop-blur">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#3f2d1f]">Home Editor</h3>
          <button
            type="button"
            onClick={() => {
              setIsEditMode((prev) => !prev);
              setSelected(null);
              setDraft("");
              setNotice("");
            }}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              isEditMode ? "bg-[#8b5e3c] text-white" : "bg-[#ece3da] text-[#5c4632]"
            }`}
          >
            {isEditMode ? "ON" : "OFF"}
          </button>
        </div>

        <p className="text-xs text-[#6d5440]">{panelMessage}</p>
        {notice ? <p className="mt-2 text-xs text-[#8b5e3c]">{notice}</p> : null}
      </div>

      {selected ? (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-lg font-semibold text-[#3f2d1f]">Edit {selected.label}</h4>
              <button
                type="button"
                onClick={() => {
                  setSelected(null);
                  setDraft("");
                  setSelectedFile(null);
                  setSelectedFilePreview("");
                }}
                className="text-sm text-[#6d5440]"
              >
                Close
              </button>
            </div>

            {selected.kind === "image" ? (
              <div className="space-y-3">
                <label className="block text-sm text-[#5c4632]">Select image from device</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;

                    if (file.size > 10 * 1024 * 1024) {
                      setNotice("Image must be 10MB or smaller.");
                      return;
                    }

                    setNotice("");
                    setSelectedFile(file);
                    if (selectedFilePreview) {
                      URL.revokeObjectURL(selectedFilePreview);
                    }
                    setSelectedFilePreview(URL.createObjectURL(file));
                  }}
                  className="w-full rounded-xl border border-[#d8c6b2] px-3 py-2 text-sm"
                />
                {selectedFile ? (
                  <p className="text-xs text-[#6d5440]">Selected: {selectedFile.name}</p>
                ) : null}
                {(selectedFilePreview || draft) ? (
                  <img
                    src={selectedFilePreview || draft}
                    alt="Preview"
                    className="h-48 w-full rounded-xl object-cover"
                  />
                ) : null}
              </div>
            ) : (
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                rows={6}
                className="w-full rounded-xl border border-[#d8c6b2] px-3 py-2 text-sm"
              />
            )}

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelected(null);
                  setDraft("");
                  setSelectedFile(null);
                  setSelectedFilePreview("");
                }}
                className="rounded-lg border border-[#d8c6b2] px-4 py-2 text-sm text-[#5c4632]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-lg bg-[#8b5e3c] px-4 py-2 text-sm text-white disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <style>{`
        .home-edit-highlight {
          outline: 2px dashed #8b5e3c;
          outline-offset: 4px;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}
