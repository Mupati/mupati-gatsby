const { createFilePath } = require(`gatsby-source-filesystem`)
const path = require(`path`)
const axios = require("axios")

const get = endpoint => axios.get(`https://pokeapi.co/api/v2${endpoint}`)
const getPokemonData = names =>
  Promise.all(
    names.map(async name => {
      const { data: pokemon } = await get(`/pokemon/${name}`)
      return { ...pokemon }
    })
  )

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions

  // Create a page that lists Pokémon
  const allPokemon = await getPokemonData(["pikachu", "charizard", "squirtle"])
  createPage({
    path: `/pokemon`,
    component: require.resolve("./src/templates/all-pokemon.js"),
    context: { allPokemon },
  })

  // dogs data page
  const dogData = [
    {
      name: "Fido",
      breed: "Sheltie",
    },
    {
      name: "Sparky",
      breed: "Corgi",
    },
  ]
  dogData.forEach(dog => {
    createPage({
      path: `/dogs/${dog.name}`,
      component: require.resolve(`./src/templates/dog-template.js`),
      context: { dog },
    })
  })

  const posts = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            html
            fields {
              slug
            }
            frontmatter {
              path
              title
              thumbnail
              excerpt
              date
            }
          }
        }
      }
    }
  `)
  if (posts.errors) {
    console.error(posts.error)
  }
  posts.data.allMarkdownRemark.edges.forEach(({ node }) => {
    const { id, frontmatter } = node
    if (node.fields.slug === "/my-first-post/") {
      createPage({
        path: frontmatter.path,
        component: path.resolve(`src/templates/post.js`),
        context: {
          slug: node.fields.slug,
        },
      })
    } else {
      createPage({
        path: `blog${node.fields.slug}`,
        component: path.resolve(`./src/templates/blog-post.js`),
        context: {
          slug: node.fields.slug,
        },
      })
    }
  })

  // const result = await graphql(`
  //   query {
  //     allMarkdownRemark {
  //       edges {
  //         node {
  //           fields {
  //             slug
  //           }
  //         }
  //       }
  //     }
  //   }
  // `)
  // result.data.allMarkdownRemark.edges.forEach(({ node }) => {
  //   createPage({
  //     path: `blog${node.fields.slug}`,
  //     component: path.resolve(`./src/templates/blog-post.js`),
  //     context: {
  //       slug: node.fields.slug,
  //     },
  //   })
  // })
}

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` })
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
}
