/**
 * Shop API Endpoints
 *
 * All shop-related API calls (customer-facing)
 * Backend base: /v1/shop
 */

import { apiClient } from '../client/axios';
import { env } from '@/config/env';
import type {
  Cart,
  AddToCartRequest,
  UpdateCartItemRequest,
} from '@/types/dto/cart.dto';
import type {
  GetProductsParams,
  ProductGroup,
  ProductListItem,
  Category,
} from '@/types/dto/product-catalog.dto';
import type {
  CustomerLoginRequest,
  CustomerRegisterRequest,
  CustomerAuthResponse,
  CustomerRegisterResult,
  VerifyEmailRequest,
  ResendOtpRequest,
} from '@/types/dto/shop-auth.dto';
import type {
  CheckoutRequest,
  Order,
  OrderSummary,
  RazorpayOrderResponse,
  VerifyPaymentRequest,
} from '@/types/dto/order.dto';
import type {
  Address,
  CreateAddressRequest,
  UpdateAddressRequest,
} from '@/types/dto/address.dto';
import type {
  WishlistItem,
} from '@/types/dto/wishlist.dto';
import type {
  ProductReviewsResponse,
  CreateReviewRequest,
  Review,
} from '@/types/dto/review.dto';

const BASE = `${env.apiVersion}/shop`;

