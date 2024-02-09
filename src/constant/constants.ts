export const productSelect = [
  'product.id AS id',
  'product.productName AS productName',
  'product.price AS price',
  'product.image AS image',
  'product.description AS description',
  'user.id AS userId',
  'user.name AS userName',
  'user.email AS userEmail',
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


export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user'
}