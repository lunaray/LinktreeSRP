import { useState, useEffect } from "react";
import styled from "styled-components";
import pb from "../../hooks/usePocketBase";
import IconPicker from "./IconPicker";
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Check } from "lucide-react";

const EMPTY_FORM = { url: "", name: "", icon_type: "auto", icon_value: "", sort_order: 0, enabled: true };

const LinkFormModal = ({ initial, onSave, onClose }) => {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let record;
      if (initial?.id) {
        record = await pb.collection("links").update(initial.id, form);
      } else {
        record = await pb.collection("links").create(form);
      }
      onSave(record);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <Modal>
        <ModalHeader>
          <h3>{initial?.id ? "Edit Link" : "Add Link"}</h3>
          <CloseBtn onClick={onClose}><X size={18} /></CloseBtn>
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <Field>
            <label>URL *</label>
            <input type="url" value={form.url} onChange={(e) => set("url", e.target.value)} required />
          </Field>
          <Field>
            <label>Display Name *</label>
            <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} required />
          </Field>
          <Field>
            <label>Sort Order</label>
            <input type="number" value={form.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} min={0} style={{ width: "80px" }} />
          </Field>
          <Field>
            <label>Icon</label>
            <IconPicker
              iconType={form.icon_type}
              iconValue={form.icon_value}
              url={form.url}
              onChange={({ iconType, iconValue }) => {
                set("icon_type", iconType);
                set("icon_value", iconValue);
              }}
            />
          </Field>
          <ModalFooter>
            <CancelBtn type="button" onClick={onClose}>Cancel</CancelBtn>
            <SaveBtn type="submit" disabled={saving}>
              <Check size={16} />{saving ? "Saving…" : "Save"}
            </SaveBtn>
          </ModalFooter>
        </form>
      </Modal>
    </Overlay>
  );
};

const LinkEditor = () => {
  const [links, setLinks] = useState([]);
  const [modal, setModal] = useState(null); // null | "new" | link object

  useEffect(() => {
    pb.collection("links").getFullList({ sort: "+sort_order" }).then(setLinks).catch(console.error);
  }, []);

  const handleSave = (record) => {
    setLinks((prev) => {
      const idx = prev.findIndex((l) => l.id === record.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = record;
        return next;
      }
      return [...prev, record];
    });
    setModal(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this link?")) return;
    await pb.collection("links").delete(id);
    setLinks((prev) => prev.filter((l) => l.id !== id));
  };

  const toggleEnabled = async (link) => {
    const updated = await pb.collection("links").update(link.id, { enabled: !link.enabled });
    setLinks((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  };

  return (
    <Section>
      <SectionHeader>
        <h3>Links</h3>
        <AddBtn onClick={() => setModal("new")}><Plus size={16} /> Add Link</AddBtn>
      </SectionHeader>

      {links.length === 0 && <Empty>No links yet. Add one above.</Empty>}

      <LinkTable>
        {links.map((link) => (
          <LinkRow key={link.id} $disabled={!link.enabled}>
            <LinkInfo>
              <LinkName>{link.name}</LinkName>
              <LinkUrl>{link.url}</LinkUrl>
            </LinkInfo>
            <Actions>
              <ActionBtn title={link.enabled ? "Disable" : "Enable"} onClick={() => toggleEnabled(link)}>
                {link.enabled ? <Eye size={16} /> : <EyeOff size={16} />}
              </ActionBtn>
              <ActionBtn title="Edit" onClick={() => setModal(link)}>
                <Pencil size={16} />
              </ActionBtn>
              <ActionBtn $danger title="Delete" onClick={() => handleDelete(link.id)}>
                <Trash2 size={16} />
              </ActionBtn>
            </Actions>
          </LinkRow>
        ))}
      </LinkTable>

      {modal && (
        <LinkFormModal
          initial={modal === "new" ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </Section>
  );
};

export default LinkEditor;

const Section = styled.div`color: #ccc;`;
const SectionHeader = styled.div`display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;
  h3 { color: white; margin: 0; }`;
const AddBtn = styled.button`display: flex; align-items: center; gap: 0.4rem; background: #7c3aed; color: white; border: none; border-radius: 8px; padding: 0.5rem 1rem; cursor: pointer; font-size: 0.9rem;
  &:hover { background: #6d28d9; }`;
const Empty = styled.p`color: #555; text-align: center; padding: 2rem 0;`;
const LinkTable = styled.div`display: flex; flex-direction: column; gap: 0.5rem;`;
const LinkRow = styled.div`display: flex; align-items: center; background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 10px; padding: 0.75rem 1rem; opacity: ${(p) => (p.$disabled ? 0.5 : 1)};`;
const LinkInfo = styled.div`flex: 1; min-width: 0;`;
const LinkName = styled.div`color: white; font-weight: 600; font-size: 0.95rem;`;
const LinkUrl = styled.div`color: #666; font-size: 0.78rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`;
const Actions = styled.div`display: flex; gap: 0.4rem; margin-left: 1rem;`;
const ActionBtn = styled.button`background: #222; border: 1px solid #333; border-radius: 6px; padding: 0.35rem; color: ${(p) => (p.$danger ? "#f87171" : "#aaa")}; cursor: pointer;
  &:hover { background: #2a2a2a; }`;

// Modal styles
const Overlay = styled.div`position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 1rem;`;
const Modal = styled.div`background: #1a1a1a; border: 1px solid #333; border-radius: 12px; width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto;`;
const ModalHeader = styled.div`display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid #2a2a2a;
  h3 { margin: 0; color: white; }`;
const CloseBtn = styled.button`background: none; border: none; color: #888; cursor: pointer; padding: 0.25rem;`;
const Field = styled.div`padding: 0.75rem 1.5rem;
  label { display: block; color: #888; font-size: 0.82rem; margin-bottom: 0.35rem; }
  input[type="text"], input[type="url"] { width: 100%; background: #111; border: 1px solid #444; border-radius: 8px; padding: 0.55rem 0.75rem; color: white; font-size: 0.95rem; outline: none; box-sizing: border-box;
    &:focus { border-color: #7c3aed; } }`;
const ModalFooter = styled.div`display: flex; justify-content: flex-end; gap: 0.75rem; padding: 1rem 1.5rem; border-top: 1px solid #2a2a2a;`;
const CancelBtn = styled.button`background: #222; color: #aaa; border: 1px solid #333; border-radius: 8px; padding: 0.5rem 1rem; cursor: pointer;`;
const SaveBtn = styled.button`display: flex; align-items: center; gap: 0.4rem; background: #7c3aed; color: white; border: none; border-radius: 8px; padding: 0.5rem 1rem; cursor: pointer;
  &:disabled { opacity: 0.6; } &:hover:not(:disabled) { background: #6d28d9; }`;
