const path = require(`path`)
const React = require('react')
const ReactDOMServer = require('react-dom/server')
const { createRemoteFileNode } = require(`gatsby-source-filesystem`)
const { fluid } = require(`gatsby-plugin-sharp`)
const Img = require(`gatsby-image`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  const blogPostTemplate = path.resolve(`src/templates/blog-post.js`)
  return graphql(`
    query PostsQuery {
      wordPress {
        posts {
          nodes {
            title
            id
            slug
            uri
            elementorData
          }
        }
      }
    }
  `, { limit: 1000 }).then(result => {
      if (result.errors) {
        throw result.errors
      }
      // Create blog post pages.
      result.data.wordPress.posts.nodes.forEach(edge => {
        createPage({
          path: `${edge.uri}`,
          component: blogPostTemplate,
          context: edge,
        })
      })
    })
}

exports.onCreateNode = async ({
  node,
  actions,
  store,
  cache,
  createNodeId,
  reporter,
}) => {

  const { createNode, deletePage, createPage } = actions;

  if (node.internal.type === 'SitePage') {

    if (node.context && node.context.elementorData) {

      if (!node.context.modified) {

        let elementorData = JSON.parse(node.context.elementorData);

        if (elementorData) {

          deletePage(node)

          async function downloadImages() {
            for (let row of elementorData) {
              for (let column of row.elements) {
                for (let widget of column.elements) {
                  if (widget.widgetType === 'image') {
                    let fileNode = await createRemoteFileNode({
                      url: widget.settings.image.url,
                      parentNodeId: node.id,
                      store,
                      cache,
                      createNode,
                      createNodeId: id => `elementor-images-${widget.id}`,
                    })
                    let generatedImage = await generateImage({
                      fileNode,
                      cache,
                      reporter,
                    })
                    widget.settings.image.tag = generatedImage
                  }
                }
              }
            }
          }

          const generateImage = async function ({
            fileNode,
            cache,
            reporter,
          }) {

            if (!fileNode || !fileNode.absolutePath) return

            let fluidResult = await fluid({
              file: fileNode,
              args: {
                maxWidth: 768,
                toFormat: 'WEBP'
              },

              reporter,
              cache,
            })

            let fluidResultWebp = await fluid({
              file: fileNode,
              args: {
                maxWidth: 768,
                toFormat: 'WEBP',

              },
              reporter,
              cache,
            })

            if (!fluidResult) return

            fluidResult.srcSetWebp = fluidResultWebp.srcSet

            const imgOptions = {
              fluid: fluidResult,
              style: {
                maxWidth: "100%"
              },
              critical: true,
              // fadeIn: true,
              imgStyle: {
                opacity: 1
              }
            }
            const ReactImgEl = React.createElement(Img.default, imgOptions, null)

            return ReactDOMServer.renderToString(ReactImgEl)

          }

          await downloadImages().then((fileNode) => {

            createPage({
              ...node,
              context: {
                ...node.context,
                modifiedData: elementorData,
                modified: true
              }

            })
          })

        }
      }
    }
  }
};
