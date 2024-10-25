
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrapeProduct") {
    const productData = request.data;
    console.log("Scraped product data:", productData);
    const apiUrl = "http://localhost:3000/api/products";

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData), 
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        sendResponse({ status: "success", data: data });
        chrome.runtime.sendMessage({
          action: "displayProduct",
          data: productData,
        });
      })
      .catch((error) => {
        console.error("Error:", error);

       
        sendResponse({ status: "error", message: error.toString() });
      });


    return true;
  }
});

