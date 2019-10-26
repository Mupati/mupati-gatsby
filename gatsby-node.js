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
            frontmatter {
              path
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
    createPage({
      path: frontmatter.path,
      component: path.resolve(`src/templates/post.js`),
      context: {
        postId: id,
      },
    })
  })
}
