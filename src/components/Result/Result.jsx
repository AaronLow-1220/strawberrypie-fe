import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
export const Result = () => {
  const [character, setCharacter] = useState({});
  const [imageURL, setImageURL] = useState("");
  const { id } = useParams();

  console.log(id);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

        const response = await axios.get(
          `${apiBaseUrl}/fe/psychometric-result/view/${id}?expand=character`
        );
        if (!response.data || !response.data.character) {
          console.error("Invalid response structure:", response);
          return;
        }

        const { name, career, personality, motto, interest, image_id, tags } =
          response.data.character;

        let parsedTags = [];
        try {
          parsedTags = tags ? JSON.parse(tags) : [];
        } catch (error) {
          console.error("Error parsing tags:", error);
        }

        let imageBlobURL = "";
        if (image_id) {
          const imgResponse = await axios.get(
            `${apiBaseUrl}/fe/file/download/${image_id}`,
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/octet-stream",
              },
              responseType: "blob",
            }
          );
          imageBlobURL = URL.createObjectURL(imgResponse.data);
          setImageURL(imageBlobURL);
        }

        setCharacter({
          name,
          career,
          personality,
          motto,
          interest,
          image: imageBlobURL,
          tags: parsedTags,
        });
      } catch (error) {
        console.error("Error fetching psychometric result:", error);
      }
    };

    fetchResult();

    return () => {
      if (imageURL) {
        URL.revokeObjectURL(imageURL); // 清理 Blob URL
      }
    };
  }, []);

  const [Window, setWindow] = useState(false);
  const [DesTopWidth, setDesTopWidth] = useState(false);
  const Desktoptransforms = [
    { transform: "rotate(-10deg) translateX(10px)" },
    { transform: "rotate(-5deg) translateX(15px)" },
    { transform: "translateX(20px)" },
    { transform: "rotate(5deg) translateX(15px)" },
    { transform: "rotate(10deg) translateX(10px)" },
  ];
  const transforms = [
    { transform: "rotate(-10deg) translateX(10px)" },
    { transform: "rotate(-5deg) translateX(15px)" },
    { transform: "translateX(20px)" },
    { transform: "rotate(5deg) translateX(15px)" },
    { transform: "rotate(10deg) translateX(10px)" },
  ];
  const Mobiletransforms = [
    { transform: "rotate(-10deg) translateX(4px)" },
    { transform: "rotate(-5deg) translateX(8px)" },
    { transform: "translateX(10px)" },
    { transform: "rotate(5deg) translateX(8px)" },
    { transform: "rotate(10deg) translateX(4px)" },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setWindow(false);
      } else if (window.innerWidth < 1024) {
        setWindow(true);
      } else if (window.innerWidth < 1584) {
        setWindow(true);
      } else {
        setWindow(true);
        setDesTopWidth(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return Window ? (
    <>
      {DesTopWidth == true ? (
        <div className="flex justify-center items-center w-full min-h-screen">
          <div className="flex items-center justify-between gap-16">
            <div>
              <div className="flex max-w-[804px] mx-auto ">
                <div className="w-[120px] h-[120px] ">
                  <img src="/Result/speaker.png" alt="" />
                </div>
                <div>
                  <div
                    className="text-white text-[72px] leading-none"
                    style={{ fontFamily: "B" }}
                  >
                    {character.name}
                  </div>
                  <div
                    className="text-white text-[40px]"
                    style={{ fontFamily: "R" }}
                  >
                    {character.career}
                  </div>
                </div>
              </div>
              <div className="flex items-center max-h-[472px] max-w-[804px] mt-[1rem] mx-auto">
                <div className="max-w-[540px]">
                  <img
                    src={character.image}
                    alt=""
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div className="h-full flex flex-col gap-3">
                  {character.tags &&
                    character.tags.map((tag, index) => (
                      <div
                        key={index}
                        className="w-fit rounded-[999px] bg-[#51181E] text-white text-[28px] px-[28px] origin-[0_50%] py-[17px] text-nowrap"
                        style={{
                          transform: Desktoptransforms[index].transform,
                        }}
                      >
                        #{tag}
                      </div>
                    ))}
                </div>
              </div>
              <div className="flex justify-center items-center  max-w-[804px] mx-auto mt-[1rem] ">
                <div className="relative">
                  <div
                    className="text-white text-[72px] leading-none text-nowrap"
                    style={{ fontFamily: "Thin" }}
                  >
                    {character.motto}
                  </div>
                  <div className="absolute right-[-30px] top-[16px] z-[-1] svgAnimation scale-150">
                    <svg
                      width="144"
                      height="32"
                      viewBox="0 0 144 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.8"
                        d="M4.64076 28.0024C12.7236 23.7943 20.7556 20.5331 29.8604 17.879C40.8438 14.6774 52.26 12.1156 63.7773 10.2052C82.74 7.05986 101.948 5.35466 121.511 4.81902C122.518 4.79145 140.534 4.80216 139.957 6.68932C139.639 7.73127 135.864 7.76564 134.935 7.88571C130.013 8.52197 125.07 8.95633 120.11 9.44849C95.297 11.9109 70.8541 16.9519 48.838 25.9208C47.1139 26.6232 47.2746 26.5343 49.0843 26.1079C53.7645 25.0053 58.3742 23.7629 63.1281 22.8335C70.1684 21.457 77.2376 20.4225 84.4979 19.7711C93.1655 18.9935 101.941 19.08 110.7 18.8746"
                        stroke="#F748C1"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="max-w-[560px]">
                <div className="bg-[#9F2E78] rounded-t-[18px] py-[20px] relative">
                  <div
                    className="text-white text-[32px] text-center leading-none text-nowrap"
                    style={{ fontFamily: "B" }}
                  >
                    特質
                  </div>
                  <div className="absolute bottom-[0px] left-[20px] w-[112px] h-[112px]">
                    <img src="/Result/drawing-pad.png" alt="" />
                  </div>
                </div>
                <div className="bg-[#47152F] rounded-b-[18px] ">
                  <div className="text-white text-[24px] px-[24px] pt-[22px] pb-[24px] opacity-[72%]">
                    {character.personality}
                  </div>
                </div>
              </div>
              <div className="mt-[42px] max-w-[560px]">
                <div className="bg-[#9F2E78] rounded-t-[18px] py-[20px] relative">
                  <div
                    className="text-white text-[32px] text-center leading-none text-nowrap"
                    style={{ fontFamily: "B" }}
                  >
                    興趣
                  </div>
                  <div className="absolute bottom-[0px] right-[10px] w-[112px] h-[112px]">
                    <img src="/Result/console.png" alt="" />
                  </div>
                </div>
                <div className="bg-[#47152F] rounded-b-[18px] ">
                  <div className="text-white text-[24px]  px-[24px] pt-[22px] pb-[24px] opacity-[72%]">
                    {character.interest}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center w-full min-h-screen px-5">
          <div className="flex items-center justify-between gap-10 2xl:gap-16">
            <div>
              <div className="flex max-w-[460px] mx-auto ">
                <div className="w-[72px] h-[72px] ">
                  <img src="/Result/speaker.png" alt="" />
                </div>
                <div>
                  <div
                    className="text-white text-[43px] leading-none"
                    style={{ fontFamily: "B" }}
                  >
                    {character.name}
                  </div>
                  <div
                    className="text-white text-[24px]"
                    style={{ fontFamily: "R" }}
                  >
                    {character.career}
                  </div>
                </div>
              </div>
              <div className="flex items-center max-w-[460px] mt-[1rem] mx-auto">
                <div className="max-w-[324px]">
                  <img
                    src={character.image}
                    alt=""
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div className="h-full flex flex-col gap-3">
                  {character.tags &&
                    character.tags.map((tag, index) => (
                      <div
                        key={index}
                        className="w-fit rounded-[999px] bg-[#51181E] text-white text-[15.4px] px-[15.4px] origin-[0_50%]  py-[6.6px] text-nowrap"
                        style={{
                          transform: transforms[index].transform,
                        }}
                      >
                        #{tag}
                      </div>
                    ))}
                </div>
              </div>
              <div className="flex justify-center items-center max-w-[460px] mx-auto mt-[1rem] ">
                <div className="relative">
                  <div
                    className="text-white text-[47.52px] leading-none text-nowrap"
                    style={{ fontFamily: "Thin" }}
                  >
                    {character.motto}
                  </div>
                  <div className="absolute right-[-30px] top-[16px] z-[-1] svgAnimation">
                    <svg
                      width="144"
                      height="32"
                      viewBox="0 0 144 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.8"
                        d="M4.64076 28.0024C12.7236 23.7943 20.7556 20.5331 29.8604 17.879C40.8438 14.6774 52.26 12.1156 63.7773 10.2052C82.74 7.05986 101.948 5.35466 121.511 4.81902C122.518 4.79145 140.534 4.80216 139.957 6.68932C139.639 7.73127 135.864 7.76564 134.935 7.88571C130.013 8.52197 125.07 8.95633 120.11 9.44849C95.297 11.9109 70.8541 16.9519 48.838 25.9208C47.1139 26.6232 47.2746 26.5343 49.0843 26.1079C53.7645 25.0053 58.3742 23.7629 63.1281 22.8335C70.1684 21.457 77.2376 20.4225 84.4979 19.7711C93.1655 18.9935 101.941 19.08 110.7 18.8746"
                        stroke="#F748C1"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="max-w-[420px]">
                <div className="bg-[#9F2E78] rounded-t-[12px] px-[151px] py-[13.2px] relative">
                  <div
                    className="text-white text-[22px] text-nowrap text-center leading-none"
                    style={{ fontFamily: "B" }}
                  >
                    特質
                  </div>
                  <div className="absolute bottom-[0px] left-[10px] w-[77px] h-[77px]">
                    <img src="/Result/drawing-pad.png" alt="" />
                  </div>
                </div>
                <div className="bg-[#47152F] rounded-b-[12px] ">
                  <div className="text-white opacity-[72%] text-[17.6px] px-[17.6px] pt-[13.2px] pb-[17.6px]">
                    {character.personality}
                  </div>
                </div>
              </div>
              <div className="mt-[42px] max-w-[420px]">
                <div className="bg-[#9F2E78] rounded-t-[12px] px-[151px] py-[13.2px] relative">
                  <div
                    className="text-white text-[22px] text-nowrap text-center leading-none"
                    style={{ fontFamily: "B" }}
                  >
                    興趣
                  </div>
                  <div className="absolute bottom-[0px] right-[10px] w-[77px] h-[77px]">
                    <img src="/Result/console.png" alt="" />
                  </div>
                </div>
                <div className="bg-[#47152F] rounded-b-[12px] ">
                  <div className="text-white text-[17.6px] opacity-[72%] px-[17.6px] pt-[13.2px] pb-[17.6px]">
                    {character.interest}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  ) : (
    <div className="flex flex-col justify-center w-full px-5 pt-20 gap-4">
      <div className="flex w-full max-w-[420px] mx-auto">
        <div className="w-[60px] h-[60px] ">
          <img src="/Result/speaker.png" alt="" />
        </div>
        <div>
          <div
            className="text-white text-[36px] leading-none"
            style={{ fontFamily: "B" }}
          >
            {character.name}
          </div>
          <div className="text-white text-[20px]" style={{ fontFamily: "R" }}>
            {character.career}
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center max-h-[236px] max-w-[614px] mx-auto">
        <div className="max-w-[324px]">
          <img
            src={character.image}
            alt=""
            style={{ objectFit: "contain" }}
          />
        </div>
        <div className="h-full flex flex-col gap-2">
          {character.tags &&
            character.tags.map((tag, index) => (
              <div
                key={index}
                className="w-fit rounded-[999px] bg-[#51181E] text-white text-[14px] px-[14px] py-[6px] origin-[0_50%] text-nowrap"
                style={{
                  transform: Mobiletransforms[index].transform,
                }}
              >
                #{tag}
              </div>
            ))}
        </div>
      </div>
      <div className="flex justify-center items-center  max-w-[342px] mx-auto mt-[1rem] ">
        <div className="relative">
          <div
            className="text-white text-[36px] leading-none text-center"
            style={{ fontFamily: "Thin" }}
          >
            {character.motto}
          </div>
          <div className="absolute right-[-30px] top-[16px] z-[-1] svgAnimation">
            <svg
              width="144"
              height="32"
              viewBox="0 0 144 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.8"
                d="M4.64076 28.0024C12.7236 23.7943 20.7556 20.5331 29.8604 17.879C40.8438 14.6774 52.26 12.1156 63.7773 10.2052C82.74 7.05986 101.948 5.35466 121.511 4.81902C122.518 4.79145 140.534 4.80216 139.957 6.68932C139.639 7.73127 135.864 7.76564 134.935 7.88571C130.013 8.52197 125.07 8.95633 120.11 9.44849C95.297 11.9109 70.8541 16.9519 48.838 25.9208C47.1139 26.6232 47.2746 26.5343 49.0843 26.1079C53.7645 25.0053 58.3742 23.7629 63.1281 22.8335C70.1684 21.457 77.2376 20.4225 84.4979 19.7711C93.1655 18.9935 101.941 19.08 110.7 18.8746"
                stroke="#F748C1"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center mx-auto gap-4 mb-12">
        <div className="mt-8 max-w-[360px]">
          <div className="bg-[#9F2E78] rounded-t-[12px] py-[12px] relative">
            <div
              className="text-white text-[20px] text-center leading-none text-nowrap"
              style={{ fontFamily: "B" }}
            >
              特質
            </div>
            <div className="absolute bottom-[0px] left-[10px] w-[70px] h-[70px]">
              <img src="/Result/drawing-pad.png" alt="" />
            </div>
          </div>
          <div className="bg-[#47152F] rounded-b-[12px] ">
            <div className="text-white text-[16px]  px-[1rem] pt-[12px] pb-[1rem] opacity-[72%]">
              {character.personality}
            </div>
          </div>
        </div>
        <div className="mt-8 max-w-[360px]">
          <div className="bg-[#9F2E78] rounded-t-[12px] py-[12px] relative">
            <div
              className="text-white text-[20px] text-center leading-none text-nowrap"
              style={{ fontFamily: "B" }}
            >
              興趣
            </div>
            <div className="absolute bottom-[0px] right-[10px] w-[70px] h-[70px]">
              <img src="/Result/console.png" alt="" />
            </div>
          </div>
          <div className="bg-[#47152F] rounded-b-[12px] ">
            <div className="text-white text-[16px]  px-[1rem] pt-[12px] pb-[1rem] opacity-[72%]">
              {character.interest}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
