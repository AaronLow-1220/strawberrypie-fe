export const InfoCard = ({
  title,
  date,
  opacity,
  transform,
  backgroundColor,
  color,
  containerWidth = "5rem",
  containerHeight = "2rem",
  fontSize = "1rem",
  dateTextSize = "28px",
  children,
}) => {
  const containerStyle = (backgroundColor) => ({
    width: containerWidth,
    height: containerHeight,
    backgroundColor: backgroundColor,
    borderRadius: "100px",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
    filter: "drop-shadow(0 4px 4px rgba(0, 0, 0, 0.25))",
  });

  const dateStyle = {
    color: "#FFFFFF",
    fontSize: dateTextSize,
    marginTop: "8px",
    textAlign: "center",
    whiteSpace: "nowrap",
  };

  const transitionStyle = (opacity, transform) => ({
    textAlign: "center",
    opacity: opacity,
    transform: transform,
    transition: "all 1s cubic-bezier(0.33, 1, 0.66, 1)",
  });

  return (
    <div style={transitionStyle(opacity, transform)}>
      <div style={containerStyle(backgroundColor)}>
        <div style={{ color: color, fontSize: fontSize }}>{title}</div>
      </div>
      <div style={dateStyle}>{children || date}</div>
    </div>
  );
};
