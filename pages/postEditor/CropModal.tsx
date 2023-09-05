import React, { useState, createRef, useEffect } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import Modal from "react-modal";

const defaultSrc = "https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg";

interface CropModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onCropComplete?: (croppedImageUrl: string) => void;
}

const CropModal: React.FC<CropModalProps> = ({ isOpen, onRequestClose, onCropComplete }) => {
  const [image, setImage] = useState(defaultSrc);
  const [cropData, setCropData] = useState("#");
  const cropperRef = createRef<ReactCropperElement>();
  const onChange = (e: any) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as any);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      cropperRef.current?.cropper.getCroppedCanvas().toBlob((blob) => {
        if (blob !== null) {
          const url = URL.createObjectURL(blob);
          setCropData(url);
          onCropComplete && onCropComplete(url); // notify parent component
        }
      });
    }
  };

  useEffect(() => {
    console.log(cropData);
  }, [cropData]);

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <div>
        <div style={{ width: "60%" }}>
          <input type="file" onChange={onChange} />
          <br />
          <br />
          <Cropper
            ref={cropperRef}
            style={{ height: 400, width: "100%" }}
            zoomTo={0.5}
            aspectRatio={3 / 4} // add this line
            initialAspectRatio={1}
            src={image}
            viewMode={1}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            background={false}
            responsive={true}
            autoCropArea={1}
            checkOrientation={false}
            guides={true}
          />
        </div>
        <div>
          <div className="box" style={{ width: "50%", float: "right", height: "300px" }}>
            <h1>
              <button style={{ float: "right" }} onClick={getCropData} className="btn">
                Crop Image
              </button>
            </h1>
            <img style={{ width: "400px" }} src={cropData} alt="cropped" />
          </div>
        </div>
        <br style={{ clear: "both" }} />
      </div>
    </Modal>
  );
};

export default CropModal;
