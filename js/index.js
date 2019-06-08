import $ from "jquery";

// các cách dùng trong ajax để get data về
// POST : create new one
// PUT : UPDATE
// GET : READ
// DELETE: DELETE

// tạo function thêm tất cả sản phẩm vào trang web
/*
init()=>
render()=>
remove()=>
*/

const addProduct = product => {
    $("tr")
        .not("tr#titleBottom")
        .remove();
    $("table#list").append(
        `<thead>
        <tr id="title">
          <th>STT</th>
          <th>Hình ảnh</th>
          <th>Tên sản phẩm</th>
          <th>Giá</th>
          <th>Giá khuyến mãi</th>
          <th>% khuyến mãi</th>
          <th>Chi tiết sản phẩm</th>
        </tr>
      </thead>
    `
    );
    product.forEach((e, index) => {
        $("table#list").append(
            `
        <tr>
          <td>${index + 1}</td>
          <td><img width="50px" src="${e.img_url}"/></td>
          <td>${e.name}</td>
          <td>${e.price.toLocaleString()}</td>
          <td>${e.final_price.toLocaleString()}</td>
          <td>${e.promotion_percent.toLocaleString()}</td>
          <td><button id="${
            e.id
          }" class="btn btn-danger btn-detail">Chi tiết</button></td>  
        
        </tr>
      `
        );
    });
    $(".btn-detail").click(function(e) {
        const id = $(this).attr("id");
        showDetailProduct(id);
    });
};

//   $("#btn-detail").click(function(e) {
//     const id = $(this).attr("data-id");
//     showDetailProduct(id);
//   });
// });

// $("#btn-detail").click(() => {
//   const id = this.attr("data-id");
//   showDetailProduct(id);
// });

$("p").show();
// tạo dataGlobal ở ngoài function
let dataGlobal;

// tạo hàm get các sản phẩm từ API của Sendo
const dataFromAPI = (url, method) => {
    $.ajax({
            url: url,
            method: method
        })
        .done(result => {
            dataGlobal = result.data;
            if (dataGlobal === undefined) {
                $("p1").show();
                $("tr")
                    .not("tr#titleBottom")
                    .remove();
                console.log("result data === undefined");
            } else {
                addProduct(dataGlobal);
            }
        })
        .catch(error => {
            console.log(error);
        });
};
const getProduct = category => {
    $("p1").hide();
    dataFromAPI(`https://mapi.sendo.vn/mob/product/cat/${category}/?p=1`, "GET");
};
const searchProduct = item => {
    $("p1").hide();
    dataFromAPI(` https://mapi.sendo.vn/mob/product/search?p=1&q=${item}`, "GET");
};
const showDetailProduct = id => {
    $.ajax({
            url: ` https://mapi.sendo.vn/mob/product/${id}/detail/ `,
            method: "GET"
        })
        .done(result => {
            $("tr")
                .not("tr#titleBottom")
                .remove();
            $("table#list").append(
                `<thead>
     <tr id="title">
         <th>Mô tả sản phẩm</th>
      </tr>
    </thead>
    <tr>
      <td>${result.description}</td> 
    </tr>
  `
            );
            $("table#list2").append(
                `
    <tr>
      <th scope="row">SKU sản phẩm</th>
      <td>${result.sku}</td>
    </tr>
    <tr>
      <th scope="row">Giá</th>
      <td>${result.price}</td>
    </tr>
    <tr>
      <th scope="row">Giá khuyến mãi</th>
      <td>${result.final_price.toLocaleString()}</td>
    </tr>
    <tr>
      <th scope="row">% Khuyến mãi</th>
      <td>${result.promotion_percent.toLocaleString()}</td>
    </tr>					
    <tr>
      <th scope="row">Tình trạng</th>
      <td>${result.status_text}</td>
    </tr>
  `
            );
        })
        .catch(error => {
            console.log(error);
        });
};
// gọi hàm thêm tất cả sản phẩm vào trang web
// và gán luôn giá trị get được cho dataGlobal
getProduct("usb");

// tạo hàm sort các giá trị tên và giá
const sortData = (isLowToHigh, value, data) => {
    let resultList = data;
    if (isLowToHigh && value === "price") {
        resultList.sort((a, b) => a[value] - b[value]);
    } else if (!isLowToHigh && value === "price") {
        resultList.sort((a, b) => b[value] - a[value]);
    } else if (isLowToHigh && value === "name") {
        resultList.sort((a, b) =>
            a[value].localeCompare(b[value], "vi", { sensitivity: "base" })
        );
    } else {
        resultList.sort((a, b) =>
            b[value].localeCompare(a[value], "vi", { sensitivity: "base" })
        );
    }
    return resultList;
};
// tạo hàm sort giá trị sale percent
const filterBigSale = (data, sale) => {
    return data.filter(e => e.promotion_percent >= sale);
};

$("#lowToHigh").click(() => {
    const sortedList = sortData(true, "price", dataGlobal);
    addProduct(sortedList);
    // dataGlobal.forEach(e => {
    //   console.log(e["price"]);
    // });
});
$("#highToLow").click(() => {
    const sortedList = sortData(false, "price", dataGlobal);
    addProduct(sortedList);
});
$("#aToZ").click(() => {
    const sortedList = sortData(true, "name", dataGlobal);
    addProduct(sortedList);
});
$("#zToA").click(() => {
    const sortedList = sortData(false, "name", dataGlobal);
    addProduct(sortedList);
});
$("#filterSale").click(() => {
    const sortedList = filterBigSale(dataGlobal, 50);
    addProduct(sortedList);
});
$("#form1").submit(e => {
    e.preventDefault();
    const itemToSearch = $("#form1")
        .find("#search")
        .val();
    searchProduct(itemToSearch);
    //searchProduct(itemToSearch);
});