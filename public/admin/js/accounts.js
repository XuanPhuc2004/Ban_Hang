const deleteButtons = document.querySelectorAll(".btn-delete-account");
const deleteForm = document.getElementById("form-delete-account");

deleteButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.getAttribute("data-id");

    if (confirm("Bạn có chắc muốn xóa tài khoản này không?")) {
      deleteForm.action = `/admin/accounts/delete/${id}?_method=DELETE`;
      deleteForm.submit();
    }
  });
});
