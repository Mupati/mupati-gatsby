import React from "react"
import Layout from "../components/layout"

export default ({ pageContext: { dog } }) => (
  <Layout>
    <section>
      {dog.name} - {dog.breed}
    </section>
  </Layout>
)
