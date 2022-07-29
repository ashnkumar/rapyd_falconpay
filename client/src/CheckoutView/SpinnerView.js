import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { TailSpin } from  'react-loader-spinner'


export default function SpinnerView({text}) {
  return (
    <ReactModal 
      ariaHideApp={false}
      isOpen={true}
      closeTimeoutMS={500}
      className="tripdiv loading"
      overlayClassName="myoverlay"
      >
      <div className="spinnerdiv">
      <TailSpin
          height="100"
          width="100"
          color="purple"
          ariaLabel="tail-spin-loading"
          radius="1"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
      <div className="loadingtext">{text}</div>
    </ReactModal>    

    // <div className="tripdiv loading">
    //   <div className="spinnerdiv">
    //   <TailSpin
    //       height="100"
    //       width="100"
    //       color="purple"
    //       ariaLabel="tail-spin-loading"
    //       radius="1"
    //       wrapperStyle={{}}
    //       wrapperClass=""
    //       visible={true}
    //     />
    //   </div>
    //   <div className="loadingtext">{text}</div>
    // </div>   
  )
}