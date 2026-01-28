// button status 
const buttonStatus = document.querySelectorAll("[button-status]");
if(buttonStatus.length > 0) {
  let url = new URL(window.location.href);
  // console.log(url);

  buttonStatus.forEach(button => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status");
      
      if(status) {
        url.searchParams.set("status", status);
      } else {
        url.searchParams.delete("status");
      }
      // console.log(url.href);
      window.location.href = url.href;
    });
  });
}


// form search 
const formSearch = document.querySelector("#form-search");
if(formSearch) {
  let url = new URL(window.location.href);

  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    const keyword = e.target.elements.keyword.value
    
    if(keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }
    
    window.location.href = url.href;
  })
}

// pagination
const buttonPagination = document.querySelectorAll("[button-pagination]");
if(buttonPagination) {
  let url = new URL(window.location.href);

  buttonPagination.forEach(button => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");

      url.searchParams.set("page", page);
      window.location.href = url.href;
    });
  });
}


// checkbox multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if(checkboxMulti) {
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
  const inputId = checkboxMulti.querySelectorAll("input[name='id']");

  inputCheckAll.addEventListener("click", () => {
    if(inputCheckAll.checked) {
      inputId.forEach(input => {
        input.checked = true;
      })
    } else {
      inputId.forEach(input => {
        input.checked = false;
      });
    }
  });

  inputId.forEach(input => {
    input.addEventListener("click", () => {
      const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;
      if(countChecked == inputId.length) {
        inputCheckAll.checked = true;
      } else {
        inputCheckAll.checked = false;
      }
    });
  });
}

// form change multi
const formchangeMulti = document.querySelector("[form-change-multi]");
if(formchangeMulti) {
  formchangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const checkboxMulti = document.querySelector("[checkbox-multi]");
    const inputChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");

    const typeChange = e.target.elements.type.value;
    if(typeChange == "delete-all") {
      const isConfirm = confirm("Bạn có chắc muốn xóa những sản phẩm này");
      
      if(!isConfirm) {
        return;
      }
    } 

    if(inputChecked.length > 0) {
      let ids = [];
      const inputIds = formchangeMulti.querySelector("input[name='ids']");

      inputChecked.forEach(input => {
        const id = input.getAttribute("value");

        if(typeChange == "change-position"){
          const position = input.closest("tr").querySelector("input[name='position']").value;
          
          ids.push(`${id}-${position}`);

        } else {
          ids.push(id);
        }
      });

      inputIds.value = ids.join(", ");
      formchangeMulti.submit();
    } else {
      alert("Vui long chon it nhat 1 ban ghi");
    }
  });
}

// show alert
const showAlert = document.querySelector("[show-alert]");

if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time")) || 3000;
  const closeAlert = showAlert.querySelector("[close-alert]");

  const hideAlert = () => {
    showAlert.classList.add("alert-hidden");
  };

  setTimeout(hideAlert, time);

  if (closeAlert) {
    closeAlert.addEventListener("click", hideAlert);
  }
}

// upload preview ảnh
const uploadImage = document.querySelector("[upload-image]");
if(uploadImage) {
  const uploadImageinput = document.querySelector("[upload-image-input]");
  const uploadImagepreview = document.querySelector("[upload-image-preview]");

  uploadImageinput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if(file) {
      uploadImagepreview.src = URL.createObjectURL(file);
    }
  });
}