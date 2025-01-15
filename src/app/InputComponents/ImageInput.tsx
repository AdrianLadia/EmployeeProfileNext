import React, { FC } from "react";

import Image from "next/image";

import { useAppContext } from "../GlobalContext";

import { Employee } from "../schemas/EmployeeSchema";

interface ImageInputProps {
  id: string;
  title?: string;
  inputStyle?: string;
  width?: string;
  style?: string;
  imgDimensions?: { height: number; width: number };
  mediaList?: string[];
  onChangeHandler?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setFunction?: (value: (prev: Employee) => Employee) => void;
  disable?: boolean;
  required?: boolean;
  multiple?: boolean;
}

const ImageInput: FC<ImageInputProps> = ({
  id,
  title,
  width,
  inputStyle,
  imgDimensions,
  mediaList,
  onChangeHandler,
  setFunction,
  disable,
  required,
  multiple,
}) => {
  const { handleImageModalClick } = useAppContext();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const fileReaders = [];
      const fileDataUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        fileReaders.push(reader);

        reader.readAsDataURL(files[i]);

        reader.onloadend = () => {
          fileDataUrls.push(reader.result as string);

          // Check if all files have been processed
          if (fileDataUrls.length === files.length) {
            const finalResult =
              e.target.id === "photoOfPerson" ? fileDataUrls[0] : fileDataUrls;

            settingFunction(finalResult, e.target.id);
          }
        };
      }
    }
  };

  const settingFunction = (value: string | string[], id: string) => {
    if (setFunction) {
      setFunction((prev: Employee) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  return (
    <div className={`flex flex-col ${width}`}>
      <div
        className="flex justify-between items-end mb-1 gap-1 min-h-10 "
        data-tip={`${mediaList?.length} images`}
      >
        <label htmlFor={id}>{title}</label>
        <div
          className={` h-[${imgDimensions?.height}px] w-[${imgDimensions?.width}px] `}
          data-tip={`${mediaList?.length}`}
        >
          <Image
            className={`
              ${mediaList?.[0] && "cursor-pointer border "} 
              h-[${imgDimensions?.height}px] w-[${imgDimensions?.width}px]
            `}
            height={imgDimensions?.height}
            width={imgDimensions?.width}
            alt={"   "}
            src={mediaList?.[0] || ""}
            onClick={() =>
              mediaList?.[0] && handleImageModalClick(mediaList || [])
            }
          />
        </div>
      </div>

      <input
        type="file"
        className={inputStyle}
        id={id}
        accept="image/*"
        capture="environment" 
        required={required}
        disabled={disable}
        multiple={multiple}
        onChange={(setFunction && handleFileChange) || onChangeHandler}
      />
    </div>
  );
};

export default ImageInput;
