export default {
  template: `
        <div>
            <span class="count" :text="count"></span>
            <button @click="count++">Increment</button>
        </div>
    `,
  mounted() {
    //console.log(this.count);
  },
  data() {
    return {
      count: 0,
    };
  },
};
