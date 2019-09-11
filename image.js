import React from "react"

const Image = (settings) => {
  console.log({ settings });
  return (<div dangerouslySetInnerHTML={{ __html: settings.image.tag }} />)
};
export default Image;
