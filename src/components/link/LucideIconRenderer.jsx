import * as LucideIcons from "lucide-react";

const LucideIconRenderer = ({ name, size = 40, style }) => {
  const Icon = LucideIcons[name];
  if (!Icon) return null;
  return <Icon size={size} style={style} />;
};

export default LucideIconRenderer;
