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


export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user'
}