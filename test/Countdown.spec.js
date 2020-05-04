import { mount } from "vue-test-utils";
import expect from "expect";
import Countdown from "../src/components/Countdown.vue";
import moment from "moment";
import sinon from "sinon";

describe("Countdown", () => {
  let wrapper, clock;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
    wrapper = mount(Countdown, {
      propsData: {
        until: moment().add(10, "seconds"),
      },
    });
  });

  afterEach(() => clock.restore());

  it("renders a countdown timer", () => {
    // <Countdown until="May 5 2020">
    see("0 Days");
    see("0 Hours");
    see("0 Minutes");
    see("10 Seconds");
  });

  it("reduces the countdown every second", async () => {
    see("10 Seconds");
    clock.tick(1000);
    await wrapper.vm.$nextTick();
    see("9 Seconds");
  });

  it("shows an expired message when the countdown has expired", async () => {
    clock.tick(10000);
    await wrapper.vm.$nextTick();
    see("Now Expired");
  });

  it("shows a custom expired message when the countdown has completed", async () => {
    wrapper.setProps({
      expiredText: "Contest is over.",
    });
    clock.tick(10000);
    await wrapper.vm.$nextTick();
    see("Contest is over.");
  });

  // <Countdown @finished="method">
  if (
    ("broadcasts when the countdown is finished",
    async () => {
      clock.tick(10000);
      await wrapper.vm.$nextTick();
      clock.tick(5000);
      expect(wrapper.emitted().finished).toBeTruthy();
    })
  );

  it("clears the internal once completed", async () => {
    clock.tick(10000);
    expect(wrapper.vm.now.getSeconds()).toBe(10);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.now.getSeconds()).toBe(10);
  });

  // helper function
  let see = (text, selector) => {
    let wrap = selector ? wrapper.find(selector) : wrapper;
    expect(wrap.html()).toContain(text);
  };

  let click = (selector) => {
    wrapper.find(selector).trigger("click");
  };

  let type = (text, selector) => {
    let node = wrapper.find(selector);

    node.element.value = text;
    node.trigger("input");
  };

  let assertOnNextTick = (callback, done) => {
    wrapper.vm.$nextTick(() => {
      try {
        callback();
        done();
      } catch (e) {
        done(e);
      }
    });
  };
});
