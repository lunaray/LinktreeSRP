import { useState, useEffect } from "react";
import styled from "styled-components";
import pb from "../../hooks/usePocketBase";
import { Save, User } from "lucide-react";

const ProfileEditor = () => {
  const [form, setForm] = useState({
    userName: "", photoLink: "", desc: "", about: "", socialLinks: [],
  });
  const [recordId, setRecordId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [socialInput, setSocialInput] = useState("");

  useEffect(() => {
    pb.collection("profile")
      .getFirstListItem("")
      .then((r) => {
        setRecordId(r.id);
        setForm({
          userName: r.userName || "",
          photoLink: r.photoLink || "",
          desc: r.desc || "",
          about: r.about || "",
          socialLinks: r.socialLinks || [],
        });
      })
      .catch(() => {});
  }, []);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const addSocial = () => {
    if (!socialInput.trim()) return;
    setForm((f) => ({ ...f, socialLinks: [...f.socialLinks, socialInput.trim()] }));
    setSocialInput("");
  };

  const removeSocial = (i) =>
    setForm((f) => ({ ...f, socialLinks: f.socialLinks.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (recordId) {
        await pb.collection("profile").update(recordId, form);
      } else {
        const r = await pb.collection("profile").create(form);
        setRecordId(r.id);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Section>
      <SectionHeader>
        <User size={20} />
        <h3>Profile</h3>
      </SectionHeader>
      <form onSubmit={handleSubmit}>
        <Row>
          <Field>
            <label>Display Name</label>
            <input value={form.userName} onChange={(e) => set("userName", e.target.value)} />
          </Field>
          <Field>
            <label>Tagline / Role</label>
            <input value={form.desc} onChange={(e) => set("desc", e.target.value)} />
          </Field>
        </Row>
        <Field>
          <label>Photo URL</label>
          <UrlRow>
            <input
              type="url"
              value={form.photoLink}
              onChange={(e) => set("photoLink", e.target.value)}
              placeholder="https://..."
            />
            {form.photoLink && (
              <Avatar src={form.photoLink} alt="preview" onError={(e) => (e.target.style.display = "none")} />
            )}
          </UrlRow>
        </Field>
        <Field>
          <label>About / Bio</label>
          <textarea
            rows={4}
            value={form.about}
            onChange={(e) => set("about", e.target.value)}
          />
        </Field>
        <Field>
          <label>Social Links (footer icons)</label>
          <AddSocialRow>
            <input
              type="url"
              placeholder="https://twitter.com/you"
              value={socialInput}
              onChange={(e) => setSocialInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSocial())}
            />
            <AddBtn type="button" onClick={addSocial}>Add</AddBtn>
          </AddSocialRow>
          {form.socialLinks.map((link, i) => (
            <SocialTag key={i}>
              <span>{link}</span>
              <RemoveBtn type="button" onClick={() => removeSocial(i)}>×</RemoveBtn>
            </SocialTag>
          ))}
        </Field>
        <SaveBtn type="submit" disabled={saving}>
          <Save size={16} />{saved ? "Saved!" : saving ? "Saving…" : "Save Profile"}
        </SaveBtn>
      </form>
    </Section>
  );
};

export default ProfileEditor;

const Section = styled.div`color: #ccc;`;
const SectionHeader = styled.div`display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1.5rem;
  h3 { color: white; margin: 0; }`;
const Row = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; @media (max-width: 600px) { grid-template-columns: 1fr; }`;
const Field = styled.div`margin-bottom: 1rem;
  label { display: block; color: #888; font-size: 0.82rem; margin-bottom: 0.35rem; }
  input, textarea { width: 100%; background: #111; border: 1px solid #444; border-radius: 8px; padding: 0.55rem 0.75rem; color: white; font-size: 0.9rem; outline: none; box-sizing: border-box; resize: vertical; font-family: inherit;
    &:focus { border-color: #7c3aed; } }`;
const UrlRow = styled.div`display: flex; align-items: center; gap: 0.75rem; input { flex: 1; }`;
const Avatar = styled.img`width: 48px; height: 48px; border-radius: 50%; object-fit: cover; background: #222; flex-shrink: 0;`;
const AddSocialRow = styled.div`display: flex; gap: 0.5rem; margin-bottom: 0.5rem; input { flex: 1; }`;
const AddBtn = styled.button`background: #333; color: #ccc; border: 1px solid #444; border-radius: 6px; padding: 0.5rem 0.75rem; cursor: pointer;`;
const SocialTag = styled.div`display: inline-flex; align-items: center; gap: 0.4rem; background: #1e1e1e; border: 1px solid #333; border-radius: 6px; padding: 0.25rem 0.6rem; margin: 0.25rem; font-size: 0.82rem;`;
const RemoveBtn = styled.button`background: none; border: none; color: #888; cursor: pointer; font-size: 1rem; padding: 0;`;
const SaveBtn = styled.button`display: flex; align-items: center; gap: 0.5rem; background: #7c3aed; color: white; border: none; border-radius: 8px; padding: 0.6rem 1.25rem; cursor: pointer; font-size: 0.9rem; margin-top: 0.5rem;
  &:disabled { opacity: 0.6; } &:hover:not(:disabled) { background: #6d28d9; }`;
