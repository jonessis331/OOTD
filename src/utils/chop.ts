export function extractProductInfo(data: any): any {
  const productInfo: any = {};
  
  // Extract name/title
  if (data.json-ld && data.json-ld.length > 0) {
    const product = data.json-ld.find((item: any) => item["@type"] === "Product");
    if (product) {
      productInfo.name = product.name;
      productInfo.color = product.color;
      if (product.brand) productInfo.brand = product.brand.name;
    }
  }
  
  // Extract description from opengraph and dublincore
  if (data.opengraph && data.opengraph.length > 0) {
    const ogInfo = data.opengraph.find((item: any) => item["@type"] === "ebay-objects:item");
    if (ogInfo) {
      productInfo.ogTitle = ogInfo["og:title"];
      productInfo.ogDescription = ogInfo["og:description"];
      productInfo.ogImage = ogInfo["og:image"];
    }
  }
  
  if (data.dublincore && data.dublincore.length > 0) {
    const dcDescription = data.dublincore[0].elements.find((item: any) => item.name === "description");
    if (dcDescription) {
      productInfo.dcDescription = dcDescription.content;
    }
  }
  
  // Extract offers and pricing info
  if (data.json-ld && data.json-ld.length > 0) {
    const product = data.json-ld.find((item: any) => item["@type"] === "Product");
    if (product && product.offers) {
      productInfo.price = product.offers.price;
      productInfo.priceCurrency = product.offers.priceCurrency;
      productInfo.availability = product.offers.availability;
      productInfo.itemCondition = product.offers.itemCondition;
    }
  }
  
  return productInfo;
}

// Example data
const jsonData = {
  // your JSON data here
};

const productDetails = extractProductInfo(jsonData);
console.log(productDetails);
