import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../state/context/authContext";
import LinkEditor from "../../components/admin/LinkEditor";
import ProfileEditor from "../../components/admin/ProfileEditor";
import ThemeEditor from "../../components/admin/ThemeEditor";
import { Link2, User, Palette, LogOut, ExternalLink } from "lucide-react";

const TABS = [
  { id: "links", label: "Links", icon: Link2 },
  { id: "profile", label: "Profile", icon: User },
  { id: "theme", label: "Theme", icon: Palette },
];

const Dashboard = () => {
  const [tab, setTab] = useState("links");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  return (
    <Page>
      <Sidebar>
        <SidebarTop>
          <Logo>⚡ Admin</Logo>
          <Nav>
            {TABS.map(({ id, label, icon: Icon }) => (
              <NavItem key={id} $active={tab === id} onClick={() => setTab(id)}>
                <Icon size={18} />
                {label}
              </NavItem>
            ))}
          </Nav>
        </SidebarTop>
        <SidebarBottom>
          <NavItem as={Link} to="/" target="_blank" style={{ textDecoration: "none" }}>
            <ExternalLink size={18} />
            View Site
          </NavItem>
          <NavItem onClick={handleLogout} $danger>
            <LogOut size={18} />
            Log Out
          </NavItem>
        </SidebarBottom>
      </Sidebar>

      <Main>
        <MainInner>
          {tab === "links" && <LinkEditor />}
          {tab === "profile" && <ProfileEditor />}
          {tab === "theme" && <ThemeEditor />}
        </MainInner>
      </Main>
    </Page>
  );
};

export default Dashboard;

const Page = styled.div`
  display: flex;
  min-height: 100vh;
  background: #0a0a0a;
  color: #ccc;
`;

const Sidebar = styled.aside`
  width: 220px;
  background: #111;
  border-right: 1px solid #1e1e1e;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  @media (max-width: 700px) {
    width: 60px;
  }
`;

const SidebarTop = styled.div`flex: 1;`;
const SidebarBottom = styled.div``;

const Logo = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  padding: 0 1.25rem;
  margin-bottom: 1.5rem;
  @media (max-width: 700px) { display: none; }
`;

const Nav = styled.nav`display: flex; flex-direction: column; gap: 2px;`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.65rem 1.25rem;
  font-size: 0.9rem;
  cursor: pointer;
  border-radius: 0;
  color: ${(p) => (p.$danger ? "#f87171" : p.$active ? "white" : "#777")};
  background: ${(p) => (p.$active ? "#7c3aed22" : "transparent")};
  border-left: 3px solid ${(p) => (p.$active ? "#7c3aed" : "transparent")};
  transition: background 0.15s, color 0.15s;
  &:hover {
    background: #1a1a1a;
    color: ${(p) => (p.$danger ? "#fca5a5" : "white")};
  }
  @media (max-width: 700px) {
    padding: 0.65rem;
    justify-content: center;
    span { display: none; }
  }
`;

const Main = styled.main`
  flex: 1;
  margin-left: 220px;
  @media (max-width: 700px) { margin-left: 60px; }
`;

const MainInner = styled.div`
  max-width: 860px;
  margin: 0 auto;
  padding: 2.5rem 2rem;
  @media (max-width: 600px) { padding: 1.5rem 1rem; }
`;
