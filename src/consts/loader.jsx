import React, { useState, useEffect } from 'react';
import Loader from 'react-js-loader';

const LoaderComponent = () => {
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState("black");

  useEffect(() => {
    // Simulate a data fetching operation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      <style jsx>{`
        .loader-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.8);
          z-index: 9999;
        }
      `}</style>
      {loading ? (
        <div className="loader-overlay">
          <Loader type="bubble-scale" bgColor={color} color={color} size={70} />
          {/* <Loader type="box-up" bgColor={color} color={color} size={50} />
          <Loader type="bubble-top" bgColor={color} color={color} size={50} />
          <Loader type="spinner-cub" bgColor={color} color={color} size={50} />
          <Loader type="spinner-circle" bgColor={color} color={color} size={50} />
          <Loader type="bubble-ping" bgColor={color} color={color} size={50} />
          <Loader type="box-rectangular" bgColor={color} color={color} size={50} />
          <Loader type="bubble-loop" bgColor={color} color={color} size={50} />
          <Loader type="ping-cube" bgColor={color} color={color} size={50} /> */}



        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default LoaderComponent;
