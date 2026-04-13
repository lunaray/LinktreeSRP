import { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import pb from "../../hooks/usePocketBase";
import themeContext from "../../state/context/themeContext";
import { Save, Palette, Moon, Sun } from "lucide-react";

const GOOGLE_FONTS = [
  "Inter", "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins",
  "Raleway", "Nunito", "Source Code Pro", "Playfair Display", "DM Sans",
];

const TOKEN_LABELS = [
  { key: "backgroundColor", label: "Background" },
  { key: "cardBackgroundColor", label: "Card Background" },
  { key: "headerFontColor", label: "Header Text" },
  { key: "CardtextColor", label: "Card Text" },
  { key: "onHoverBackgroundColor", label: "Hover Background" },
  { key: "onHoverTextColor", label: "Hover Text" },
  { key: "accentColor", label: "Accent" },
  { key: "footerColor", label: "Footer Text" },
  { key: "footerSocialLinkColor", label: "Footer Icon BG" },
];

const ThemeEditor = () => {
  const { themeData, updateThemeData, DEFAULT_THEME } = useContext(themeContext);
  const [localTheme, setLocalTheme] = useState(themeData);
  const [recordId, setRecordId] = useState(null);
  const [previewMode, setPreviewMode] = useState("dark");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setLocalTheme(themeData); }, [themeData]);

  useEffect(() => {
    pb.collection("theme")
      .getFirstListItem("")
      .then((r) => setRecordId(r.id))
      .catch(() => {});
  }, []);

  const setColor = (mode, key, val) => {
    setLocalTheme((t) => ({
      ...t,
      [mode]: { ...t[mode], [key]: val },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { data: localTheme };
      let record;
      if (recordId) {
        record = await pb.collection("theme").update(recordId, payload);
      } else {
        record = await pb.collection("theme").create(payload);
        setRecordId(record.id);
      }
      updateThemeData(localTheme);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const previewTheme = localTheme[previewMode] || {};

  return (
    <Section>
      <SectionHeader>
        <Palette size={20} />
        <h3>Theme</h3>
        <PreviewToggle>
          <ModeBtn $active={previewMode === "dark"} onClick={() => setPreviewMode("dark")}><Moon size={14} />Dark</ModeBtn>
          <ModeBtn $active={previewMode === "light"} onClick={() => setPreviewMode("light")}><Sun size={14} />Light</ModeBtn>
        </PreviewToggle>
      </SectionHeader>

      <EditorGrid>
        <EditorPanel>
          <PanelTitle><Moon size={14} />Dark Mode Colors</PanelTitle>
          {TOKEN_LABELS.map(({ key, label }) => (
            <ColorRow key={key}>
              <ColorLabel>{label}</ColorLabel>
              <ColorInput
                type="color"
                value={toHex(localTheme.dark?.[key]) || "#000000"}
                onChange={(e) => setColor("dark", key, e.target.value)}
              />
              <HexInput
                type="text"
                value={localTheme.dark?.[key] || ""}
                onChange={(e) => setColor("dark", key, e.target.value)}
              />
            </ColorRow>
          ))}
          <BorderRow>
            <ColorLabel>Border Radius</ColorLabel>
            <RangeInput
              type="range" min={0} max={30} step={1}
              value={parseInt(localTheme.dark?.borderRadius || "15")}
              onChange={(e) => {
                const v = `${e.target.value}px`;
                setLocalTheme((t) => ({
                  ...t,
                  dark: { ...t.dark, borderRadius: v },
                  light: { ...t.light, borderRadius: v },
                }));
              }}
            />
            <span>{localTheme.dark?.borderRadius || "15px"}</span>
          </BorderRow>
        </EditorPanel>

        <EditorPanel>
          <PanelTitle><Sun size={14} />Light Mode Colors</PanelTitle>
          {TOKEN_LABELS.map(({ key, label }) => (
            <ColorRow key={key}>
              <ColorLabel>{label}</ColorLabel>
              <ColorInput
                type="color"
                value={toHex(localTheme.light?.[key]) || "#ffffff"}
                onChange={(e) => setColor("light", key, e.target.value)}
              />
              <HexInput
                type="text"
                value={localTheme.light?.[key] || ""}
                onChange={(e) => setColor("light", key, e.target.value)}
              />
            </ColorRow>
          ))}
        </EditorPanel>
      </EditorGrid>

      <FontRow>
        <label>Font Family</label>
        <select
          value={localTheme.font || "Inter"}
          onChange={(e) => setLocalTheme((t) => ({ ...t, font: e.target.value }))}
        >
          {GOOGLE_FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </FontRow>

      <PreviewBox $theme={previewTheme} $font={localTheme.font}>
        <PreviewLabel>Live Preview ({previewMode})</PreviewLabel>
        <PreviewProfile>
          <PreviewAvatar />
          <PreviewName $color={previewTheme.headerFontColor}>@Your Name</PreviewName>
          <PreviewDesc $color={previewTheme.headerFontColor}>Your tagline here</PreviewDesc>
        </PreviewProfile>
        <PreviewCard $theme={previewTheme}>Example Link Card</PreviewCard>
        <PreviewCard $theme={previewTheme}>Another Link Card</PreviewCard>
      </PreviewBox>

      <SaveBtn onClick={handleSave} disabled={saving}>
        <Save size={16} />{saved ? "Saved!" : saving ? "Saving…" : "Save Theme"}
      </SaveBtn>
      <ResetBtn onClick={() => setLocalTheme(DEFAULT_THEME)}>Reset to Default</ResetBtn>
    </Section>
  );
};

// Helper: convert named colors and invalid values to hex for color input
const toHex = (val) => {
  if (!val) return "#000000";
  if (val.startsWith("#") && (val.length === 4 || val.length === 7)) return val;
  if (val === "white") return "#ffffff";
  if (val === "black") return "#000000";
  return "#000000";
};

export default ThemeEditor;

const Section = styled.div`color: #ccc;`;
const SectionHeader = styled.div`display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1.5rem;
  h3 { color: white; margin: 0; flex: 1; }`;
const PreviewToggle = styled.div`display: flex; gap: 0.4rem;`;
const ModeBtn = styled.button`display: flex; align-items: center; gap: 0.3rem; padding: 0.3rem 0.65rem; border-radius: 6px; border: 1px solid ${(p) => (p.$active ? "#7c3aed" : "#444")}; background: ${(p) => (p.$active ? "#7c3aed22" : "transparent")}; color: ${(p) => (p.$active ? "#a78bfa" : "#aaa")}; cursor: pointer; font-size: 0.8rem;`;
const EditorGrid = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; @media (max-width: 700px) { grid-template-columns: 1fr; }`;
const EditorPanel = styled.div`background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 10px; padding: 1rem;`;
const PanelTitle = styled.div`display: flex; align-items: center; gap: 0.4rem; color: #a78bfa; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.75rem;`;
const ColorRow = styled.div`display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;`;
const ColorLabel = styled.span`flex: 1; font-size: 0.82rem; color: #888;`;
const ColorInput = styled.input`width: 32px; height: 32px; border: none; border-radius: 6px; cursor: pointer; padding: 0; background: none;`;
const HexInput = styled.input`width: 90px; background: #111; border: 1px solid #333; border-radius: 6px; padding: 0.3rem 0.4rem; color: #ccc; font-size: 0.78rem; outline: none; &:focus { border-color: #7c3aed; }`;
const BorderRow = styled.div`display: flex; align-items: center; gap: 0.5rem; margin-top: 0.75rem; span { font-size: 0.8rem; color: #888; min-width: 36px; }`;
const RangeInput = styled.input`flex: 1; accent-color: #7c3aed;`;
const FontRow = styled.div`display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;
  label { color: #888; font-size: 0.85rem; }
  select { background: #111; border: 1px solid #444; border-radius: 8px; color: white; padding: 0.4rem 0.75rem; outline: none; &:focus { border-color: #7c3aed; } }`;
const PreviewBox = styled.div`background: ${(p) => p.$theme.backgroundColor || "#000"}; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; font-family: '${(p) => p.$font || "Inter"}', sans-serif;`;
const PreviewLabel = styled.div`font-size: 0.72rem; color: #555; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.08em;`;
const PreviewProfile = styled.div`display: flex; flex-direction: column; align-items: center; margin-bottom: 1rem;`;
const PreviewAvatar = styled.div`width: 56px; height: 56px; border-radius: 50%; background: #444; margin-bottom: 0.4rem;`;
const PreviewName = styled.div`font-weight: bold; font-size: 0.95rem; color: ${(p) => p.$color || "white"};`;
const PreviewDesc = styled.div`font-size: 0.8rem; color: ${(p) => p.$color || "#aaa"}; opacity: 0.7;`;
const PreviewCard = styled.div`background: ${(p) => p.$theme.cardBackgroundColor || "#222"}; color: ${(p) => p.$theme.CardtextColor || "white"}; border-radius: ${(p) => p.$theme.borderRadius || "15px"}; padding: 0.6rem 1rem; margin-bottom: 0.5rem; text-align: center; font-size: 0.85rem;`;
const SaveBtn = styled.button`display: flex; align-items: center; gap: 0.5rem; background: #7c3aed; color: white; border: none; border-radius: 8px; padding: 0.6rem 1.25rem; cursor: pointer; font-size: 0.9rem; margin-right: 0.75rem;
  &:disabled { opacity: 0.6; } &:hover:not(:disabled) { background: #6d28d9; }`;
const ResetBtn = styled.button`background: transparent; color: #888; border: 1px solid #444; border-radius: 8px; padding: 0.6rem 1rem; cursor: pointer; font-size: 0.85rem;
  &:hover { color: #ccc; border-color: #666; }`;
