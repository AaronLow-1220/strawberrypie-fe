export const InfoCard = ({
  title,
  date,
  opacity,
  transform,
  backgroundColor,
  color,
}) => {
  const containerStyle = (backgroundColor) => ({
    width: "5rem",
    height: "2rem",
    backgroundColor: backgroundColor,
    borderRadius: "39px",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
  });

  const dateStyle = {
    color: "#FFFFFF",
    fontSize: "1.5rem",
    marginTop: "0.75rem",
  };

  const transitionStyle = (opacity, transform) => ({
    width: "9rem",
    height: "4.5rem",
    textAlign: "center",
    opacity: opacity,
    transform: transform,
    transition: "all 1s ease-in-out",
  });

  return (
    <div style={transitionStyle(opacity, transform)}>
      <div style={containerStyle(backgroundColor)}>
        <div style={{ color: color, fontSize: "1rem" }}>{title}</div>
      </div>
      <div style={dateStyle}>{date}</div>
    </div>
  );
};
