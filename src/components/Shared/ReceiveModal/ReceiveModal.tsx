import React from 'react';
import { ReactComponent as XIcon } from '../../../assets/X.svg';
import QRCode from 'qrcode.react';

const ReceiveModal = (props: any) => {
  let buttonText = 'Copy';

  const copyToClipboardHandler = () => {
    navigator.clipboard.writeText(props.address);
  };

  return (
    <React.Fragment>
      <div className='flex items-center justify-center fixed left-0 top-0 w-full h-full z-50 bg-opacity-30 bg-gray-600'>
        {/* Modal Box */}
        <div className='w-4/5 h-auto lg:w-1/3 bg-white text-center rounded-lg flex flex-col mx-5 dark:bg-gray-800 dark:text-white'>
          <div className='flex'>
            <button onClick={props.close} className='flex items-end ml-auto color-black h-7 w-7 mt-1'>
              <XIcon className='w-full h-full' />
            </button>
          </div>
          <div className='px-5'>
            <div className='text-xl font-bold'>Receive Funds</div>
            <div className='my-5'>Scan this QR Code or copy the below address to receive funds</div>
            <div className='my-5 flex justify-center'><QRCode value={props.address} /></div>
            <div>
              <div className='inline-block w-4/5 lg:w-9/12 overflow-x-auto my-2'>
                {props.address ? props.address : 'Loading address ...'}
              </div>
              <div className='inline-block w-4/5 lg:w-3/12 pl-5 align-top mb-5'>
                <button onClick={copyToClipboardHandler} className='text-center h-10 bg-blue-400 rounded-lg w-full'>
                  {buttonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ReceiveModal;
