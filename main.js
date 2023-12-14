let eventBus = new Vue()

Vue.component('product', {
    template: `
<div class="product">

    <div class="product-image">
      <img :src="image" :alt="altText"/>
    </div>
    <div class="product-info">
      <h1>{{ title }}</h1>
      <a :href="link">More products like this</a>
      <p v-if="inStock">In stock</p>
      <p v-else-if="variants.variantQuantity <= 10 && variants.variantQuantity > 0">Almost sold out!</p>
      <p
              v-else
              :class="{ outOfStock: !inStock }"
      >
        Out of stock
      </p>
      <span v-show="onSale">{{ sale }}</span>
      <div
              class="color-box"
              v-for="(variant, index) in variants"
              :key="variant.variantId"
              :style="{ backgroundColor:variant.variantColor }"
              @mouseover="updateProduct(index)"
      ></div>
      <ul>
        <li v-for="size in sizes">{{ size }}</li>
      </ul>
       
      <button
              @click="addToCart"
              :disabled="!inStock"
              :class="{ disabledButton: !inStock }"
      >
        Add to cart
      </button>

      <button @click="removeFromCart">Remove from cart</button>
      <product-tabs 
      :premium="premium"
      :reviews="reviews"></product-tabs>
  </div>
