<template>
  <div>
    <input type="text" class="coupon-code" v-model="code" @input="validate" />
    <p>{{feedback}}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      code: "",
      coupons: [
        {
          code: "50OFF",
          message: "50% Off!",
          discount: 50
        },
        {
          code: "FREE",
          message: "Entirly Free!",
          discount: 100
        }
      ],
      valid: false
    };
  },
  computed: {
    selectedCoupon() {
      return this.coupons.find(coupon => coupon.code == this.code);
    },
    message() {
      return this.selectedCoupon ? this.selectedCoupon.message : "";
    },
    feedback() {
      if (this.valid) {
        return `Coupon Redeemed: ${this.message}`;
      }
      return "Invalid Coupon Code";
    }
  },
  methods: {
    validate() {
      this.valid = !!this.selectedCoupon;
      //this.valid = this.coupons.map(coupon => coupon.code).includes(this.code);
      if (this.valid) {
        this.$emit("applied", this.selectedCoupon.discount);
      }
    }
  }
};
</script>