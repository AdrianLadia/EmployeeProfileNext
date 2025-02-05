import { useRef, useState, useEffect } from "react";

import SignatureCanvas from "react-signature-canvas";

interface SignatureComponentProps {
  title?: string;
  setSignatureImageUrl: (url: string) => void;
}

const SignatureComponent: React.FC<SignatureComponentProps> = ({
  title = "Sign Here",
  setSignatureImageUrl,
}) => {
  const sigCanvas = useRef<SignatureCanvas | null>(null);

  const canvasContainer = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const save = () => {
    setLoading(true);
    if (!sigCanvas.current) return;

    const signatureURL = sigCanvas.current
      .getTrimmedCanvas()
      .toDataURL("image/png");

    // console.log("Signature URL:", signatureURL);
    setSignatureImageUrl(signatureURL);

    setLoading(false);
  };

  const clear = () => {
    setLoading(true);
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      setSignatureImageUrl("");
    }
    setLoading(false);
  };

  const [canvasWidth, setCanvasWidth] = useState<number>(0);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setCanvasWidth(window.innerWidth * 0.8);
    } else {
      setCanvasWidth(500);
    }
  }, []);

  return (
    <div
      ref={canvasContainer}
      className="flex flex-col items-center w-full h-full"
    >
      <span className="w-[100%]">{title}</span>
      <div className="bg-white mt-2 border-2 border-black rounded-box w-max relative overflow-clip ">
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{
            width: canvasWidth,
            height: 300,
            className: "sigCanvas",
          }}
        />
        <span className={`${loading&&"loading text-info"}`}></span>
        <div className="flex w-full bg-black flex-wrap items-stretch gap-0.5 border-t-2 border-black">
          <input
            onClick={() => save()}
            type="button"
            className=" grow hover:text-info-content hover:bg-info bg-base-100"
            value={"Save"}
          />
          <input
            onClick={() => clear()}
            type="button"
            className="p-2 grow hover:text-error-content hover:bg-error bg-base-100"
            value={"Clear"}
          />
        </div>
      </div>
    </div>
  );
};

export default SignatureComponent;
