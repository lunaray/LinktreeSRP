import { useState, useMemo, Component } from "react";
import styled from "styled-components";
import { SocialIcon } from "react-social-icons";
import * as LucideIcons from "lucide-react";
import { Search, Link } from "lucide-react";

const LUCIDE_NAMES = Object.keys(LucideIcons).filter(
  (k) => k !== "createLucideIcon" && k !== "default" && typeof LucideIcons[k] === "function"
);

// react-social-icons throws on unrecognized URLs — catch it gracefully
class SocialIconSafe extends Component {
  constructor(props) { super(props); this.state = { error: false }; }
  static getDerivedStateFromError() { return { error: true }; }
  render() {
    if (this.state.error)
      return <Muted style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><Link size={20} /> No icon found for this URL</Muted>;
    return <SocialIcon url={this.props.url} style={{ width: 48, height: 48 }} />;
  }
}

const IconPicker = ({ iconType, iconValue, url, onChange }) => {
  const [lucideSearch, setLucideSearch] = useState("");
  const [showLucideGrid, setShowLucideGrid] = useState(false);

  const filteredIcons = useMemo(
    () =>
      lucideSearch
        ? LUCIDE_NAMES.filter((n) => n.toLowerCase().includes(lucideSearch.toLowerCase())).slice(0, 60)
        : LUCIDE_NAMES.slice(0, 60),
    [lucideSearch]
  );

  const handleTypeChange = (e, type) => {
    e.preventDefault();
    onChange({ iconType: type, iconValue: "" });
  };

  const SelectedLucideIcon = iconType === "lucide" && iconValue ? LucideIcons[iconValue] : null;

  return (
    <Wrapper>
      <TypeRow>
        <TypeBtn type="button" $active={iconType === "auto"} onClick={(e) => handleTypeChange(e, "auto")}>Auto-detect</TypeBtn>
        <TypeBtn type="button" $active={iconType === "lucide"} onClick={(e) => handleTypeChange(e, "lucide")}>Lucide Icon</TypeBtn>
        <TypeBtn type="button" $active={iconType === "url"} onClick={(e) => handleTypeChange(e, "url")}>Image URL</TypeBtn>
      </TypeRow>

      {iconType === "auto" && (
        <Preview>
          {url ? (
            <SocialIconSafe url={url} />
          ) : (
            <Muted>Enter a URL above to auto-detect the icon</Muted>
          )}
        </Preview>
      )}

      {iconType === "lucide" && (
        <div>
          <LucidePreviewRow>
            {SelectedLucideIcon ? (
              <>
                <SelectedLucideIcon size={36} />
                <span>{iconValue}</span>
              </>
            ) : (
              <Muted>No icon selected</Muted>
            )}
            <PickerToggle type="button" onClick={() => setShowLucideGrid((v) => !v)}>
              {showLucideGrid ? "Close" : "Pick Icon"}
            </PickerToggle>
          </LucidePreviewRow>
          {showLucideGrid && (
            <LucideGrid>
              <SearchRow>
                <Search size={16} />
                <input
                  placeholder="Search icons…"
                  value={lucideSearch}
                  onChange={(e) => setLucideSearch(e.target.value)}
                />
              </SearchRow>
              <Grid>
                {filteredIcons.map((name) => {
                  const Icon = LucideIcons[name];
                  return (
                    <GridItem
                      key={name}
                      type="button"
                      $selected={iconValue === name}
                      title={name}
                      onClick={() => {
                        onChange({ iconType: "lucide", iconValue: name });
                        setShowLucideGrid(false);
                      }}
                    >
                      <Icon size={22} />
                    </GridItem>
                  );
                })}
              </Grid>
            </LucideGrid>
          )}
        </div>
      )}

      {iconType === "url" && (
        <UrlRow>
          <input
            type="url"
            placeholder="https://example.com/icon.png"
            value={iconValue}
            onChange={(e) => onChange({ iconType: "url", iconValue: e.target.value })}
          />
          {iconValue && <img src={iconValue} alt="preview" onError={(e) => (e.target.style.display = "none")} />}
        </UrlRow>
      )}
    </Wrapper>
  );
};

export default IconPicker;

const Wrapper = styled.div`margin-top: 0.5rem;`;

const TypeRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const TypeBtn = styled.button`
  padding: 0.3rem 0.75rem;
  border-radius: 6px;
  border: 1px solid ${(p) => (p.$active ? "#7c3aed" : "#444")};
  background: ${(p) => (p.$active ? "#7c3aed22" : "transparent")};
  color: ${(p) => (p.$active ? "#a78bfa" : "#aaa")};
  cursor: pointer;
  font-size: 0.8rem;
`;

const Preview = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
`;

const Muted = styled.span`color: #666; font-size: 0.85rem;`;

const LucidePreviewRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #ccc;
  margin-bottom: 0.5rem;
`;

const PickerToggle = styled.button`
  margin-left: auto;
  background: #7c3aed;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
  font-size: 0.8rem;
`;

const LucideGrid = styled.div`
  background: #111;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 0.75rem;
`;

const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: #888;
  input {
    flex: 1;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 6px;
    padding: 0.4rem 0.6rem;
    color: white;
    font-size: 0.85rem;
    outline: none;
    &:focus { border-color: #7c3aed; }
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(42px, 1fr));
  gap: 4px;
  max-height: 220px;
  overflow-y: auto;
`;

const GridItem = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: 1px solid ${(p) => (p.$selected ? "#7c3aed" : "transparent")};
  background: ${(p) => (p.$selected ? "#7c3aed22" : "transparent")};
  color: #ccc;
  padding: 6px;
  cursor: pointer;
  &:hover { background: #222; }
`;

const UrlRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  input {
    flex: 1;
    background: #111;
    border: 1px solid #444;
    border-radius: 8px;
    padding: 0.5rem 0.75rem;
    color: white;
    font-size: 0.9rem;
    outline: none;
    &:focus { border-color: #7c3aed; }
  }
  img {
    width: 40px;
    height: 40px;
    object-fit: contain;
    border-radius: 6px;
    background: #222;
  }
`;
