import React from "react";

const Loading = () => {
  return (
    <div className="p-5 mb-4">
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ height: "500px" }}
      >
        <div className="p-2 bd-highlight col-example">
          <i className="fas fa-spinner fa-pulse fa-7x"></i>
          <h3 className="pt-3">Loading...</h3>
        </div>
      </div>
    </div>
  );
};

export default Loading;
