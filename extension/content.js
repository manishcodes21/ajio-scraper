
function scrapeProductData() {
  const productId = window.location.pathname.split("/").pop();
  // console.log("Hi")
  
  const brandName = document.querySelector("h2.brand-name")?.innerText || "";
  const productName = document.querySelector("h1.prod-name")?.innerText || "";

 
  const productSp =
    parseFloat(
      document.querySelector(".prod-sp")?.innerText.replace(/[^\d.-]/g, "")
    ) || 0;

  
  let productMrp = parseFloat(
    document.querySelector(".prod-cp")?.innerText.replace(/[^\d.-]/g, "")
  );
  if (isNaN(productMrp) || productMrp === null) {
    productMrp = productSp; 
    console.log("working")
  }

  
  let productDiscount = document
    .querySelector(".prod-discnt")
    ?.innerText.match(/\d+%/)?.[0];
  if (!productDiscount) {
    productDiscount = "0%";
  }


  const breadcrumbs =
    Array.from(document.querySelectorAll(".breadcrumb-list"))
      .map((crumb) => crumb.innerText)
      .join(" > ") || "";

 
  const imageUrl =
    document.querySelector(".rilrtl-lazy-img.rilrtl-lazy-img-loaded")?.src ||
    "";

  const siteId = 1;

  return {
    productId,
    productName,
    productMrp, 
    productSp,
    productDiscount, 
    breadcrumbs,
    imageUrl,
    brandName,
    siteId,
    updatedAt: new Date().toISOString(),
  };
}

const productData = scrapeProductData();
if (productData.productId) {
  chrome.runtime.sendMessage({ action: "scrapeProduct", data: productData });
}
