import { getCookie } from "@/lib/auth";
import ProductsContent from "./products-content";
import { IProject } from "@/interfaces/IProjects";
import { IProduct } from "@/interfaces/IProducts";
import { IMetric } from "@/interfaces/IMetrics";
import { ITransaction } from "@/interfaces/ITransactions";

export default async function Products () {
  const token = getCookie("authToken")

  const productAccessMetrics: IMetric[] = []
  const productClicksMetrics: IMetric[] = []

  let allProducts: IProduct[] = []
  let allTransactions: ITransaction[] = []
  let allProjects: IProject[] = []

  try {
    const projectsUrl = `${process.env.NEXT_PUBLIC_API_URL}/projects`;
    const productsUrl = `${process.env.NEXT_PUBLIC_API_URL}/products`;
    const metricsUrl = `${process.env.NEXT_PUBLIC_API_URL}/metrics`;
    const transactionsUrl = `${process.env.NEXT_PUBLIC_API_URL}/transactions`;

    const [
      projectsResponse,
      productsResponse,
      metricsResponse,
      transactionsResponse,
    ] = await Promise.all([
      fetch(projectsUrl, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch(productsUrl, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch(metricsUrl, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch(transactionsUrl, {
        headers: { Authorization: `Bearer ${token}` }
      }),
    ])

    const requestFailed = 
      !projectsResponse.ok || 
      !productsResponse.ok || 
      !metricsResponse.ok || 
      !transactionsResponse.ok

    if (requestFailed) {
      throw new Error("Falha em uma ou mais requisições");
    }

    const [projects, products, metrics, transactions]: [IProject[], IProduct[], IMetric[], ITransaction[]] = await Promise.all([
      projectsResponse.json(),
      productsResponse.json(),
      metricsResponse.json(),
      transactionsResponse.json(),
    ])

    allProjects = projects
    allProducts = products
    allTransactions = transactions

    metrics.forEach((metric) => {
      const { link_type } = metric

      const isProductClickMetric = 
        link_type.startsWith("click:panel-Carrossel") ||
        link_type.startsWith("click:panel-Galeria") ||
        link_type.startsWith("click:panel-Bloco")

      const isProductAccessMetric = link_type.startsWith("view:product")
      
      if (isProductAccessMetric) {
        productAccessMetrics.push(metric)
      } else if (isProductClickMetric) {
        productClicksMetrics.push(metric)
      }
    })


  } catch (error) {
    console.log("Products: ", error)
  }

  return (
    <ProductsContent 
      products={allProducts}
      projects={allProjects}
      transactions={allTransactions}
      productAccessMetrics={productAccessMetrics}
      productClicksMetrics={productClicksMetrics}
    />
  )
}