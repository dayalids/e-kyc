import React from 'react';
import QRCode from 'react-qr-code';

const QRcode = ({ text }) => {
	return <QRCode value={text || 'enter your text here'} />;
};

export default QRcode;
