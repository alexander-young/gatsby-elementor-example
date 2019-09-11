import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

import Image from '../components/image'

const components = {
  Image: Image
}

function ucwords(text) {
  let str = text.toLowerCase();
  return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
    function (s) {
      return s.toUpperCase();
    });
};

const BlogPostTemplate = (data) => {
  {
    console.log({data});

    const elementorData = data.pageContext.modifiedData;
    
    const Page = elementorData.map(row => {
      return (
        <div key={row.id} className="row">
          {
            row.elements.map(column => {
              return (
                <div key={column.id} className={`col-${column.settings._column_size}`}>
                  {
                    column.elements.map(widget => {
                      return (
                        React.createElement(
                          components[ucwords(widget.widgetType)],
                          {
                            ...widget.settings,
                            key: widget.id
                          }
                        )
                      )
                    })
                  }
                </div>
              )
            })
          }
        </div>
      )
    })
    return (
      <Layout>{Page}</Layout>
    )
  }
}

export default BlogPostTemplate
