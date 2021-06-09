import React from "react";

const Error401 = () => {
  return (
    <div className="pt-5 my-auto text-center">
      <i className="fas fa-ban fa-10x mb-3" />
      <h1 className="errorCode">401</h1>
      <h2>Page not found</h2>
      <br />
      <p>Sorry, your request could not be processed.</p>
    </div>
  );
};

export default Error401;
