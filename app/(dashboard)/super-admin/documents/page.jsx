"use client";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import React, { useRef, useState } from "react";
import Image from "@/components/ui/Image";
import VideoPlayer from "@/components/ui/VideoPlayer";
import PdfViewerModal from '@/components/features/PDFViewer/PdfViewerModal';

const page = () => {
  const [url, setUrl] = useState(
    "https://www.clickdimensions.com/links/TestPDFfile.pdf"
  );

  const [showpdf, setshowPdf] = useState(false);
  const [showImage, setshowImage] = useState(false);
  const [showVideo, setshowVideo] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen((prevState) => !prevState);
  };

  const handleButtonClick = ({ fileType }) => {
    setModalOpen(true);
    if (fileType === "pdf") {
      setshowPdf(true);
      setshowVideo(false);
      setshowImage(false);
    }
    if (fileType === "mp4") {
      setshowPdf(false);
      setshowVideo(true);
      setshowImage(false);
    }
    if (fileType === "image") {
      setshowPdf(false);
      setshowVideo(false);
      setshowImage(true);
    }
  };

  return modalOpen ? (
    <Modal
      className="max-w-4xl h-xl" //doubt
      activeModal={modalOpen}
      onClose={toggleModal}
      title={`${
        showImage
          ? "Image Viewer"
          : showpdf
          ? "PDF viewer"
          : showVideo
          ? "VIDEO viewer"
          : ""
      }`}
    >
      {showImage === true ? (
        // component banana hai
        <Image
          className="w-[100%] h-[100%]"
          src="https://media.threatpost.com/wp-content/uploads/sites/103/2019/09/26105755/fish-1.jpg"
        />
      ) : showpdf === true ? (
        <PdfViewerModal
          modalOpen={modalOpen}
          pdfUrl={url}
          toggleModal={toggleModal}
          title={"Pdf"}
        />
      ) : showVideo === true ? (
        <VideoPlayer
          className="w-[100%] h-[100%]"
          url="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        />
      ) : (
        ""
      )}
    </Modal>
  ) : (
    <div className="w-full h-screen bg-gray-200 dark:bg-black-900 flex justify-center px-4">
      <div className="w-full mt-4 h-fit bg-white dark:bg-slate-800 rounded-lg">
        <div className="w-full py-4 border-b-[0.5px] mb-8">
          <h3 className="text-base ml-20">General Documents</h3>
        </div>
        <CustomCard
          title={"Draft MOU"}
          fileType={"PDF"}
          ViewTitle={"draftMOU"}
          handleButtonClick={({ fileType = "pdf" }) =>
            handleButtonClick({ fileType })
          }
        />
        <CustomCard
          title={"Introduction to BBN Video"}
          ViewTitle={"bbnIntroVideo"}
          fileType={"MP4"}
          handleButtonClick={({ fileType = "mp4" }) =>
            handleButtonClick({ fileType })
          }
        />
        <CustomCard
          title={"BBN Presentation Deck "}
          fileType={"PDF"}
          ViewTitle={"bbnPreDeck"}
          handleButtonClick={({ fileType = "pdf" }) =>
            handleButtonClick({ fileType })
          }
        />
        <CustomCard
          title={"Node Setup Demo Video"}
          fileType={"MP4"}
          ViewTitle={"nodeDemoVideo"}
          handleButtonClick={({ fileType = "mp4" }) =>
            handleButtonClick({ fileType })
          }
        />
        <CustomCard
          title={"Node Setup Documentation"}
          fileType={"PDF"}
          ViewTitle={"nodeDoc"}
          handleButtonClick={({ fileType = "pdf" }) =>
            handleButtonClick({ fileType })
          }
        />
        <div className="w-full border-b-[0.5px]">
          <Button
            text="upload"
            className="bg-[#1bc5bd] hover:bg-[#1bc5e4] text-white w-fit h-10 items-center pb-2 pt-2 m-4"
          />
        </div>
      </div>
    </div>
  );
};

const CustomCard = ({ title, fileType, ViewTitle, handleButtonClick }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between 2xl:w-1/2  ml-20 my-4 ">
      <div className="w-50 flex items-center">
        <h3 className="text-sm">{title}</h3>
      </div>

      <div className="flex items-center ">
        <h3 className="text-sm px-2">{ViewTitle}</h3>
        <button className="pointer" onClick={handleButtonClick}>
          view
        </button>
        <div className="m-2 flex flex-col">
          <FileUploader />
          <p className="text-xs mt-2"> Only {fileType} format allowed.</p>
        </div>
      </div>
    </div>
  );
};

const FileUploader = () => {
  const hiddenFileInput = useRef(null);
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    const size = event.target.files[0].size;
    if (size / 1024 > 10) alert("size can't exceed 10 mb");
    const fileUploaded = event.target.files[0];
    // console.log("name->", event.target.files[0].name);
    // console.log("type->", event.target.files[0].type);
    // console.log("size->", event.target.files[0].size);
    // console.log(fileUploaded);
  };
  return (
    <>
      <Button 
        text="Browse" 
        className = "btn btn-dark text-white h-10 py-2"
        onClick={handleClick} 
      />
      <input
        type="file"
        className="hidden"
        ref={hiddenFileInput}
        onChange={handleChange}
      />
     </>
   );
};

export default page;
