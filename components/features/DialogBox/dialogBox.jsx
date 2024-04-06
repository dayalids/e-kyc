import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';

const DialogBoxModal = ({ title, description, modalOpen, closeModal }) => {
  return (
    <Modal activeModal={modalOpen} onClose={closeModal} title={title}>
      <div className="">
        <p>{description}</p>
      </div>
    </Modal>
  );
};

export default DialogBoxModal;
