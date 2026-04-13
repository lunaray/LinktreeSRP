import { useContext } from "react";
import styled from "styled-components";
import { LazyLoadImage } from "react-lazy-load-image-component";
import DarkModeToggle from "react-dark-mode-toggle";
import themeContext from "../../state/context/themeContext";
import "react-lazy-load-image-component/src/effects/blur.css";

const Header = ({ profile = {} }) => {
  const { darkMode, setDarkMode, themeData } = useContext(themeContext);
  const { userName = "", photoLink = "", desc = "", about = "" } = profile;
  const theme = darkMode ? themeData.dark : themeData.light;

  document.body.style.backgroundColor = theme.backgroundColor;
  document.body.style.fontFamily = themeData.font ? `'${themeData.font}', sans-serif` : "inherit";

  return (
    <>
      <DarkMode onChange={setDarkMode} checked={darkMode} size={50} />
      <HeaderWrapper>
        {photoLink && (
          <CustomImage draggable={false} effect="blur" src={photoLink} alt="profile" />
        )}
        <UserNameText $color={theme.headerFontColor}>@{userName}</UserNameText>
        <UserNameText $color={theme.headerFontColor}>{desc}</UserNameText>
        <TextWrapPara $color={theme.headerFontColor}>{about}</TextWrapPara>
      </HeaderWrapper>
    </>
  );
};
export default Header;

const DarkMode = styled(DarkModeToggle)`
  margin: 15px;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
`;

const HeaderWrapper = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CustomImage = styled(LazyLoadImage)`
  border-radius: 50%;
  width: 100px;
  height: 100px;
  margin: 5px;
`;

const UserNameText = styled.h6`
  color: ${(props) => props.$color};
  font-weight: bold;
  text-align: center;
`;

const TextWrapPara = styled.p`
  color: ${(props) => props.$color};
  margin: 10px;
  text-align: center;
  width: 50vw;
  @media (max-width: 768px) {
    width: 90vw;
  }
`;