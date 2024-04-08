'use client';
import React, { useState } from 'react';
import { ModalHeader, ModalBody, ModalFooter, Button, Modal } from 'reactstrap';
import { Document, Page, pdfjs } from 'react-pdf';
import { Icon } from '@iconify/react';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
import './pdfViewer.css';

const PdfViewerModal = ({ pdfUrl, modalOpen, toggleModal, title }) => {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setCurrentPage(1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <Modal
      isOpen={modalOpen}
      toggle={toggleModal}
      size="md"
      className="fixed inset-2 flex items-center justify-center  scroll-auto"
    >
      <div className="w-[800px]  mx-auto ">
        <div className="bg-slate-700 text-slate-100 justify-center border-top rounded-t-md flex h-8">
          <span className="text-slate-100 flex text-md mx-2 my-auto">
            {title}
          </span>
          <button
            className="text-slate-100 py-auto px-2 ml-auto"
            onClick={toggleModal}
          >
            <Icon icon="material-symbols:close" className="h-7 w-7" />
          </button>
        </div>
        <ModalBody className="h-[100vh] w-[800px] flex border mt-0 dark:bg-slate-600 border-slate-900 flex-wrap border-bottom items-center overflow-hidden scrol-a justify-center backdrop-blur-lg ">
          {pdfUrl ? (
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={console.error}
            >
              <Page
                renderTextLayer={false}
                renderAnnotationLayer={false}
                customTextRenderer={false}
                pageNumber={currentPage}
                loading={
                  <div className="backdrop-blur-lg dark:bg-slate-900 dark:text-white text-slate-900 font-bold">
                    Loading Pages...
                  </div>
                }
                width={800}
              />
            </Document>
          ) : (
            <p className="text-danger-500 font-bold">No Url Found</p>
          )}
        </ModalBody>
        <ModalFooter className="flex justify-end px-6 items-center">
          <Button
            className="text-slate-900 bg-slate-300 py-2 mx-2 w-1/6"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="my-auto font-semibold">
            {currentPage} / {numPages}
          </span>
          <Button
            className="text-slate-900 bg-slate-300 mx-2 py-2 w-1/6"
            onClick={goToNextPage}
            disabled={currentPage === numPages}
          >
            Next
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
};

export default PdfViewerModal;
