export const Slogan = ({ title, secondTitle }) => {
  return (
    <div className="w-[23rem] mx-auto ">
      <div className="text-white text-[1rem] text-center weight-[900] leading-[3rem]">
        {secondTitle}
      </div>
      <div className="text-primary-color text-[2.25rem] text-center weight-[900] leading-[3rem]">
        {title}
      </div>
    </div>
  );
};
