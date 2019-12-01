document.querySelector("#submit").addEventListener("click", async () => {
  let u_name = document.querySelector("#university-name");
  let c_name = document.querySelector("#campus-name");
  let f_name = document.querySelector("#faculty-name");
  let review = document.querySelector("#review");

  if (!f_name.value || !review.value) {
    alert("Please enter the required fields");
    return;
  } else {
    u_name = u_name.value || "";
    c_name = c_name.value || "";
    f_name = f_name.value || "";
    review = review.value || "";

    const data = { u_name, c_name, f_name, review };
    console.log(data);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };

    const response = await fetch("/reviewData", options);
    const json = await response.json();
    console.log(json);

    document.querySelector("form").reset();
  }
});

document
  .querySelector("#display-reviews")
  .addEventListener("click", async () => {
    document.querySelector("#actually-display-reviews").textContent = "";
    let div;
    let rev = [];
    let reviewFinal = {};

    document.querySelector("#loading").style.display = "block";
    const data = await fetch("/receivingReviews");
    const reviewData = await data.json();

    let revHeadings = [
      "Serial Number",
      "University Name",
      "Campus Name",
      "Faculty Name",
      "Review"
    ];
    for (let i in reviewData) {
      for (let j in reviewData[i]) {
        div = document.createElement("div");
        div.className = "reviews";
        rev.push(reviewData[i][j]);
      }
      for (let j in revHeadings) {
        reviewFinal[revHeadings[j]] = rev[j];
      }
      // console.log(reviewFinal);
      div.textContent = JSON.stringify(reviewFinal);
      document.querySelector("#loading").style.display = "none";
      document.querySelector("#actually-display-reviews").appendChild(div);
      rev = [];
      oldData = reviewFinal;
    }
  });
