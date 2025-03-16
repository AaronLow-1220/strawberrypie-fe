export const GroupBlockItem = ({ name, icon, onClick, collected }) => {
  return (
    <div className={`group-block-item transition-transform duration-300 hover:scale-110 cursor-pointer ${collected ? "" : "brightness-50"}`} onClick={onClick}>
      <div className="group-block-item__icon relative bg-white rounded-full overflow-hidden">
        <img 
          src={icon || null} 
          alt="" 
          className={`absolute invert w-full h-full scale-90 transition-opacity duration-300 ${icon ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
      <p>{name}</p>
    </div>
  );
};
