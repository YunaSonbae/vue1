let eventBus = new Vue()

Vue.component('product', {
    template: `
        <div class="product">
            <div class="product-image">
                <img :src="image" :alt="altText"/>
            </div>
                <div class="product-info">
                        <h1>{{ title }}</h1>
                        <p v-if=" inStock > 5">В наличии: {{inStock}} товаров</p>
                        <p v-else-if="inStock <= 5 && inStock > 0">Почти распроданно : {{inStock}} товаров</p>
                        <p :class="{ OutOfinStock: inStock <= 0 }" v-else="inStock">Нет в наличии</p>
                        <span v-show="OnSale && inStock > 0">{{ Sale }}</span> 
                        <div
                        class="color-box"
                        v-for="(variant, index) in variants"
                        :key="variant.variantId"
                        :style="{ backgroundColor:variant.variantColor }"    
                        @mouseover="updateProduct(index)">  <!-- @ = v-on -->
                </div>

                <form><label v-for="size in sizes">{{ size }}</form>

            <button @click="addToCart" :disabled="inStock <= 0" :class="{ disabledButton: inStock <= 0 }">Добавить в корзину</button>

            <button @click="removeCart" :disabled="inStock <= 0" :class="{ disabledButton: inStock <= 0 }">Удалить товар</button>

               <a href="https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks" data-toggle="tooltip" title="Больше товаров" class="text-primary">{{ link }}</a></p>
             
        <product-tabs :reviews="reviews" :premium="premium"></product-tabs>
        </div>
    </div>
    
  `,
    data() {
        return {
            product: "Socks",
            selectedVariant: 0,
            altText: "A pair of socks",
            brand: 'Vue Mastery',
            OnSale: true,
            reviews: [],
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [{variantId: 2234, variantColor: 'green', variantImage: "./assets/vmSocks-green-onWhite.jpg", variantQuantity: 5}, 
                        {variantId: 2235, variantColor: 'blue', variantImage: "./assets/vmSocks-blue-onWhite.jpg", variantQuantity: 5}],
            sizes: ['S ', 'M ', 'L ', 'XL ', 'XXL ', 'XXXL '],
        }
    },
    props: { 
        premium: {
            type: Boolean,
            required: true
        }
    }, 
    methods: {      
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
            this.variants[this.selectedVariant].variantQuantity -= 1
        },
    
        removeCart() {
            this.$emit('return-to-cart', this.variants[this.selectedVariant].variantId);
            this.variants[this.selectedVariant].variantQuantity += 1
           
            },
    
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },
    },   
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        }) 

        
    },
    
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        }, 
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        Sale(){
            return "Проходит распродажа";
        },
        shipping() {  
            if (this.premium) {
                return "бесплатно";
            } else {
                return 2.99
            }
         }  
    },    
 })
 
Vue.component('product-details', {
    template: `
        <ul>
            <li v-for="detail in details"> {{ detail }}</li>  <!-- v-for - перебирает массив -->
        </ul>
  `,
    data() {
        return {
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
        }
    }
 })
 
 Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">
    <p v-if="errors.length">
      <b>Исправьте ошибки:</b>
           <ul>
             <li v-for="error in errors">{{ error }}</li>
           </ul>
    </p>
  
  <div class="picked">
  
  <p>Рекомендовали-бы этот продукт?</p>
   <input type="radio" id="Yes" value="ДА" name="picked"  v-model="picked" />
          <label for="Yes">Да</label>
    <br />
    <input type="radio" id="No" value="НЕТ" name="picked" v-model="picked" />
          <label for="No">Нет</label>
    <br />
  
  </div>
  
   <p>
     <label for="name">Название:</label>
     <input id="name" v-model="name" placeholder="name">
   </p>
  
   <p>
     <label for="review">Комментарий:</label>
     <textarea id="review" v-model="review"></textarea>
   </p>
  
   <p>
     <label for="rating">Оценка:</label>
     <select id="rating" v-model.number="rating">
       <option>5</option>
       <option>4</option>
       <option>3</option>
       <option>2</option>
       <option>1</option>
     </select>
   </p>
  
   <p>
     <input type="submit" value="Подтвердить"> 
   </p>
</form>
  `,
    data() {
        return {
            picked: '',
            name: null,
            review: null,
            rating: null,
            errors: [],
        }
    },
    methods:{
        onSubmit() {
            if (this.name && this.review && this.rating && this.picked) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    picked: this.picked
                }
                eventBus.$emit('review-submitted', productReview)
                this.errors.length = 0
                this.name = null
                this.review = null
                this.rating = null
                this.picked = null
            } else {
                this.errors.length = 0
                if (!this.name) this.errors.push("Необходимо название")
                if (!this.review) this.errors.push("Необходим комментарий")
                if (!this.rating) this.errors.push("Необходима оценка")
                if (!this.picked) this.errors.push("необходим выбор")
            }
        },


    },

})

Vue.component('product-tabs', {
    template: `
   <div>   
       <ul>
            <span class="tab"
                :class="{ activeTab: selectedTab === tab }"
                v-for="(tab, index) in tabs"
                @click="selectedTab = tab">{{ tab }}
            </span>
       </ul>
       <div v-show="selectedTab == 'Отзывы'">
       
            <h2>Отзывы</h2>
            
            
                    <ul>
                      <li v-for="review in reviews">
                      <p>Название:{{ review.name }}</p>
                      <p>Рейтинг: {{ review.rating }}</p>
                      <p>Комментарий:{{ review.review }}</p>
                      <span>Рекомендация: {{ review.picked }}</span>
                      </li>
                    </ul>
        </div>
            <div v-show="selectedTab === 'Оставить отзыв'">
                <product-review></product-review>
            </div>
        
            <div v-show="selectedTab === 'Доставка'">
                <p>Доставка: {{ shipping }}</p>
            </div>
        
            <div v-show="selectedTab === 'Информация'">
                <product-details/>
            </div>
        
     </div>
   
 `,
    data() {
        return {
            tabs: ['Отзывы', 'Оставить отзыв', 'Доставка', 'Информация'],
            selectedTab: 'Отзывы'  
        }
    },
    props: {

        reviews: {
            type: Array,
            required: false,
            },

        premium: {
            type: Boolean,
            required: true
        }
    },
    computed: {

        shipping() {
            if (this.premium) {
                return "Бесплатно";
            } else {
                return 2.99
            }
        }
    }

})

Vue.component('cart', {
    template: `
    <div class="cart">
        <p>Товаров в корзине: {{ cart }}</p>
    </div>
  `,
    data() {
        return {
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
        }
    }
 })

 let app = new Vue({
    el: '#app', 
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        returnCart() {
            this.cart.pop();
        }
    },

              
 })