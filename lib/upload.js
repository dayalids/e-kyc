import axios from 'axios';
import { toast } from 'react-toastify';

const UploadGetPreSignedUrl = async ({ file, uploadFileMutation }) => {
  // const fileName = file.name;
  const fileType = file?.type.split('/')[1];
  const fileName = fileType === 'png' || fileType === 'jpeg' ? 'Image' : 'Doc';

  if (
    fileType === 'png' ||
    fileType === 'jpeg' ||
    fileType === 'pdf' ||
    fileType === 'doc' ||
    fileType === 'docx'
  ) {
    const currentTimestamp = Date.now().toString();
    try {
      const presignedUrlResponse = await uploadFileMutation({
        variables: {
          input: {
            key: `${fileName}${currentTimestamp}.${fileType}`,
            fileType: fileType,
          },
        },
      });
      const { key, url } = presignedUrlResponse.data.putObjectPresignedUrl;
      // console.log('key->', key, 'url->', url);
      return { key, url };
    } catch (error) {
      console.error('Error uploading file:', error.message);
      toast.error('Something went wrong');
    }
  } else {
    toast.error(`${fileType} is not valid`);
  }
  return null;
};

export default UploadGetPreSignedUrl;

export const HandleUpload = async ({ url, type, file }) => {
  console.log('preassignedurl', url);
  try {
    const response = await axios.put(url, file, {
      headers: {
        'Content-Type': type,
      },
    });

    return 200;
  } catch (error) {
    console.error('Error uploading file:', error);
    toast.error('Something went wrong....');
    if (error?.response) {
      return error.response?.status;
    } else {
      // If no response status is available, return a generic error status code
      return 500;
    }
  }
};
