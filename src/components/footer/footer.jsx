import styled from "styled-components";
import { SocialIcon } from "react-social-icons";
import themeContext from "../../state/context/themeContext";
import { useContext } from "react";

const Footer = ({ socialLinks = [] }) => {
  const { darkMode, themeData } = useContext(themeContext);
  const theme = darkMode ? themeData.dark : themeData.light;

  const SocialIconStyle = {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    backgroundColor: theme.footerSocialLinkColor,
  };

  return (
    <div className="bottom">
      <hr />
      <FooterContainer>
        {socialLinks.map((link, index) => (
          <FooterContent key={index}>
            <SocialIcon className="shadow" style={SocialIconStyle} url={link} />
          </FooterContent>
        ))}
      </FooterContainer>
    </div>
  );
};

export default Footer;

const FooterContainer = styled.div`
  width: 100vw;
  display: flex;
  margin-bottom: 10px;
  align-items: center;
  justify-content: center;
`;

const FooterContent = styled.div`
  margin: 5px;
`;
