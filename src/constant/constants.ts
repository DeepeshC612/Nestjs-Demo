export const productSelect = [
  'product.id AS id',
  'product.productName AS productName',
  'product.price AS price',
  'product.image AS image',
  'product.description AS description',
  'product.quantity AS quantity',
  'user.id AS userId',
  'user.name AS userName',
  'user.email AS userEmail',
];

export const orderSelect = [
  'product.id AS id',
  'product.productName AS productName',
  'product.price AS price',
  'product.image AS image',
  'product.description AS description',
  'product.quantity AS quantity',
  'product.userId AS userId',
];

export const cartSelect = [
  'cart.id AS id',
  'cart.quantity AS quantity',
  'cart.userId AS userId',
  'cart.productId AS productId',
  'product.productName AS productName',
  'product.description AS description',
  'product.image AS productImage',
  'product.price AS productPrice',
  'product.price * cart.quantity AS totalPrice',
  'product.userId AS sellerId',
  'user.name AS sellerName',
];

export enum EmailType {
  CONFIRMATION = 'confirmation',
  RESETPASSWORD = 'reset-pass'
}

export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user'
}