export const shopApi = {
  // ============================================================================
  // CUSTOMER AUTH
  // ============================================================================

  /**
   * Customer Login
   * POST /v1/shop/auth/login
   */
  login: (data: CustomerLoginRequest) =>
    apiClient.post<CustomerAuthResponse>(`${BASE}/auth/login`, data),

  /**
   * Customer Register (returns email + uuid, no tokens — OTP verification required)
   * POST /v1/shop/auth/register
   */
  register: (data: CustomerRegisterRequest) =>
    apiClient.post<CustomerRegisterResult>(`${BASE}/auth/register`, data),

  /**
   * Verify Email with OTP
   * POST /v1/shop/auth/verify-email
   */
  verifyEmail: (data: VerifyEmailRequest) =>
    apiClient.post<CustomerAuthResponse>(`${BASE}/auth/verify-email`, data),

  /**
   * Resend OTP
   * POST /v1/shop/auth/resend-otp
   */
  resendOtp: (data: ResendOtpRequest) =>
    apiClient.post(`${BASE}/auth/resend-otp`, data),

  /**
   * Customer Logout
   * POST /v1/shop/auth/logout
   */
  logout: () =>
    apiClient.post(`${BASE}/auth/logout`),

  /**
   * Refresh Token
   * POST /v1/shop/auth/refresh
   */
  refresh: (refreshToken: string) =>
    apiClient.post<CustomerAuthResponse>(`${BASE}/auth/refresh`, { refreshToken }),

  /**
   * Get Current Customer
   * GET /v1/shop/auth/me
   */
  getMe: () =>
    apiClient.get<CustomerAuthResponse['customer']>(`${BASE}/auth/me`),

  /**
   * Update Customer Profile
   * PUT /v1/shop/auth/me
   */
  updateProfile: (data: { name?: string; phone?: string }) =>
    apiClient.put<CustomerAuthResponse['customer']>(`${BASE}/auth/me`, data),

  /**
   * Change Password
   * POST /v1/shop/auth/change-password
   */
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.post(`${BASE}/auth/change-password`, data),

  // ============================================================================
  // BROWSING (Public)
  // ============================================================================

  /**
   * Get Products
   * GET /v1/shop/products
   */
  getProducts: (params?: GetProductsParams) =>
    apiClient.get<{ products: ProductListItem[]; meta: any }>(`${BASE}/products`, { params }),

  /**
   * Get Product by Slug
   * GET /v1/shop/products/:slug
   */
  getProductBySlug: (slug: string) =>
    apiClient.get<ProductGroup>(`${BASE}/products/${slug}`),

  /**
   * Get Categories
   * GET /v1/shop/categories
   */
  getCategories: () =>
    apiClient.get<Category[]>(`${BASE}/categories`),

  /**
   * Get Featured Products
   * GET /v1/shop/featured
   */
  getFeatured: () =>
    apiClient.get<ProductListItem[]>(`${BASE}/featured`),

  /**
   * Get Banners
   * GET /v1/shop/banners
   */
  getBanners: () =>
    apiClient.get<any[]>(`${BASE}/banners`),

  /**
   * Get Active Offers
   * GET /v1/shop/offers/active
   */
  getActiveOffers: () =>
    apiClient.get<any[]>(`${BASE}/offers/active`),

  // ============================================================================
  // CART
  // ============================================================================

  /**
   * Get Cart
   * GET /v1/shop/cart
   */
  getCart: () =>
    apiClient.get<Cart>(`${BASE}/cart`),

  /**
   * Add to Cart
   * POST /v1/shop/cart/items
   */
  addToCart: (data: AddToCartRequest) =>
    apiClient.post<Cart>(`${BASE}/cart/items`, data),

  /**
   * Update Cart Item
   * PUT /v1/shop/cart/items/:variantUuid
   */
  updateCartItem: (variantUuid: string, data: UpdateCartItemRequest) =>
    apiClient.put<Cart>(`${BASE}/cart/items/${variantUuid}`, data),

  /**
   * Remove from Cart
   * DELETE /v1/shop/cart/items/:variantUuid
   */
  removeFromCart: (variantUuid: string) =>
    apiClient.delete<Cart>(`${BASE}/cart/items/${variantUuid}`),

  /**
   * Apply Coupon
   * POST /v1/shop/cart/apply-coupon
   */
  applyCoupon: (code: string) =>
    apiClient.post<Cart>(`${BASE}/cart/apply-coupon`, { code }),

  /**
   * Remove Coupon
   * DELETE /v1/shop/cart/coupon
   */
  removeCoupon: () =>
    apiClient.delete<Cart>(`${BASE}/cart/coupon`),

  // ============================================================================
  // ADDRESSES
  // ============================================================================

  /**
   * Get Addresses
   * GET /v1/shop/addresses
   */
  getAddresses: () =>
    apiClient.get<Address[]>(`${BASE}/addresses`),

  /**
   * Create Address
   * POST /v1/shop/addresses
   */
  createAddress: (data: CreateAddressRequest) =>
    apiClient.post<Address>(`${BASE}/addresses`, data),

  /**
   * Update Address
   * PUT /v1/shop/addresses/:uuid
   */
  updateAddress: (uuid: string, data: UpdateAddressRequest) =>
    apiClient.put<Address>(`${BASE}/addresses/${uuid}`, data),

  /**
   * Delete Address
   * DELETE /v1/shop/addresses/:uuid
   */
  deleteAddress: (uuid: string) =>
    apiClient.delete(`${BASE}/addresses/${uuid}`),

  /**
   * Set Default Address
   * PUT /v1/shop/addresses/:uuid/default
   */
  setDefaultAddress: (uuid: string) =>
    apiClient.put<Address>(`${BASE}/addresses/${uuid}/default`),

  // ============================================================================
  // CHECKOUT & ORDERS
  // ============================================================================

  /**
   * Checkout (Create Order)
   * POST /v1/shop/checkout
   */
  checkout: (data: CheckoutRequest) =>
    apiClient.post<Order>(`${BASE}/checkout`, data),

  /**
   * Create Razorpay Order
   * POST /v1/shop/checkout/:uuid/razorpay-order
   */
  createRazorpayOrder: (orderUuid: string) =>
    apiClient.post<RazorpayOrderResponse>(`${BASE}/checkout/${orderUuid}/razorpay-order`),

  /**
   * Verify Payment
   * POST /v1/shop/checkout/verify-payment
   */
  verifyPayment: (data: VerifyPaymentRequest) =>
    apiClient.post<Order>(`${BASE}/checkout/verify-payment`, data),

  /**
   * Get Customer Orders
   * GET /v1/shop/orders
   */
  getOrders: () =>
    apiClient.get<OrderSummary[]>(`${BASE}/orders`),

  /**
   * Get Order Details
   * GET /v1/shop/orders/:uuid
   */
  getOrder: (uuid: string) =>
    apiClient.get<Order>(`${BASE}/orders/${uuid}`),

  /**
   * Cancel Order
   * POST /v1/shop/orders/:uuid/cancel
   */
  cancelOrder: (uuid: string) =>
    apiClient.post<Order>(`${BASE}/orders/${uuid}/cancel`),

  // ============================================================================
  // WISHLIST
  // ============================================================================

  /**
   * Get Wishlist
   * GET /v1/shop/wishlist
   */
  getWishlist: () =>
    apiClient.get<WishlistItem[]>(`${BASE}/wishlist`),

  /**
   * Add to Wishlist
   * POST /v1/shop/wishlist/:variantUuid
   */
  addToWishlist: (variantUuid: string) =>
    apiClient.post<WishlistItem>(`${BASE}/wishlist/${variantUuid}`),

  /**
   * Remove from Wishlist
   * DELETE /v1/shop/wishlist/:variantUuid
   */
  removeFromWishlist: (variantUuid: string) =>
    apiClient.delete(`${BASE}/wishlist/${variantUuid}`),

  // ============================================================================
  // REVIEWS
  // ============================================================================

  /**
   * Get Product Reviews
   * GET /v1/shop/products/:groupUuid/reviews
   */
  getProductReviews: (groupUuid: string) =>
    apiClient.get<ProductReviewsResponse>(`${BASE}/products/${groupUuid}/reviews`),

  /**
   * Create Review
   * POST /v1/shop/reviews
   */
  createReview: (data: CreateReviewRequest) =>
    apiClient.post<Review>(`${BASE}/reviews`, data),
};
