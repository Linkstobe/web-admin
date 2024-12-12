import { getCookie } from "@/lib/auth";
import ProductsContent from "./products-content";
import { IProject } from "@/interfaces/IProjects";
import { IProduct } from "@/interfaces/IProducts";
import { IMetric } from "@/interfaces/IMetrics";
import { ITransaction } from "@/interfaces/ITransactions";

export default async function Products () {
  const token = getCookie("authToken")

  let productAccessMetrics: IMetric[] = []
  let productClicksMetrics: IMetric[] = []

  let allProducts: IProduct[] = []
  let allTransactions: ITransaction[] = []
  let allProjects: IProject[] = []

  try {
    const projectsUrl = `${process.env.NEXT_PUBLIC_API_URL}/projects`;
    const productsUrl = `${process.env.NEXT_PUBLIC_API_URL}/products`;
    const metricsUrl = `${process.env.NEXT_PUBLIC_API_URL}/metrics`;
    const transactionsUrl = `${process.env.NEXT_PUBLIC_API_URL}/transactions`;

    const productAccessMetricsUrl = `${process.env.NEXT_PUBLIC_API_URL}/metrics/type/view:product`
    const carouselProductClickMetricsUrl = `${process.env.NEXT_PUBLIC_API_URL}/metrics/type/click:panel-Carrossel`
    const blockProductClicksMetricsUrl = `${process.env.NEXT_PUBLIC_API_URL}/metrics/type/click:panel-Bloco`
    const galeryProductClicksMetricsUrl = `${process.env.NEXT_PUBLIC_API_URL}/metrics/type/click:panel-Galeria`

    const [
      projectsResponse,
      productsResponse,
      // metricsResponse,
      transactionsResponse,
      carouselProductClicksResponse,
      blockProductClicksResponse,
      galeryProductClicksResponse,
      productAccessResponse
    ] = await Promise.all([
      fetch(projectsUrl, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch(productsUrl, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      // fetch(metricsUrl, {
      //   headers: { Authorization: `Bearer ${token}` }
      // }),
      fetch(transactionsUrl, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch(carouselProductClickMetricsUrl, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch(blockProductClicksMetricsUrl, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch(galeryProductClicksMetricsUrl, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch(productAccessMetricsUrl, {
        headers: { Authorization: `Bearer ${token}` }
      }),
    ])

    const requestFailed = 
      !projectsResponse.ok || 
      !productsResponse.ok || 
      // !metricsResponse.ok || 
      !transactionsResponse.ok ||
      !carouselProductClicksResponse.ok ||
      !blockProductClicksResponse.ok ||
      !galeryProductClicksResponse.ok ||
      !productAccessResponse.ok

    if (requestFailed) {
      throw new Error("Falha em uma ou mais requisições");
    }

    const [projects, products, carouselProductClicks, blockProductClicks, galeryProductClicks, productAccess, transactions]: 
      [IProject[], IProduct[], IMetric[], IMetric[], IMetric[], IMetric[], ITransaction[]] = await Promise.all([
      projectsResponse.json(),
      productsResponse.json(),
      // metricsResponse.json(),
      carouselProductClicksResponse.json(),
      blockProductClicksResponse.json(),
      galeryProductClicksResponse.json(),
      productAccessResponse.json(),
      transactionsResponse.json(),
    ])

    allProjects = projects
    allProducts = products
    allTransactions = transactions
    productAccessMetrics = productAccess
    productClicksMetrics = [...carouselProductClicks, ...blockProductClicks, ...galeryProductClicks]

    // metrics.forEach((metric) => {
    //   const { link_type } = metric

    //   const isProductClickMetric = 
    //     link_type.startsWith("click:panel-Carrossel") ||
    //     link_type.startsWith("click:panel-Galeria") ||
    //     link_type.startsWith("click:panel-Bloco")

    //   const isProductAccessMetric = link_type.startsWith("view:product")
      
    //   if (isProductAccessMetric) {
    //     productAccessMetrics.push(metric)
    //   } else if (isProductClickMetric) {
    //     productClicksMetrics.push(metric)
    //   }
    // })


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