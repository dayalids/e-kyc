import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';

const Terms = ({ onClose, text, title }) => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const closeForm = () => {
    setIsModalOpen(false);
    onClose();
  };
  return (
    <Modal activeModal={isModalOpen} onClose={closeForm} title={title}>
       
      <div className="max-w-4xl mx-auto px-4 h-[60vh] scroll-auto overflow-y-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
        <div className="terms-content">
          <h2 className="text-xl font-semibold mb-2">User Content</h2>
          <p className="mb-4">
           
            Our Application may allow you to post, link, store, share, and
            otherwise make available certain information, text, graphics,
            videos, or other material ("Content"). You are responsible for the
            Content you post to the Application, including its legality,
            reliability, and appropriateness.{' '}
          </p>
          <p className="mb-4">
           
           Our Application may allow you to post, link, store, share, and
           otherwise make available certain information, text, graphics,
           videos, or other material ("Content"). You are responsible for the
           Content you post to the Application, including its legality,
           reliability, and appropriateness.{' '}
         </p>
         <p className="mb-4">
           
           Our Application may allow you to post, link, store, share, and
           otherwise make available certain information, text, graphics,
           videos, or other material ("Content"). You are responsible for the
           Content you post to the Application, including its legality,
           reliability, and appropriateness.{' '}
         </p>
         <p className="mb-4">
           
           Our Application may allow you to post, link, store, share, and
           otherwise make available certain information, text, graphics,
           videos, or other material ("Content"). You are responsible for the
           Content you post to the Application, including its legality,
           reliability, and appropriateness.{' '}
         </p>
         <p className="mb-4">
           
           Our Application may allow you to post, link, store, share, and
           otherwise make available certain information, text, graphics,
           videos, or other material ("Content"). You are responsible for the
           Content you post to the Application, including its legality,
           reliability, and appropriateness.{' '}
         </p>
        
           
        </div>
      </div>
    </Modal>
  );
};

export default Terms;
