import Swal from 'sweetalert2';

export const showSuccess = (message: string) => {
  return Swal.fire({
    icon: 'success',
    title: 'Thành công',
    text: message,
    confirmButtonColor: '#2563eb'
  });
};

export const showError = (message: string) => {
  return Swal.fire({
    icon: 'error',
    title: 'Lỗi',
    text: message,
    confirmButtonColor: '#dc2626'
  });
};

export const showConfirm = (message: string) => {
  return Swal.fire({
    title: 'Xác nhận',
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#2563eb',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Đồng ý',
    cancelButtonText: 'Hủy'
  });
};