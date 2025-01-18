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
  dateTextSize = "1.5rem",
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
  });

  const dateStyle = {
    color: "#FFFFFF",
    fontSize: dateTextSize,
    marginTop: "0.75rem",
    textAlign: "center",
    whiteSpace: "nowrap",
  };

  const transitionStyle = (opacity, transform) => ({
    textAlign: "center",
    opacity: opacity,
    transform: transform,
    transition: "all 1s ease-in-out",
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
