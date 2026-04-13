import styled from "styled-components";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useContext } from "react";
import themeContext from "../../state/context/themeContext";
import { SocialIcon } from "react-social-icons";
import * as LucideIcons from "lucide-react";
import "react-lazy-load-image-component/src/effects/blur.css";

const LinkIcon = ({ item }) => {
  if (item.icon_type === "lucide" && item.icon_value) {
    const Icon = LucideIcons[item.icon_value];
    if (Icon) return <Icon size={40} style={{ margin: "5px 10px" }} />;
  }
  if (item.icon_type === "url" && item.icon_value) {
    return (
      <LazyLoadImage
        id="image"
        draggable={false}
        effect="blur"
        src={item.icon_value}
        alt={item.name}
      />
    );
  }
  // auto: try react-social-icons, fallback to image field for backwards compat
  try {
    return <SocialIcon url={item.url || item.link} style={{ width: 50, height: 50, margin: "0 10px" }} />;
  } catch {
    return item.image ? (
      <LazyLoadImage id="image" draggable={false} effect="blur" src={item.image} alt={item.name} />
    ) : null;
  }
};

const LinkList = ({ links = [] }) => {
  const { darkMode, themeData } = useContext(themeContext);
  const theme = darkMode ? themeData.dark : themeData.light;

  return (
    <ParentWrapper>
      {links.map((item) => (
        <CustomDiv
          className="shadow"
          $theme={theme}
          onClick={() => window.open(item.url || item.link, "_blank")}
          key={item.id}
        >
          <LinkIcon item={item} />
          <p className="text-center">{item.name}</p>
        </CustomDiv>
      ))}
    </ParentWrapper>
  );
};

export default LinkList;

const CustomDiv = styled.div`
  font-weight: 400;
  margin-bottom: 15px;
  border-radius: ${(props) => props.$theme.borderRadius || "15px"};
  cursor: pointer;
  align-items: center;
  justify-content: center;
  width: 30vw;
  padding: 5px;
  background-color: ${(props) => props.$theme.cardBackgroundColor};
  display: flex;
  color: ${(props) => props.$theme.CardtextColor};
  transition: transform 0.2s ease-in-out;
  :hover {
    transform: scale(1.05);
  }
  @media (max-width: 768px) {
    width: 90vw;
    text-align: center;
  }
  p {
    flex: 1;
    justify-content: space-between;
    margin: 0;
  }
  #image {
    margin-left: 10px;
    height: 50px;
    width: auto;
  }
`;

const ParentWrapper = styled.div`
  margin-top: 20px;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
