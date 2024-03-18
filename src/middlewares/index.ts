import { ProductCheck } from './checkProductUserMiddleware';
import { QuantityCheck } from './checkQuantityMiddleware';
import { EmptyCartCheck, CartProductCheck } from './emptyCartUserMiddleware';
import { UserExistsCheck } from "./checkUserExistsMiddleware";
import { ProductQuantityCheck } from "./checkProductQuantity";

export default {
  ProductCheck,
  QuantityCheck,
  EmptyCartCheck,
  CartProductCheck,
  UserExistsCheck,
  ProductQuantityCheck
};
