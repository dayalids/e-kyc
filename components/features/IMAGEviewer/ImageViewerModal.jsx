import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Image from 'next/image';
import BufferLoader from '@/components/ui/ProgressBar/BufferLoader';

const ImageViewerModal = ({ imageUrl, onClose, title }) => {
  const [isModalOpen, setIsModalOpen] = useState(true); // Initial state set to true for demonstration
  const [isLoading, setIsLoading] = useState(true);

  const closeForm = () => {
    setIsModalOpen(false);
    onClose(); // Call the onClose function provided by the parent component
  };

  return (
    <Modal activeModal={isModalOpen} onClose={closeForm} title>
      <div className="image-container">
        {isLoading && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
            <BufferLoader />
          </div>
        )}
        <Image
          src={imageUrl}
          alt="logo"
          width={500}
          height={500}
          onLoadingComplete={() => setIsLoading(false)}
        />
      </div>
    </Modal>
  );
};

export default ImageViewerModal;
