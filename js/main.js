/********************************************************************************
* WEB422 – Assignment 2
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Khiet Van Phan Student ID: 147072235 Date: 28th May, 2025
*
* Published URL: https://github.com/khietvan123/WEB422_A2
*
********************************************************************************/

let page = 1;
const perPage = 10;
let searchName = null;

function loadListingsData() {
  console.log("loadlistingsData")
    const url = searchName ?
    `https://web-422-a1-rosy.vercel.app/api/listings?page=${page}&perPage=${perPage}&name=${searchName}`:
    `https://web-422-a1-rosy.vercel.app/api/listings?page=${page}&perPage=${perPage}`;

    fetch(url)
    .then(res => {
      console.log(res);
      return res.ok ? res.json() : Promise.reject(res.status);
    })
    .then(data => {
      //console.log(data);
    if(data.length){
        const rows = data.map(listing => `
          <tr data-id="${listing._id}">
            <td>${listing.name}</td>
            <td>${listing.room_type}</td>
            <td>${listing.address?.street || "No address"}</td>
            <td>
              ${listing.summary || "No summary"}<br><br>
              <strong>Accommodates:</strong> ${listing.accommodates}<br>
              <strong>Rating:</strong> ${listing.review_scores?.review_scores_rating || "N/A"} (${listing.number_of_reviews} Reviews)
            </td>
          </tr>
        `).join("");
        tbody = document.querySelector('tbody');
        tbody.innerHTML = rows;
        document.getElementById("current-page").textContent = page;
         document.querySelectorAll("#listingsTable tbody tr").forEach(row => {
          row.addEventListener("click", () => {
            const id = row.getAttribute("data-id");

            fetch(`https://web-422-a1-rosy.vercel.app/api/listings/${id}`)
              .then(res => res.ok ? res.json() : Promise.reject(res.status))
              .then(details => {
                const detailName = document.querySelector("#detailsModal .modal-title");
                const modalBody = document.querySelector("#detailsModal .modal-body");

                detailName.textContent = details.name;
                modalBody.innerHTML = `
                  <img 
                    id="photo" 
                    onerror="this.onerror=null;this.src='https://placehold.co/600x400?text=Photo+Not+Available'" 
                    class="img-fluid w-100" 
                    src="${details.images?.picture_url || 'https://placehold.co/600x400?text=Photo+Not+Available'}"><br><br>
                  ${details.neighborhood_overview || "No neighborhood overview"}<br><br>
                  <strong>Price:</strong> ${parseFloat(details.price).toFixed(2)}<br>
                  <strong>Room:</strong> ${details.room_type}<br>
                  <strong>Bed:</strong> ${details.bed_type} (${details.beds})
                `;
                const modal = new bootstrap.Modal(document.getElementById("detailsModal"));
                modal.show();
              })
              .catch(() => {
                alert("Failed to load listing details.");
              });
          });
        });


    }else{
        if (page > 1) {
          page--;
        } else {
          tbody.innerHTML = `<tr><td colspan="4"><strong>No data available</strong></td></tr>`;
        }
        document.getElementById("current-page").textContent = page;
    }
    }).catch(err => {
        const tbody = document.querySelector("#listingsTable tbody");
        if (page > 1) {
            page--;
        } else {
            tbody.innerHTML = `<tr><td colspan="4"><strong>No data available</strong></td></tr>`;
        }
        document.getElementById("current-page").textContent = page;
    });


}

document.addEventListener("DOMContentLoaded",()=>{
  loadListingsData();

  const previousPageButton = document.querySelector("#previous-page");
  const nextPageButton = document.querySelector("#next-page");
  //const searchForm = document.querySelector("#searchForm");
  const clearForm = document.querySelector("#clearForm");
  previousPageButton.addEventListener("click",()=>{
    if(page>1){
      page--;
      loadListingsData();
    }
  });

  nextPageButton.addEventListener("click",()=>{
    page++;
    loadListingsData();
  });

  // searchForm.addEventListener("submit",(event)=>{
  //   event.preventDefault();
  //   searchName = document.getElementById("name").value;
  //   page = 1;
  //   loadListingsData();
  // });
  document.getElementById("searchForm").addEventListener("submit",(e)=>{
    e.preventDefault();
    searchName = document.getElementById("name").value;
    page = 1;
    console.log(searchName);
    loadListingsData();
  });

  clearForm.addEventListener("click",()=>{
    document.getElementById("name").value = ""; //empty string
    searchName = null;
    loadListingsData();
  });
});