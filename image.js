import React from "react"
import Img from "gatsby-image"

const Image = (settings) => {
  // console.log({ settings });
  console.log(settings.image.fluid);
  // return (<div dangerouslySetInnerHTML={{ __html: settings.image.tag }} />)
  // return (<Img fluid={settings.image.fluid} />)
  return (<Img fluid={settings.image.fluid} />)
};
export default Image;
