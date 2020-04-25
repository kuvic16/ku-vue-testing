import { mount } from "vue-test-utils";
import Counter from "../src/components/Counter.vue";
import expect from "expect";

describe("Counter", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(Counter);
  });

  it("defaults to a count of 0", () => {
    expect(wrapper.vm.count).toBe(0);
  });

  it("increments the count when the button is clicked", () => {
    expect(wrapper.vm.count).toBe(0);
    wrapper.find(".increment").trigger("click");
    expect(wrapper.vm.count).toBe(1);
  });

  it("decrements the count when the button is clicked", () => {
    expect(wrapper.vm.count).toBe(0);
    wrapper.find(".increment").trigger("click");
    wrapper.find(".increment").trigger("click");

    wrapper.find(".decrement").trigger("click");

    expect(wrapper.vm.count).toBe(1);
  });

  it("another way: decrements the count when the button is clicked", () => {
    wrapper.setData({ count: 5 });
    wrapper.find(".decrement").trigger("click");
    expect(wrapper.vm.count).toBe(4);
  });

  it("never goes below 0", () => {
    expect(wrapper.vm.count).toBe(0);
    wrapper.find(".decrement").trigger("click");
    expect(wrapper.vm.count).toBe(0);
  });

  it("decrement button visible when count is greater than 0", () => {
    expect(wrapper.vm.count).toBe(0);
    expect(wrapper.find(".decrement").hasStyle("display", "none")).toBe(true);
    wrapper.find(".increment").trigger("click");
    expect(wrapper.find(".decrement").hasStyle("display", "none")).toBe(false);
  });

  it("presents the current count", () => {
    expect(wrapper.find(".count").html()).toContain(0);
    wrapper.find(".increment").trigger("click");
    expect(wrapper.find(".count").html()).toContain(1);
  });
});
