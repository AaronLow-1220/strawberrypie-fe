export const Unit = ({ title, img, img2, img3, img4 }) => {
  return (
    <div className="mt-[4rem]">
      <div className="w-[7rem] h-[2.25rem] bg-[#381025] rounded-[39px] text-center flex items-center justify-center mx-auto text-white">
        {title}
      </div>
      {(img3 != null && (
        <div className="w-full h-[3.375rem] mx-auto mt-[1.5rem] px-[2rem] flex overflow-x-auto space-x-[2rem]">
          <img src={img} alt="Image 1" />
          <img src={img2} alt="Image 2" />
          <img src={img3} alt="Image 3" />
          <img src={img4} alt="Image 4" />
        </div>
      )) || (
        <div className="w-[16.5rem] h-[7.5rem] mx-auto mt-[1.5rem] flex flex-row-reverse">
          <img src={img} alt="Image 1" />
          {img2 != null && <img src={img2} alt="Image 2" />}
        </div>
      )}
    </div>
  );
};
