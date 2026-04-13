import { useState, useEffect } from "react";
import themeContext from "../context/themeContext";
import pb from "../../hooks/usePocketBase";

const DEFAULT_THEME = {
  dark: {
    backgroundColor: "#000000",
    onHoverBackgroundColor: "#02040a",
    cardBackgroundColor: "#222222",
    onHoverTextColor: "white",
    footerColor: "white",
    footerSocialLinkColor: "white",
    headerFontColor: "white",
    CardtextColor: "white",
    accentColor: "#7c3aed",
    borderRadius: "15px",
  },
  light: {
    backgroundColor: "white",
    onHoverBackgroundColor: "#dfe6e9",
    cardBackgroundColor: "#ffffff",
    onHoverTextColor: "#636e72",
    footerColor: "black",
    footerSocialLinkColor: "white",
    headerFontColor: "#2d3436",
    CardtextColor: "#2d3436",
    accentColor: "#7c3aed",
    borderRadius: "15px",
  },
  font: "Inter",
};

const ThemeState = (props) => {
  const [darkMode, setDarkMode] = useState(true);
  const [themeData, setThemeData] = useState(() => {
    try {
      const cached = localStorage.getItem("lt_theme");
      return cached ? JSON.parse(cached) : DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  });

  useEffect(() => {
    pb.collection("theme")
      .getFirstListItem("")
      .then((record) => {
        const data = record.data || DEFAULT_THEME;
        setThemeData(data);
        localStorage.setItem("lt_theme", JSON.stringify(data));
      })
      .catch(() => {
        // PocketBase not running or collection doesn't exist yet, use cached/default
      });
  }, []);

  const updateThemeData = (newTheme) => {
    setThemeData(newTheme);
    localStorage.setItem("lt_theme", JSON.stringify(newTheme));
  };

  return (
    <themeContext.Provider
      value={{
        darkMode,
        setDarkMode,
        themeData,
        updateThemeData,
        DEFAULT_THEME,
      }}
    >
      {props.children}
    </themeContext.Provider>
  );
};

export default ThemeState;
