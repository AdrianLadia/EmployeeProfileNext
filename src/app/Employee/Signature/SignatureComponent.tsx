import { useRef } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import SignatureCanvas from "react-signature-canvas";
import { Box, Button } from "@mui/material";
import { useAppContext } from "@/app/GlobalContext";


interface SignatureComponentProps {
    employeeId: string;
    setSignatureImageUrl: (url: string) => void;
}

const SignatureComponent: React.FC<SignatureComponentProps> = ({ employeeId, setSignatureImageUrl }) => {
  const sigCanvas = useRef<SignatureCanvas | null>(null);
  const { storage, serverRequests, userData } = useAppContext();

  const save = () => {
    if (!sigCanvas.current) return;

    const signatureURL = sigCanvas.current
      .getTrimmedCanvas()
      .toDataURL("image/png");
    console.log("Signature URL:", signatureURL);
    setSignatureImageUrl(signatureURL);

    const dataURLtoBlob = (dataUrl: string): Blob => {
      const arr = dataUrl.split(",");
      const mime = arr[0].match(/:(.*?);/)?.[1] || "";
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    };

    const signatureBlob = dataURLtoBlob(signatureURL);

    const storageRef = ref(storage, `signatures/${Date.now()}_signature.png`);
    uploadBytes(storageRef, signatureBlob).then((snapshot) => {
      console.log("Uploaded a blob or file!", snapshot);

      getDownloadURL(snapshot.ref).then((downloadURL) => {
        console.log("File available at", downloadURL);
        serverRequests.updateUrlPhotoOfSignature(userData, employeeId, downloadURL);
        setSignatureImageUrl(downloadURL);
      });
    });
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", padding: 2 }}>
      <h2>Sign Here</h2>
      <div className="bg-white mt-3 border-2 border-black rounded-md">
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{ width: 400, height: 200, className: "sigCanvas" }}
        />
      </div>
      <Box sx={{ mt: 2 }}>
        <Button onClick={save} variant="contained" color="primary">
          Save
        </Button>
        <Button
          onClick={() => {
            if (sigCanvas.current) {
              sigCanvas.current.clear();
            }
          }}
          variant="contained"
          color="secondary"
          sx={{ ml: 2 }}
        >
            Clear
        </Button>
      </Box>
    </Box>
  );
};

export default SignatureComponent;
