export const GroupBlockItem = ({ name, icon }) => {
  return (
    <div className="group-block-item transition-transform duration-300 hover:scale-110 cursor-pointer">
      <div className="group-block-item__icon relative bg-white rounded-full overflow-hidden">
        <img src={icon} alt="" className="absolute invert w-full h-full scale-90"/>

      </div>
      <p>{name}</p>
    </div>
  );
};
